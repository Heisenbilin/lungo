const fs = require('fs')
const path = require('path')
const lessToJs = require('less-vars-to-js')

const getDarkPaletteLess = (cwd: string) => {
  const stylePath = path.join(`${cwd}/node_modules/ant-design-vue/lib/`, 'style')
  const darkLess = fs.readFileSync(path.join(stylePath, 'themes', 'dark.less'), 'utf8')
  const darkPaletteLess = lessToJs(darkLess, {
    stripPrefix: true,
    resolveVariables: false,
  })
  return darkPaletteLess
}

export default getDarkPaletteLess
