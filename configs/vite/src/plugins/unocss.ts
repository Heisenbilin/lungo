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
        'text-base ml-2 pl-2 font-bold border-0 border-l-4 border-solid border-blue-700',
      'report-title': 'text-2xl font-medium px-2 py-3',
      'filter-tag': 'font-medium !mr-10 float-right !opacity-70',
      'chart-container': 'bg-$component-background-color rounded-lg p-3 col-span-2 xl:col-span-1',
      'chart-container-full': 'chart-container !col-span-2',
      'grid-center': 'grid place-content-center',
      'text-color': 'text-$content-text-color ',
      'bg-color': 'bg-$content-background-color',
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
