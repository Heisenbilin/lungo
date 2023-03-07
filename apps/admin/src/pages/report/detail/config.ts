import { accSub, accMul, accDiv } from '@vben/utils'; //accAdd,
import { useAppTheme } from '@vben/hooks';
const { isDark } = useAppTheme()
export const INDEX_LIST = [
  {
    name: 'DNS 域名解析时间',
    rule: 'domainLookupEnd - domainLookupStart',
    weight: '5%',
    score: [
      {
        time: '0–15ms',
        score: '75-100',
      },
      {
        time: '15–30ms',
        score: '50–74',
      },
      {
        time: '30～100ms',
        score: '0–49',
      },
    ],
  },
  {
    name: 'TCP 连接时间',
    rule: 'connectEnd - connectStart',
    weight: '5%',
    score: [
      {
        time: '0–100ms',
        score: '75-100',
      },
      {
        time: '100–200ms',
        score: '50–74',
      },
      {
        time: '200-300ms',
        score: '0–49',
      },
    ],
  },
  {
    name: 'TTFB',
    rule: 'responseStart - requestStart',
    weight: '15%',
    score: [
      {
        time: '0–300ms',
        score: '75-100',
      },
      {
        time: '300-500ms',
        score: '50–74',
      },
      {
        time: '500-700ms',
        score: '0–49',
      },
    ],
  },
  {
    name: 'FP 第一个像素渲染时间',
    rule: 'getEntries：name === first-paint',
    weight: '25%',
    score: [
      {
        time: '0–2000',
        score: '75-100',
      },
      {
        time: '2000–4000ms',
        score: '50–74',
      },
      {
        time: '4000-6000ms',
        score: '0–49',
      },
    ],
  },
  {
    name: 'TTI',
    rule: 'domInteractive - fetchStart',
    weight: '5%',
    score: [
      {
        time: '0–3800ms',
        score: '75-100',
      },
      {
        time: '3800–7300ms',
        score: '50–74',
      },
      {
        time: '7300-9000ms',
        score: '0–49',
      },
    ],
  },
  {
    name: 'FCP',
    rule: 'first-contentful-paint',
    weight: '5%',
    score: [
      {
        time: '0–2000ms',
        score: '75-100',
      },
      {
        time: '2000–4000ms',
        score: '50–74',
      },
      {
        time: '4000-6000ms',
        score: '0–49',
      },
    ],
  },
];

export function getAvgOptions(data) {
  const dataArr = [
    getValByName(data, 'dns'),
    getValByName(data, 'tcp'),
    getValByName(data, 'ttfb'),
    getValByName(data, 'fp'),
    getValByName(data, 'tti'),
    getValByName(data, 'fcp'),
  ];
  const option = {
    title: {
      text: '1.1 常见性能指标平均值',
      textStyle: {
        fontSize: 20,
        color:  !isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgb(212, 212, 213)',
        fontWeight: 'bold',
        margin: '20px 10px',
      },
    },
    color: ['#5ECA75'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      axisLabel: {
        formatter: '{value} ms',
      },
    },
    yAxis: {
      type: 'category',
      data: ['DNS', 'TCP', 'TTFB', 'FP', 'TTI', 'FCP'],
    },
    series: [
      {
        type: 'bar',
        data: dataArr,
      },
    ],
  };
  return option;
}

export function getProOptions(data) {
  // const option;
  const series = [
    {
      name: 'DNS',
      type: 'line',
      data: getArrByName(data.data, 'dns'),
    },
    {
      name: 'TCP',
      type: 'line',
      data: getArrByName(data.data, 'tcp'),
    },
    {
      name: 'TTI',
      type: 'line',
      data: getArrByName(data.data, 'tti'),
    },
    {
      name: 'FP',
      type: 'line',
      data: getArrByName(data.data, 'fp'),
    },
    {
      name: 'FCP',
      type: 'line',
      data: getArrByName(data.data, 'fcp'),
    },
    {
      name: 'TTFB',
      type: 'line',
      data: getArrByName(data.data, 'ttfb'),
    },
  ];
 const option = {
    title: {
      text: '1.3 常见性能日趋势图',
      textStyle: {
        fontSize: 20,
        color:  !isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgb(212, 212, 213)',
        fontWeight: 'bold',
        margin: '20px 10px',
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['DNS', 'TCP', 'TTI', 'FP', 'FCP', 'TTFB'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.time,
    },
    yAxis: {
      type: 'value',
    },
    series: series,
  };
  return option;
}
function getValByName(arr, name) {
  let res = 0;
  arr.forEach(e => {
    if (e.board_count === name) {
      res = e.board_average;
    }
  });
  return res;
}

function getArrByName(arr, name) {
  let res = [];
  arr.forEach(e => {
    if (e.type === name) {
      res = e.average;
    }
  });
  return res;
}

// export function getScore(num) {
//   if (num > 5) return 0
//   if (num < 1) {
//     return 100 - 25 * num
//   }
//   if (num >= 1 && num < 3) {
//     return 75 - (25 * (num - 1) / 2)
//   }
//   if (num >= 3) {
//     return 50 - (25 * (num - 3))
//   }
// }
export function getScore(num) {
  if (num > 5) return 0;
  if (num < 1) {
    return accSub(100, accMul(25, num));
    //100 - 25 * num
  }
  if (num >= 1 && num < 3) {
    return accSub(75, accMul(25, accDiv(accSub(num, 1), 2)));
    //75 - (25 * (num - 1) / 2)
  }
  if (num >= 3) {
    return accSub(50, accMul(25, accSub(num, 3)));
    //50 - (25 * (num - 3))
  }
}

export function getUrlErrorOptions(data, score) {
  return {
    tooltip: {
      trigger: 'item',
    },
    color: [score < 50 ? '#EC5C4C' : score < 75 ? '#F3A73B' : '#5ECA75'],
    legend: {
      orient: 'vertical',
      right: 10,
      top: 20,
    },
    series: [
      {
        name: '异常分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          color: '#4c4a4a',
          formatter: '{total|' + score + '分}',
          rich: {
            total: {
              fontSize: 35,
              fontFamily: '微软雅黑',
              color: '#454c5c',
            },
          },
        },
        labelLine: {
          show: false,
        },
        data: data,
      },
    ],
  };
}
