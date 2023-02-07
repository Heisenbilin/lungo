export type LocaleType = 'zh_CN' | 'en'

export interface LocaleConfig {
  // Current language
  locale: LocaleType
  // default language
  fallback: LocaleType
  // available Locales
  availableLocales: LocaleType[]
}

export interface StaticConfig {
  /**
   * Permission Type:
   * frontend: indicates that permissions are controlled by the front end
   * backend: indicates that the permissions are controlled by the backend
   */
  authType: 'frontend' | 'backend'

  // Display a progress bar at the top when switching pages
  enableProgress: boolean
}

export interface DynamicConfig {
  __: string
}

export interface GlobConfig {
  // Site title
  title: string
  // Service interface url
  apiUrl: string
  // Project abbreviation
  shortName: string
  // SSO APPID
  ssoAppid: string
  // DP ENV
  dpEnv: string
}

export interface GlobEnvConfig {
  // Site title
  VITE_GLOB_APP_TITLE: string
  // Service interface url
  VITE_GLOB_API_URL: string
  // Project abbreviation
  VITE_GLOB_APP_SHORT_NAME: string
  // SSO APPID
  VITE_GLOB_SSO_APPID: string
  // DP ENV
  VITE_GLOB_DP_ENV: string
}
