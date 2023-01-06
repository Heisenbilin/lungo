//版本号比较
export const versionStringCompare = (preVersion = "", lastVersion = "") => {
  const sources = preVersion.split(".");
  const dests = lastVersion.split(".");
  const maxL = Math.max(sources.length, dests.length);
  let result = 0;
  for (let i = 0; i < maxL; i++) {
    const preValue: any = sources.length > i ? sources[i] : 0;
    const preNum = isNaN(Number(preValue)) ? preValue.charCodeAt() : Number(preValue);
    const lastValue: any = dests.length > i ? dests[i] : 0;
    const lastNum = isNaN(Number(lastValue)) ? lastValue.charCodeAt() : Number(lastValue);
    if (preNum < lastNum) {
      result = -1;
      break;
    } else if (preNum > lastNum) {
      result = 1;
      break;
    }
  }
  return result;
};

export const compare = function (prop) {
  return function (obj1, obj2) {
    var val1 = obj1[prop];
    var val2 = obj2[prop];
    if (val1 > val2) {
      return -1;
    } else if (val1 < val2) {
      return 1;
    } else {
      return 0;
    }
  };
};
