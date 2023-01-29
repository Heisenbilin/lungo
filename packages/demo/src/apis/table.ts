import { request } from '@vben/request'

export function getTableData() {
  return request.post({ url: '/basic-api/demo/table' })
}
