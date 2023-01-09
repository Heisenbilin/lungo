import { tabActiveFilters, tabNameConfig } from "@vben/constants";

// 筛选条件作用的tab页
export const filtersActiveTab = (() => {
  const result = {};
  for (let tab in tabActiveFilters) {
    tabActiveFilters[tab].forEach((key) => {
      if (result[key]) result[key].push(tabNameConfig[tab]);
      else result[key] = [tabNameConfig[tab]];
    });
  }
  return result;
})();
