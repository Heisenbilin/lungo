import { getMap, registerMap } from "@vben/hooks";
import { cloneDeep, commafy } from "@vben/utils";
import china from "./chinaMapData.json";

registerMap("china", china);
var mapFeatures = getMap("china").geoJson.features;
var geoCoordMap = {};
mapFeatures.forEach((v) => {
  // 地区名称
  var name = v.properties.name;
  // 地区经纬度
  geoCoordMap[name] = v.properties.cp;
});
const provinces = [
  "北京",
  "天津",
  "河北",
  "山西",
  "内蒙古",
  "辽宁",
  "吉林",
  "黑龙江",
  "上海",
  "江苏",
  "浙江",
  "安徽",
  "福建",
  "江西",
  "山东",
  "河南",
  "湖北",
  "湖南",
  "重庆",
  "四川",
  "贵州",
  "云南",
  "西藏",
  "陕西",
  "甘肃",
  "青海",
  "宁夏",
  "新疆",
  "广东",
  "广西",
  "海南",
  "香港",
  "澳门",
  "台湾",
];

const defaultOption: any = {
  title: {
    text: "其他地域",
    textStyle: {
      fontSize: 14,
      fontWeight: "bold",
    },
    left: "65%",
    top: "50%",
  },
  tooltip: {
    trigger: "item",
    formatter: (params) => {
      if (params.data && "pageload" in params.data) {
        return `${params.name}<br/>PV数: ${commafy(
          params.value[2] !== undefined ? params.value[2] : params.value
        )}<br/>页面平均加载时间: ${commafy(params.data.pageload)}ms`;
      }
    },
  },
  grid: {
    left: "65%",
    right: "3%",
    top: "50%",
    bottom: "4%",
    containLabel: true,
  },
  visualMap: {
    show: true,
    min: 0,
    max: 200,
    left: "left",
    top: "bottom",
    text: ["PV高", "PV低"], // 文本，默认为数值文本
    calculable: true,
    seriesIndex: [1],
    inRange: {
      color: ["#285E93", "#92CC76"], // 蓝绿
    },
  },
  geo: {
    show: true,
    left: "10%",
    map: "china",
    label: { show: false },
    emphasis: {
      label: { show: false },
      itemStyle: {
        areaColor: "#2B91B7",
      },
    },
    roam: true,
    itemStyle: {
      areaColor: "#031525",
      borderColor: "#3B5077",
    },
    scaleLimit: {
      min: 1,
      max: 3,
    },
  },
  xAxis: {
    type: "value",
    inverse: true,
    splitLine: {
      show: false,
    },
  },
  yAxis: {
    type: "category",
    data: [],
    position: "right",
    splitLine: {
      inside: false,
    },
  },
  series: [
    {
      name: "散点",
      type: "scatter",
      coordinateSystem: "geo",
      label: {
        formatter: "{b}",
        position: "right",
        show: true,
      },
      emphasis: {
        label: { show: true },
      },
      itemStyle: {
        color: "#05C3F9",
      },
    },
    {
      type: "map",
      map: "china",
      geoIndex: 0,
      aspectScale: 0.75, //长宽比
      showLegendSymbol: false, // 存在legend时显示
      label: { show: true },
      emphasis: {
        label: {
          show: false,
        },
      },
      roam: true,
      itemStyle: {
        areaColor: "#031525",
        borderColor: "#3B5077",
      },
      animation: false,
    },
    {
      name: "点",
      type: "scatter",
      coordinateSystem: "geo",
      symbol: "pin", //气泡
      label: {
        show: true,
        color: "#fff",
        fontSize: 9,
        formatter: (item) => item.value[2],
      },
      itemStyle: {
        color: "#F62157", //标志颜色
      },
      zlevel: 6,
    },
    {
      name: "Top 5",
      type: "effectScatter",
      coordinateSystem: "geo",
      showEffectOn: "render",
      rippleEffect: {
        brushType: "stroke",
      },
      emphasis: {
        scale: true,
      },
      label: {
        formatter: "{b}",
        position: "right",
        show: true,
      },
      itemStyle: {
        color: "yellow",
        shadowBlur: 10,
        shadowColor: "yellow",
      },
      zlevel: 1,
    },
    {
      name: "其他",
      right: "30%",
      data: [],
      type: "bar",
      label: {
        show: true,
        position: "left",
      },
    },
  ],
};

