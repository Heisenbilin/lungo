import less from 'less'
import getDefaultPaletteLess from './default-vars'
import getDarkPaletteLess from './dark-vars'
function createThemeConfig(cwd) {
  return [
    {
      theme: 'dark',
      htmlThemeAttr: 'dark',
      modifyVars: {
        hack: `true;@import "${require.resolve(
          `${cwd}/node_modules/ant-design-vue/lib/style/color/colorPalette.less`,
        )}";`,
        ...getDefaultPaletteLess(cwd),
        ...getDarkPaletteLess(cwd),
        'text-color': 'fade(@white, 65%)',
        'gray-8': '@text-color',
        'background-color-base': '#555',
        'skeleton-color': 'rgba(0,0,0,0.8)',
        'root-entry-name': 'dark',
      },
    },
  ]
}
const createAdditionalData =
  (cwd: string) =>
  async (content: string, filename: string): Promise<string> => {
    const themeConfig = createThemeConfig(cwd)
    const themePromises = themeConfig.map(async t => {
      const { htmlThemeAttr, modifyVars = {} } = t
      const options = {
        javascriptEnabled: true,
        modifyVars,
        relativeUrls: true,
        filename,
      }
      try {
        const { css } = await less.render(content, options)
        let res = ''
        if (htmlThemeAttr && css) {
          res = `
        [data-theme=${htmlThemeAttr}] {
          ${css}
        }`
        }
        return Promise.resolve(res)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
        return Promise.reject(content)
      }
    })
    let res = content
    for (const themePromise of themePromises) {
      const theme = await themePromise
      res += theme
    }
    return res
  }

export { createAdditionalData }
