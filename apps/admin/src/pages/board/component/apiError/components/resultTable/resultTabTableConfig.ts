import { cloneDeep } from "@vben/utils";

const defaultColumns = [
  {
    title: "序号",
    align: "center",
    width: "5%",
    key: "serial",
  },
  {
    title: "请求 URL",
    dataIndex: "resource_url",
    width: "70%",
    key: "resource_url",
    slots: { customRender: "api" },
  },
  {
    title: "请求数量",
    dataIndex: "count",
    key: "count",
    align: "center",
    slots: { customRender: "count" },
  },
  {
    title: "操作",
    align: "center",
    width: "16%",
    key: "operation",
    slots: { customRender: "operation" },
  },
];

export const getDefaultColumns = (type) => {
  if (type === "interface") {
    return cloneDeep(defaultColumns);
  }
  if (type === "domain") {
    const columns = cloneDeep(defaultColumns);
    columns[1] = {
      title: "页面 URL",
      dataIndex: "currenthref",
      width: "70%",
      key: "currenthref",
      slots: { customRender: "url" },
    };
    return columns;
  }
  return cloneDeep(defaultColumns);
};
