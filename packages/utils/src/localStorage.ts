function get(key) {
  const ls = window.localStorage
  try {
    return JSON.parse(ls.getItem(key) || '')
  } catch (error) {
    return ''
  }
}

function set(key: string, value: any): boolean {
  const ls = window.localStorage
  try {
    ls.setItem(key, JSON.stringify(value))
    return true
  } catch (e) {
    return false
  }
}

function remove(key: string): void {
  const ls = window.localStorage
  return ls.removeItem(key)
}

/**
 * 生成 local-storage 键值
 */
const generateKey = (key: string): string => {
  const prefix = 'fedata'
  const trimKey = key.trim()
  if (trimKey === '') {
    throw new Error('key 不能为空字符串')
  }
  return `${prefix}-${trimKey}`
}

const keyToken = generateKey('token')
/**
 * 获取 token
 */
export const getToken = (): string => {
  return get(keyToken)
}

/**
 * 写入 token
 */
export const setToken = (token: string): void => {
  set(keyToken, token)
}

export const removeToken = (): void => {
  remove(keyToken)
}
