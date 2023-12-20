/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * === CFC ===
 * Applied changes:
 * - Use env variables for the port and protocol.
 * - Add sslFilePath option for the combined pem file in order to use HTTPS.
 * - Adjusted helmet config to include our deployed services and server instances.
 */
'use strict';

import path from 'path';
import { getRuntime } from '@salesforce/pwa-kit-runtime/ssr/server/express';
import { defaultPwaKitSecurityHeaders } from '@salesforce/pwa-kit-runtime/utils/middleware';
import { getConfig } from '@salesforce/pwa-kit-runtime/utils/ssr-config';
import helmet from 'helmet';

const options = {
  // The build directory (an absolute path)
  buildDir: path.resolve(process.cwd(), 'build'),

  // The cache time for SSR'd pages (defaults to 600 seconds)
  defaultCacheTimeSeconds: 600,

  // The contents of the config file for the current environment
  mobify: getConfig(),

  // The port that the local dev server listens on
  /** CFC Start **/
  port: process.env.PORT || 3000,
  /** CFC End **/

  // The protocol on which the development Express app listens.
  // Note that http://localhost is treated as a secure context for development,
  // except by Safari.
  /** CFC Start **/
  // TODO: check if there is a better space inside the configuration files,
  //  cause this is not really ecom-related.
  protocol: process.env.CONN_MODE || 'https',
  /** CFC End **/

  /** CFC Start **/
  // The path to the combined pem file.
  sslFilePath: path.resolve(process.cwd(), process.env.SSL_FILE_PATH ?? ''),
  /** CFC End **/
};

const runtime = getRuntime();

const { handler } = runtime.createHandler(options, (app) => {
  // Set default HTTP security headers required by PWA Kit
  app.use(defaultPwaKitSecurityHeaders);
  // Set custom HTTP security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'img-src': [
            // Default source for product images - replace with your CDN
            '*.commercecloud.salesforce.com',
          ],
          'script-src': [
            // Used by the service worker in /worker/main.js
            'storage.googleapis.com',
          ],
          'connect-src': [
            // Connect to Einstein APIs
            'api.cquotient.com',
          ],
        },
      },
    })
  );

  // Handle the redirect from SLAS as to avoid error
  app.get('/callback?*', (req, res) => {
    // This endpoint does nothing and is not expected to change
    // Thus we cache it for a year to maximize performance
    res.set('Cache-Control', `max-age=31536000`);
    res.send();
  });
  app.get('/robots.txt', runtime.serveStaticFile('static/robots.txt'));
  app.get('/favicon.ico', runtime.serveStaticFile('static/ico/favicon.ico'));

  app.get('/worker.js(.map)?', runtime.serveServiceWorker);
  app.get('*', runtime.render);
});
// SSR requires that we export a single handler function called 'get', that
// supports AWS use of the server that we created above.
export const get = handler;
