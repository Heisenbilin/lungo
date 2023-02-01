import { request } from '@vben/request'
enum Api {
  GET_TOPIC_ID = '/getTopicId',
}

/**
 * @description: 获取topicId
 */

export const getKibanaTopicId = (href: any) =>
  request.get<any>({ url: Api.GET_TOPIC_ID, params: { href } })
