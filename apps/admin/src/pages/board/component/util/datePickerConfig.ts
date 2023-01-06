import moment from "moment";
import { useBoardStore } from "@/store/modules/board";
const boardStore = useBoardStore();

export const datePickerRanges = {
  今天: [
    moment().startOf("day").subtract(0, "day"),
    moment()
      .minute(10 * Math.floor(moment().minutes() / 10))
      .second(0),
  ],
  最近三天: [
    moment().startOf("day").subtract(3, "day"),
    moment()
      .minute(10 * Math.floor(moment().minutes() / 10))
      .second(0),
  ],
  最近一周: [
    moment().startOf("day").subtract(7, "day"),
    moment()
      .minute(10 * Math.floor(moment().minutes() / 10))
      .second(0),
  ],
  最近两周: [
    moment().startOf("day").subtract(14, "day"),
    moment()
      .minute(10 * Math.floor(moment().minutes() / 10))
      .second(0),
  ],
  最近三周: [
    moment().startOf("day").subtract(21, "day"),
    moment()
      .minute(10 * Math.floor(moment().minutes() / 10))
      .second(0),
  ],
};

export const addTimeFilter = (params, chart) => {
  let pointInPixel = [params.offsetX, params.offsetY];
  if (chart.containPixel("grid", pointInPixel)) {
    let pointInGrid = chart.convertFromPixel({ seriesIndex: 0 }, pointInPixel);
    let xIndex = pointInGrid[0]; //索引
    let handleIndex = Number(xIndex);
    // let seriesObj = chart.getOption(); //图表object对象
    let op = chart.getOption();
    //获得图表中点击的列
    let time = op.xAxis[0].data[handleIndex]; //获取点击的列名
    try {
      time = moment(time.name || time); // 点击的时间
      const dimension = boardStore.filterState.dimension || "day"; // 维度
      const start_time = time.format("YYYY-MM-DD HH:mm:ss"); // 开始时间
      let end_time = ""; // 结束时间
      switch (dimension) {
        case "day":
          time.add(1, "d");
          break;
        case "hour":
          time.add(1, "h");
          break;
        case "halfHour":
          time.add(30, "m");
          break;
        default:
          return;
      }
      if (time.isAfter(moment())) {
        end_time = moment()
          .minute(10 * Math.floor(moment().minutes() / 10))
          .second(0)
          .format("YYYY-MM-DD HH:mm:ss");
      } else {
        end_time = time.format("YYYY-MM-DD HH:mm:ss");
      }
      boardStore.addFilterValue({ start_time, end_time });
    } catch (e) {
      console.log(e);
    }
    // console.log(start_time, end_time.format('YY-MM-DD HH-mm-ss'));
    // console.log(handleIndex, seriesObj);
  }
};
