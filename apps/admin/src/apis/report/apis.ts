import { litSquirrelApi } from '@/apis/litSquirrel';
import { reportApis } from '@/apis/report';
import { cloneDeep } from '@vben/utils';

export async function getUAData(params, type) {
  params.filter.uaType = type;
  const result = await litSquirrelApi.boardTaskInfo.getUAData(params);
  return result;
}

export async function getTwoWeeksAverage(params) {
  const result = await reportApis.getTwoWeeksAverage(params);
  return result;
}

export async function getProjectRanking(params) {
  const result = await reportApis.getProjectRanking(params);
  return result;
}

export async function getListById(params) {
  // params = {
  //   project_id: 1631,
  //   start_time: '2021-05-02',
  //   end_time: '2021-06-09'
  // }
  const result = await reportApis.getList(params);
  return result;
}

export async function getProDayPerformance(params) {
  const result = await reportApis.getProDayPerformance(params);
  return result;
}

export async function getLighthouseAudits(params) {
  const result = await reportApis.getLighthouseAudits(params);
  return result;
}

export async function getAveragePerformance(params) {
  const result = await reportApis.getAveragePerformance(params);
  return result;
}

export async function getErrSummary(params) {
  const result = await reportApis.getErrSummary(params);
  return result;
}

export async function getWhiteRate(params) {
  const result = await reportApis.getWhiteRate(params);
  return result;
}

export function getPVUVOptions(data, option) {
  const opt = cloneDeep(option);
  opt.series[0].data = data[0];
  opt.series[1].data = data[1];
  return opt;
}

export function getUAOptions(data, option) {
  const opt = cloneDeep(option);
  opt.series[0].data = data;
  return opt;
}

export function getUAVersionOptions(data, option) {
  const opt = cloneDeep(option);
  opt.yAxis.data = data[0];
  opt.legend.data = data[1];
  for (let i = 0; i < data[2].length; i++) {
    opt.series.push({
      name: data[1][i],
      type: 'bar',
      stack: 'total',
      data: data[2][i],
    });
  }
  return opt;
}

export function getCountOptions(data, option) {
  const opt = cloneDeep(option);
  opt.series[0].data = data[0];
  opt.series[1].data = data[1];
  return opt;
}

export async function getProjectLighthouseStatus(data) {
  return await reportApis.getProjectLighthouseStatus(data);
}

export async function retryLighthouse(data) {
  return await reportApis.retryLighthouse(data);
}
