/**
 * The instant on-demand atomic CSS engine.
 * @see https://github.com/unocss/unocss
 */

import Unocss from 'unocss/vite'
import { presetIcons, presetMini } from 'unocss'
export function configUnocssPlugin() {
  return Unocss({
    exclude: ['node_modules', '.git', 'dist'],
    presets: [presetIcons(), presetMini({ dark: 'class' })],
    shortcuts: {
      'flex-center': 'flex justify-center items-center',
      'chart-title':
        'w-full text-base text-left ml-2 pl-2 font-bold border-l-4 border-blue-700 inline',
      'filter-tag': 'font-medium !mr-10 float-right !opacity-70',
      'chart-container': 'bg-white rounded-lg p-3 col-span-2 xl:col-span-1',
      'chart-container-full': 'chart-container !col-span-2',
      'grid-center': 'grid place-content-center',
    },
    theme: {
      colors: {
        primary: 'var(--primary-color)',
      },
      backgroundColor: {},
      transitionProperty: [],
    },
  })
}
