import { tabActiveFilters, tabName } from "@vben/constants";

// 筛选条件作用的tab页
export const filtersActiveTab = (() => {
  const result = {};
  for (let tab in tabActiveFilters) {
    tabActiveFilters[tab].forEach((key) => {
      if (result[key]) result[key].push(tabName[tab]);
      else result[key] = [tabName[tab]];
    });
  }
  return result;
})();
