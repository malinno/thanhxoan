declare module 'react-native-config' {
  export interface NativeConfig {
    ENV: string;
    ERP_API_BASE_URL: string
    CODEPUSH_ANDROID_DEPLOYMENT_KEY: string
    CODEPUSH_IOS_DEPLOYMENT_KEY: string
    GOOGLE_MAPS_API_KEY: string
    WEB_BASE_URL: string
    ODOO_ELEARNING_URL: string
    ODOO_SHOWCASE_ACTION_ID: string
    ODOO_ELEARNING_ACTION_ID: string
  }

  export const Config: NativeConfig;
  export default Config;
}
