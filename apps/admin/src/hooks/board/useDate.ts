import dayjs from 'dayjs'
import { useBoardStore } from '@/store/modules/board'
const boardStore = useBoardStore()

export const datePickerRanges = {
  今天: [
    dayjs().startOf('day').subtract(0, 'day'),
    dayjs()
      .minute(10 * Math.floor(dayjs().minute() / 10))
      .second(0),
  ],
  最近三天: [
    dayjs().startOf('day').subtract(3, 'day'),
    dayjs()
      .minute(10 * Math.floor(dayjs().minute() / 10))
      .second(0),
  ],
  最近一周: [
    dayjs().startOf('day').subtract(7, 'day'),
    dayjs()
      .minute(10 * Math.floor(dayjs().minute() / 10))
      .second(0),
  ],
  最近两周: [
    dayjs().startOf('day').subtract(14, 'day'),
    dayjs()
      .minute(10 * Math.floor(dayjs().minute() / 10))
      .second(0),
  ],
  最近三周: [
    dayjs().startOf('day').subtract(21, 'day'),
    dayjs()
      .minute(10 * Math.floor(dayjs().minute() / 10))
      .second(0),
  ],
}

export const addTimeFilter = (params, chart) => {
  let pointInPixel = [params.offsetX, params.offsetY]
  if (chart.containPixel('grid', pointInPixel)) {
    let pointInGrid = chart.convertFromPixel({ seriesIndex: 0 }, pointInPixel)
    let xIndex = pointInGrid[0] //索引
    let handleIndex = Number(xIndex)
    // let seriesObj = chart.getOption(); //图表object对象
    let op = chart.getOption()
    //获得图表中点击的列
    let time = op.xAxis[0].data[handleIndex] //获取点击的列名
    try {
      time = dayjs(time.name || time) // 点击的时间
      const dimension = boardStore.filterState.dimension || 'day' // 维度
      const start_time = time.format('YYYY-MM-DD HH:mm:ss') // 开始时间
      let end_time = '' // 结束时间

      // switch (dimension) {
      //   case 'day':
      //     time.add(1, 'day')
      //     break
      //   case 'hour':
      //     time.add(1, 'h')
      //     break
      //   case 'halfHour':
      //     time.add(30, 'm')
      //     break
      //   default:
      //     return
      // }
      if(dimension == 'day'){
        time.add(1,'d').isAfter(dayjs())?
          end_time = dayjs()
              .minute(10 * Math.floor(dayjs().minute() / 10))
              .second(0)
              .format('YYYY-MM-DD HH:mm:ss')
        :end_time = time.add(1,'day').format('YYYY-MM-DD HH:mm:ss')
      }else if(dimension == 'hour'){
        time.add(1,'h').isAfter(dayjs())?
        end_time = dayjs()
            .minute(10 * Math.floor(dayjs().minute() / 10))
            .second(0)
            .format('YYYY-MM-DD HH:mm:ss') 
      : end_time =  time.add(1,'h').format('YYYY-MM-DD HH:mm:ss')
      }else {
        time.add(30,'m').isAfter(dayjs())?
        end_time = dayjs()
            .minute(10 * Math.floor(dayjs().minute() / 10))
            .second(0)
            .format('YYYY-MM-DD HH:mm:ss') 
      :end_time =  time.add(30,'m').format('YYYY-MM-DD HH:mm:ss')
      }
      // if (time.isAfter(dayjs())) {
      //   debugger
      //   end_time = dayjs()
      //     .minute(10 * Math.floor(dayjs().minute() / 10))
      //     .second(0)
      //     .format('YYYY-MM-DD HH:mm:ss')
      // } else {
      //   debugger
      //   end_time = time.format('YYYY-MM-DD HH:mm:ss')
      // }
      // end_time = time.format('YYYY-MM-DD HH:mm:ss')
      console.log('开始结束时间',start_time, end_time );
      boardStore.addFilterValue({ start_time, end_time })
    } catch (e) {
      console.log(e)
    }
    // console.log(start_time, end_time.format('YY-MM-DD HH-mm-ss'));
    // console.log(handleIndex, seriesObj);
  }
}
