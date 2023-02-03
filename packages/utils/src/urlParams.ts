/**
 * 获取地址栏参数
 * @returns Object
 */
export function getUrlParams() {
  const params: any = {}
  try {
    const arr = (window.location.hash.split('?').at(-1) || '').split('&')
    for (let i = 0; i < arr.length; i++) {
      const data = arr[i].split('=')
      if (data.length === 2) {
        params[data[0]] = decodeURIComponent(data[1])
      }
    }
  } catch (e) {
    console.log(e)
  }
  return params
}

/**
 * 获取地址栏参数
 * @returns null
 */
export function addOrUpdateUrlParams(obj) {
  try {
    const params = getUrlParams()
    Object.assign(params, obj)
    //绑定路由
    const hrefs = window.location.href.split('#')
    const mainHref = hrefs.shift()
    const routers = hrefs.join('#').split('?')[0]
    const baseUrl = mainHref + '#' + routers
    const urlParams = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')
    window.history.replaceState({}, '', `${baseUrl}${urlParams.length ? '?' : ''}${urlParams}`)
  } catch (e) {
    console.log(e)
  }
}

/**
 * 获取地址栏参数
 * @returns null
 */
export function delUrlParams(key) {
  try {
    const params = getUrlParams()
    if (!Array.isArray(key)) key = [key]
    key.forEach(item => {
      if (item in params) delete params[item]
      // else console.log('路由中无此parameter：', item);
    })
    //绑定路由
    const hrefs = window.location.href.split('#')
    const mainHref = hrefs.shift()
    const routers = hrefs.join('#').split('?')[0]
    const baseUrl = mainHref + '#' + routers
    const urlParams = Object.keys(params)
      .map(value => `${encodeURIComponent(value)}=${encodeURIComponent(params[value])}`)
      .join('&')
    window.history.replaceState({}, '', `${baseUrl}${urlParams.length ? '?' : ''}${urlParams}`)
  } catch (e) {
    console.log(e)
  }
}
