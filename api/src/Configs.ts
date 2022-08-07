import {
  Environment, PORT_APP, PORT_UNIT_TEST, SERVICE_NAME, VERSION_CODE, VERSION_NUMBER,
} from './Constants';

export interface Config {
  env: string,
  port: number,
  versionNumber: number,
  versionCode: string,
  serviceName: string,
}

interface Configs {
  [env: string]: Config
}

const configs: Configs = {
  UNIT_TEST_DOCKER: {
    env: Environment.UNIT_TEST_DOCKER,
    port: PORT_UNIT_TEST,
    versionCode: VERSION_CODE,
    versionNumber: VERSION_NUMBER,
    serviceName: SERVICE_NAME,
  },
  UNIT_TEST: {
    env: Environment.UNIT_TEST,
    port: PORT_UNIT_TEST,
    versionCode: VERSION_CODE,
    versionNumber: VERSION_NUMBER,
    serviceName: SERVICE_NAME,
  },
  LOCAL: {
    env: Environment.LOCAL,
    port: PORT_APP,
    versionCode: VERSION_CODE,
    versionNumber: VERSION_NUMBER,
    serviceName: SERVICE_NAME,
  },
  LOCAL_SERVER: {
    env: Environment.LOCAL_SERVER,
    port: PORT_APP,
    versionCode: VERSION_CODE,
    versionNumber: VERSION_NUMBER,
    serviceName: SERVICE_NAME,
  },
  TEST_SERVER: {
    env: Environment.TEST_SERVER,
    port: PORT_APP,
    versionCode: VERSION_CODE,
    versionNumber: VERSION_NUMBER,
    serviceName: SERVICE_NAME,
  },
  UAT_SERVER: {
    env: Environment.UAT_SERVER,
    port: PORT_APP,
    versionCode: VERSION_CODE,
    versionNumber: VERSION_NUMBER,
    serviceName: SERVICE_NAME,
  },
  PROD_SERVER: {
    env: Environment.PROD_SERVER,
    port: PORT_APP,
    versionCode: VERSION_CODE,
    versionNumber: VERSION_NUMBER,
    serviceName: SERVICE_NAME,
  },
};

export const getConfig = (environment: Environment = Environment.UNDEFINED): Config => {
  if (environment !== Environment.UNDEFINED) {
    return configs[environment];
  }
  const env = process.env.ENVIRONMENT as Environment || Environment.UNIT_TEST;
  return configs[env];
};
