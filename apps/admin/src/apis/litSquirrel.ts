import { request } from "@vben/request";

const TaskPath = '/board/taskinfo';
const boardTaskInfo = {
  create(insertData) {
    return request.post({
      url: `${TaskPath}`,
      data: insertData
    });
  },
  delete(boardid) {
    return request.delete({
      url: `${TaskPath}/${boardid}`,
    });
  },
  get(userid, projectid, appid, eventid) {
    return request.get({
      url: `${TaskPath}`,
      params: {
        userid,
        projectid,
        appid,
        eventid,
      },
    });
  },
  update(updateData) {
    return request.put({
      url: `${TaskPath}`,
      data: updateData,
    });
  },
  getChartData(data) {
    return request.post({
      url: `${TaskPath}/chartdata`,
      data,
    }
    );
  },
  getUAData(data) {
    return request.post({ url: '/ua/chartdata', data });
  },
  getBoardData(data) {
    return request.post({ url: '/board/chartdata/getByType', data });
  },
  getTimeSlotDataByType(data) {
    return request.post({ url: 'board/chartdata/getTimeSlotDataByType', data });
  },
  searchEsDataByQuery({ logindex, query, gte, lte }) {
    return request.post({
      url: '/board/chartdata/get_es_info_by_query', data: {
        logindex,
        query,
        gte,
        lte,
      }
    });
  },
};
export const litSquirrelApi = { boardTaskInfo };
