//饼图基础配置
export const pieChartOption: any = {
  tooltip: {
    trigger: "item",
    confine: true,
  },
  legend: {
    type: "scroll",
    orient: "vertical",
    left: "right",
  },
  series: [
    {
      name: "",
      type: "pie",
      radius: ["40%", "70%"],
      center: ["35%", "50%"],
      animationEasing: "cubicInOut",
      animationDuration: 3000,
      label: {
        show: false,
      },
    },
  ],
};

//饼图基础配置
export const logInfoTitle: any = {
  text: "提示：点击饼图可查看对应日志",
  bottom: "0",
  right: "0",
  textStyle: {
    color: "#909399",
    fontSize: 14,
  },
};

//折线图基础配置
export const lineChartOption: any = {
  tooltip: {
    axisPointer: {
      type: "cross",
    },
    trigger: "axis",
    position(pt) {
      return [pt[0], "10%"];
    },
  },
  legend: {},
  grid: {
    top: "10%",
    left: "2%",
    right: "2%",
    bottom: "2%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
  },
  yAxis: {
    type: "value",
  },
  series: [],
};

//柱状图基础配置
export const barChartOption: any = {
  tooltip: {},
  legend: {},
  grid: {
    top: "10%",
    left: "2%",
    right: "2%",
    bottom: "2%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      type: "bar",
      data: [],
      barMaxWidth: 40,
    },
  ],
};
