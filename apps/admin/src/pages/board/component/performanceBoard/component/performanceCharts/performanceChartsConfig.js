import { cloneDeep } from 'lodash';
import { commafy, getPercentValue } from '/@/utils/math/formatMumber';
import {
  dataAggregateBoardDataByTime,
  dataAggregateBoard2DataByTime,
} from '../../../util/aggregate';

export const boardConfigs = {
  dns: {
    name: 'DNS',
    type: 1,
    description:
      '用于标记完成 dns 域名解析所耗时间。计算规则:\nDNS = domainLookupEnd - domainLookupStart。',
  },
  tcp: {
    name: 'TCP',
    type: 1,
    description: '用于标记完成 tcp 三次握手所耗时间。计算规则：\nTCP = connectEnd - connectStart。',
  },
  fb: {
    name: 'FB',
    type: 2,
    apiName: 'firstByte_num',
    description:
      '首包时间( First Byte ),用于标记网络请求从域名解析开始到从服务器接收到第一个字节的这段时间。计算规则：\nFB = responseStart - domainLookupStart',
  },
  ttfb: {
    name: 'TTFB',
    type: 2,
    apiName: 'ttfb_num',
    description:
      '请求响应耗时(Time to First Byte)，用于标记网络请求从被发起到从服务器接收到第一个字节的这段时间。计算规则：\nTTFB = responseStart - requestStart',
  },
  fp: {
    name: 'FP',
    type: 2,
    apiName: 'firstPaint_num',
    description:
      '首次绘制( First Paint )，用于标记浏览器渲染任何在视觉上不同于导航前屏幕内容之内容的时间点。计算规则：\nFP = responseEnd - fetchStart。',
  },
  fcp: {
    name: 'FCP',
    type: 1,
    description:
      "首次内容绘制( First Contentful Paint )，用于标记浏览器渲染来自 DOM第一位内容的时间点。计算规则：\ngetEntries: name === ' first-contentful-paint '",
  },
  tti: {
    name: 'TTI',
    type: 1,
    description:
      '可交互时间(Time to Interactive)，用于标记应用已进行视觉渲染并能可靠响应用户输入的时间点。\n也就是浏览器完成所有HTML解析并且完成DOM构建，然后在这个时间点浏览器开始加载资源，计算规则：\ntti = domInteractive - fetchStar',
  },
  onload_num: {
    name: 'onLoad',
    type: 2,
    apiName: 'onload_num',
    description:
      '用于标记页面加载完所有依赖的资源所需耗费的时间。\nLoad = 首次渲染时间 + DOM解析耗时 + 同步JS执行 + 资源加载耗时。\n计算规则：Load = loadEventStart - fetchStart',
  },
};

//图表基础配置
const performanceChartConfig = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    formatter: data => {
      const infos = data.map(
        item =>
          `<div class="flex justify-between">
            <div class="mr-1">${item.seriesName}ms:</div>
            <div>${item.data.name}条记录 (占比${item.data.value}%)</div>
          </div>`
      );
      return `<div>
                <h2>${data[0].axisValue}</h2>
                ${infos.join('')}
              <div>`;
    },
  },
  legend: {
    right: '40',
    top: '10',
  },
  grid: {
    left: '32%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  yAxis: {
    type: 'value',
    name: '占比',
    min: 0,
    max: 100,
    axisLabel: {
      formatter: '{value} %',
    },
  },
  xAxis: {
    type: 'category',
    data: [],
  },
  dataZoom: [
    {
      type: 'slider',
      start: 0,
      end: 100,
      show: false,
    },
  ],
  series: [],
};

//将接口返回值处理成图表数据
export function getPerformanceChartOption(data, timeFormatStr, type) {
  data = type ? data[type] : data;
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }
  const chartOption = cloneDeep(performanceChartConfig);
  //聚合数据
  const aggregatedData = !type
    ? dataAggregateBoardDataByTime(data, timeFormatStr)
    : dataAggregateBoard2DataByTime(data, timeFormatStr, type);
  //把聚合后的数据处理成图表数据
  const { dataList, timeList } = handleDataToChartData(aggregatedData);
  chartOption.xAxis.data = timeList;
  chartOption.series = dataList;

  if (timeList.length > 20) {
    chartOption.dataZoom[0].show = true;
    chartOption.grid.bottom = '15%';
  }

  return chartOption;
}

//将数据处理成图表数据
const handleDataToChartData = orginData => {
  const timeList = []; //时间数据
  const nameList = []; //seris名称
  const countList = []; //计数数据
  const percentArrList = []; //百分比数据

  //解析数据
  Object.keys(orginData).forEach((time, index) => {
    timeList.push({ value: time, name: orginData[time].originTime });
    const temp = orginData[time].boardData;
    const countArr = Object.keys(temp).map(key => {
      if (index === 0) nameList.push(key);
      return temp[key];
    });
    countList.push(countArr);
    percentArrList.push(getPercentValue(countArr, 2));
  });
  const dataList = nameList.map((name, i) => ({
    name: name,
    type: 'bar',
    stack: 'total',
    barMaxWidth: 40,
    emphasis: {
      focus: 'series',
    },
    itemStyle: {
      color: getGradientColor(i, nameList.length),
    },
    data: countList.map((_, j) => ({
      name: commafy(countList[j][i]),
      number: countList[j][i],
      value: percentArrList[j][i],
    })),
  }));

  //计算各个范围的总数
  const totalList = dataList.map((item, i) => {
    const sum = item.data.reduce((acc, val) => acc + (isNaN(val.number) ? 0 : val.number), 0);
    return {
      name: nameList[i],
      value: sum ? sum : '',
    };
  });

  //填充数据
  dataList.push({
    type: 'pie',
    id: 'pie',
    radius: ['32%', '60%'],
    center: ['15%', '50%'],
    animationEasing: 'cubicInOut',
    animationDuration: 1000,
    emphasis: {
      focus: 'self',
    },
    itemStyle: {
      color: item => getGradientColor(item.dataIndex, totalList.length),
    },
    label: {
      show: false,
    },
    tooltip: {
      trigger: 'item',
      formatter: '<h2>{b} ms</h2><h4>{c}条记录 ({d}%)</h4>单击设为筛选条件',
    },
    data: totalList,
  });

  return { dataList, timeList };
};

const getGradientColor = (i, total, type = 'greenToBlue') => {
  switch (type) {
    // 绿色渐变到深蓝色
    case 'greenToBlue':
      return `rgba(40, ${200 - parseInt(160 * (i / (total - 1)))}, 147)`;
    // 黄色渐变到红色
    case 'yellowToRed':
      return `rgba(248, ${212 - 158 * (i / (total - 1))}, ${35 - 35 * ((i + 1) / total)})`;
    // 默认：绿色渐变到深蓝色
    default:
      return `rgba(40, ${200 - parseInt(160 * (i / (total - 1)))}, 147)`;
  }
};
