import dayjs from 'dayjs'
import { useBoardStore } from '@/store/modules/board'
const boardStore = useBoardStore()

export const datePickerRanges = {
  今天: [dayjs().startOf('day').subtract(0, 'day'), dayjs().startOf('day').subtract(-1, 'day')],
  昨天: [dayjs().startOf('day').subtract(1, 'day'), dayjs().startOf('day').subtract(0, 'day')],
  最近三天: [dayjs().startOf('day').subtract(2, 'day'), dayjs().startOf('day').subtract(-1, 'day')],
  最近一周: [dayjs().startOf('day').subtract(7, 'day'), dayjs().startOf('day').subtract(-1, 'day')],
  最近三周: [
    dayjs().startOf('day').subtract(21, 'day'),
    dayjs().startOf('day').subtract(-1, 'day'),
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
      time = dayjs(time.name || time.value || time) // 点击的时间
      const dimension = boardStore.filterState.dimension || 'day' // 维度
      const start_time = time.format('YYYY-MM-DD HH:mm:ss') // 开始时间
      let end_time = dayjs().startOf('day').subtract(-1, 'day').format('YYYY-MM-DD HH:mm:ss') // 结束时间
      if (dimension == 'day' && !time.add(1, 'd').isAfter(dayjs())) {
        end_time = time.add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
      } else if (dimension == 'hour' && !time.add(1, 'h').isAfter(dayjs())) {
        end_time = time.add(1, 'h').format('YYYY-MM-DD HH:mm:ss')
      } else if (dimension == 'second' && !time.add(1, 'm').isAfter(dayjs())) {
        end_time = time.add(1, 'm').format('YYYY-MM-DD HH:mm:ss')
      }
      console.log('开始结束时间', start_time, end_time)
      boardStore.addFilterValue({ start_time, end_time })
    } catch (e) {
      console.log(e)
    }
  }
}
