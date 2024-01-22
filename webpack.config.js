/**
 * === CFC ===
 * Extend default webpack config to be able to use env variables at runtime and for the Kubernetes deployment.
 */

/** CFC Start **/
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpackConfig = require('@salesforce/pwa-kit-dev/configs/webpack/config');

// Add your customizations here
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Dotenv = require('dotenv-webpack');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const updatedConfig = webpackConfig.map((config) => {
  config.plugins.push(
    new Dotenv({
      path: path.resolve(__dirname, '.env'),
      // Set to true for Kubernetes deployment
      systemvars: true,
    })
  );
  return config;
});

module.exports = updatedConfig;
/** CFC End **/
