// import { useGlobSetting } from '/@/hooks/setting';
// @ts-ignore
import { useGlobSetting } from '/@/hooks/setting';

const { dpEnv } = useGlobSetting();

const hostname = location.hostname;

const config = {
  littleSquirrel: {
    href: dpEnv === 'dev' ? 'fedata.xesv5.com' : hostname,
  },
  bigfish: {
    // host: dpEnv === 'dev' ? 'http://app.xesv5.com/bigfish' : 'http://app.xesv5.com/bigfish',
    host: 'http://app.xesv5.com/bigfish',
    version: '/v1',
  },
};
export default config;
