/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sites = require('@salesforce/retail-react-app/config/sites');

module.exports = {
  app: {
    url: {
      site: 'path',
      locale: 'path',
      showDefaults: true,
    },
    defaultSite: 'RefArchGlobal',
    siteAliases: {
      RefArch: 'us',
      RefArchGlobal: 'global',
    },
    sites,
    commerceAPI: {
      proxyPath: `/mobify/proxy/api`,
      parameters: {
        clientId: 'c9c45bfd-0ed3-4aa2-9971-40f88962b836',
        organizationId: 'f_ecom_zzrf_001',
        shortCode: '8o7m175y',
        siteId: 'RefArchGlobal',
      },
    },
    einsteinAPI: {
      host: 'https://api.cquotient.com',
      einsteinId: '1ea06c6e-c936-4324-bcf0-fada93f83bb1',
      // This differs from the siteId in commerceAPIConfig for testing purposes
      siteId: 'aaij-MobileFirst',
      isProduction: false,
    },
  },
  externals: [],
  pageNotFoundURL: '/page-not-found',
  ssrEnabled: true,
  ssrOnly: ['ssr.js', 'ssr.js.map', 'node_modules/**/*.*'],
  ssrShared: ['static/ico/favicon.ico', 'static/robots.txt', '**/*.js', '**/*.js.map', '**/*.json'],
  ssrParameters: {
    ssrFunctionNodeVersion: '18.x',
    proxyConfigs: [
      {
        host: 'kv7kzm78.api.commercecloud.salesforce.com',
        path: 'api',
      },
      {
        host: 'zzrf-001.dx.commercecloud.salesforce.com',
        path: 'ocapi',
      },
    ],
  },
  /** CFC Start **/
  ecom: {
    // The port on which the PWA is started. Default is set to `3000`
    PORT: 3000,

    // Whether to use http or https for the PWA. Default is set to `http`
    CONN_MODE: 'http',

    // The path to the combined SSL file.
    SSL_FILE_PATH: '',

    // The default locale to use. Default is set to `en_GB`
    ECOM_API_LOCALE: 'en_GB',

    // The url to your Frontend API backend service.
    ECOM_API_URL: 'http://localhost:3001/api',

    /**
     * Numeric representation of log levels:
     * DEBUG = 0
     * INFO = 1
     * WARNING = 2
     * ERROR = 3
     * NONE = 4
     */
    LOG_LEVEL: 1,
  },
  /** CFC End **/
};
