/*
 *格式化Legend保留一定长度的内容
 */
export function getMainInfo(name, maxSize = 25) {
  //若文字长度不超标
  if (name.length < maxSize) return name;
  //若文字不能用路由‘/’划分
  if (name.indexOf("/") === -1) {
    return name.length > maxSize ? name.substr(0, maxSize) + "..." : name;
  }
  //若文字可被路由‘/’划分，获取最多能展示的位置信息
  var resultArr = name.split("/");
  var currentName = resultArr.pop();
  var prevName = resultArr.length ? resultArr.pop() : null;
  while (prevName && (prevName + currentName).length < maxSize) {
    currentName = prevName + "/" + currentName;
    prevName = resultArr.length ? resultArr.pop() : null;
  }
  var prevMsg = prevName === null ? "" : ".../";
  return (
    prevMsg + (currentName.length > maxSize ? currentName.substr(0, maxSize) + "..." : currentName)
  );
}

/*
 *格式化Legend保留最后一个/后的内容
 */
export function getLastInfo(name) {
  //若文字不能用路由‘/’划分
  if (name.indexOf("/") === -1) return name;
  //若文字可被路由‘/’划分，返回最后一条内容
  return name.split("/").pop();
}
