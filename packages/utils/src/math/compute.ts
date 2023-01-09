/*
 *除法函数，用来得到精确的除法结果
 */
export function accDiv(arg1, arg2) {
let t1 = 0,t2 = 0
  try {
    t1 = arg1.toString().split('.')[1].length;
  } catch (e) {}
  try {
    t2 = arg2.toString().split('.')[1].length;
  } catch (e) {}

const  r1 = Number(arg1.toString().replace('.', ''));
 const r2 = Number(arg2.toString().replace('.', ''));
  return +((r1 / r2) * Math.pow(10, t2 - t1));
}
/*
 *乘法函数，用来得到精确的乘法结果
 */
export function accMul(arg1, arg2) {
  let m = 0
   const s1 = arg1.toString(),s2 = arg2.toString();
  try {
    m += s1.split('.')[1].length;
  } catch (e) {}
  try {
    m += s2.split('.')[1].length;
  } catch (e) {}
  return +((Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m));
}
/*
 *加法函数，用来得到精确的加法结果
 */
export function accAdd(arg1, arg2) {
  let r1, r2
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
 const m = Math.pow(10, Math.max(r1, r2));
  return +((arg1 * m + arg2 * m) / m);
}
/*
 *减法函数，用来得到精确的加法结果
 */
export function accSub(arg1, arg2) {
  let r1, r2
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
 const m = Math.pow(10, Math.max(r1, r2));
  //last modify by deeka
  //动态控制精度长度
 const n = r1 >= r2 ? r1 : r2;
  return +((arg1 * m - arg2 * m) / m).toFixed(n);
}
