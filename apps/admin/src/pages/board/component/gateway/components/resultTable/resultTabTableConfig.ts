import { cloneDeep } from "@vben/utils";

const defaultColumns = [
  {
    title: "序号",
    align: "center",
    width: "5%",
    key: "serial",
  },
  {
    title: "URL",
    dataIndex: "url",
    width: "70%",
    key: "url",
    // slots: { customRender: "api" },
  },
  {
    title: "请求数量",
    dataIndex: "count",
    key: "count",
    align: "center",
    // slots: { customRender: "count" },
  },
  {
    title: "操作",
    align: "center",
    width: "16%",
    key: "operation",
    // slots: { customRender: "operation" },
  },
];

export const getDefaultColumns = () => {
  return cloneDeep(defaultColumns);
};
