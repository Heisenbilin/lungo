export const changeFormFormat = (arr = []) => {
  let result = {};
  if (arr.length > 0) {
    arr.forEach((item: any) => {
      if (!result[item.field]) {
        result[item.field] = [];
      }
      result[item.field].push({
        key: item.key,
        value: item.value,
      });
    });
  } else {
    return undefined;
  }
  return result;
};