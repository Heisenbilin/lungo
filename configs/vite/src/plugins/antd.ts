import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import type { PluginOption } from 'vite'

export function configAntdPlugin() {
  const antdPlugin = Components({
    dts:true,
      resolvers:[
        AntDesignVueResolver()  
      ]
    })
  return antdPlugin as PluginOption
}
