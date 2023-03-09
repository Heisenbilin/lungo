const fs = require('fs')
const path = require('path')
const lessToJs = require('less-vars-to-js')

const getDefaultPaletteLess = (cwd: string) => {
  const stylePath = path.join(`${cwd}/node_modules/ant-design-vue/lib/`, 'style')
  const colorLess = fs.readFileSync(path.join(stylePath, 'color', 'colors.less'), 'utf8')
  const defaultLess = fs.readFileSync(path.join(stylePath, 'themes', 'default.less'), 'utf8')
  const defaultPaletteLess = lessToJs(`${colorLess}${defaultLess}`, {
    stripPrefix: true,
    resolveVariables: false,
  })
  return defaultPaletteLess
}

export default getDefaultPaletteLess