const convertData = (value) => {
  var res: any[] = [];
  for (var i = 0; i < value.length; i++) {
    var geoCoord = geoCoordMap[value[i].name];
    if (geoCoord) {
      res.push({
        name: value[i].name,
        value: geoCoord.concat(value[i].value),
        pageload: value[i].pageload,
      });
    }
  }
  return res;
};

//将接口返回值处理成“地域分布”图表数据
export function getUAMapOption(data) {
  if (!(Array.isArray(data) && data.length)) {
    return null;
  }
  const chartOption = cloneDeep(defaultOption);
  const { mapData, barData } = cleanData(data);

  //最大值最小值，辅助规划水滴大小
  const max = Math.max(...mapData.map((item) => item.value));
  const min = Math.min(...mapData.map((item) => item.value));
  //水滴图标最大最小值
  const maxSize4Pin = 50,
    maxSizeTop = 20,
    minSize4Pin = 20,
    minSizeTop = 10,
    minSizePin = 1;

  const convertedData = convertData(mapData);

  //存入地图数据
  chartOption.series[0].data = convertedData;
  chartOption.series[1].data = mapData;
  chartOption.series[2].data = convertedData;
  chartOption.series[3].data = convertData(
    mapData
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .filter((v) => v.value > 0)
  );

  //存入其他数据到柱状图中
  chartOption.yAxis.data = barData.map((item: any) => item.name);
  chartOption.series[4].data = barData;
  //动态规划柱状图具体顶部的top位置
  const top = 10 + (16 - barData.length) * 5;
  chartOption.grid.top = (top < 5 ? 5 : top) + "%";
  chartOption.title.top = (top < 5 ? 0 : top - 5) + "%";

  //调整热力图区间
  chartOption.visualMap.max = max;

  //绑定地图省份图标大小计算方法
  chartOption.series[0].symbolSize = (val) => {
    var a = (maxSizeTop - minSizePin) / (max - min);
    var b = minSizePin - a * min;
    b = maxSizeTop - a * max;
    return a * val[2] + b;
  };

  //绑定Top5高亮波纹大小计算方法
  chartOption.series[3].symbolSize = (val) => {
    var a = (maxSizeTop - minSizeTop) / (max - min);
    var b = minSizeTop - a * min;
    b = maxSizeTop - a * max;
    return a * val[2] + b;
  };

  //绑定水滴大小计算方法
  chartOption.series[2].symbolSize = (val) => {
    var a = (maxSize4Pin - minSize4Pin) / (max - min);
    var b = minSize4Pin - a * min;
    b = maxSize4Pin - a * max;
    return a * val[2] + b;
  };

  const maxBarSize = 15;

  if (barData.length > maxBarSize) {
    chartOption.dataZoom = [
      {
        show: true,
        type: "slider",
        yAxisIndex: [0],
        left: "95%",
        start: 0,
        end: (maxBarSize / barData.length) * 100,
      },
    ];
    chartOption.grid.right = "6%";
  }

  return chartOption;
}

//清洗数据
export const cleanData = (data) => {
  const mapData = provinces.map((item) => ({
    name: item,
    value: 0,
    pageload: 0,
  }));
  let barData: any[] = [];
  //遍历后台数据，聚合至合适的省份中
  data.forEach((item) => {
    let isMatch = false;
    const name = item.board_key || "未知";
    const value = item.board_count;
    const pageload = item.pageload;
    //聚合数据
    mapData.forEach((province) => {
      if (name.includes(province.name)) {
        isMatch = true;
        province.pageload = +(
          (province.value * province.pageload + value * pageload) /
          (province.value + value)
        ).toFixed(1);
        province.value += value;
      }
    });
    if (!isMatch) {
      barData.push({ name, value, pageload });
    }
  });
  barData = barData.sort((a, b) => b.value - a.value);
  return { mapData, barData };
};
