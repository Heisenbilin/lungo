//版本号比较
export const versionStringCompare = (version1: string = '', version2: string = '') => {
  const arr1 = version1.split('.').map(e => +e)
  const arr2 = version2.split('.').map(e => +e)
  const length = Math.max(arr1.length, arr2.length)
  for (let i = 0; i < length; i++) {
    if ((arr1[i] || 0) > (arr2[i] || 0)) return 1
    if ((arr1[i] || 0) < (arr2[i] || 0)) return -1
  }
  return 0
}

export const compare = function (prop: string) {
  return function (obj1: any, obj2: any) {
    var val1 = obj1[prop]
    var val2 = obj2[prop]
    if (val1 > val2) {
      return -1
    } else if (val1 < val2) {
      return 1
    } else {
      return 0
    }
  }
}
