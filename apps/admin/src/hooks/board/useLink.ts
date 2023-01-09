import { useListStore } from "@/store/modules/list";
import { Page } from "@vben/constants";

const { platform } = useListStore();

export const useLinkToUrl = (projectId: string | number, page: Page) => {
  if (platform === "") {
    switch (page) {
      case "board":
        return `/monitor/board?projectId=${projectId}`;
      case "data":
        return `/monitor/data?projectId=${projectId}`;
      case "report":
        return `/monitor/report?projectId=${projectId}`;
    }
  } else if (platform === "huatuo") {
    switch (page) {
      case "board":
        return `/huatuo/board/${projectId}`;
      case "data":
        return `/huatuo/data/${projectId}`;
      case "report":
        return `/huatuo/report/${projectId}`;
    }
  }
  return "";
};
