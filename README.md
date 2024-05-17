# FirstSpirit Connect for Commerce React Preview
#### Based on [Retail React App from Salesforce](https://github.com/SalesforceCommerceCloud/pwa-kit/)_

## Recommended Requirements

- FirstSpirit Connect for Commerce Frontend API Client set up.
  Instructions can be found [in the documentation](https://docs.e-spirit.com/ecom/fsconnect-com-api/fsconnect-com-frontend-api/latest/).
-   Node 18.x
-   npm 9.x

## Connect PWA to your Salesforce instance

The configuration against the custom B2C commerce instance is set in `./config/default.js` configuration files. You can provide additional config files, e.g. for local development. Read more about this in the [documentation](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/configuration-options.html).

### Mandatory configuration via environment variables
Although all important configuration can be done in these files, there are 2 additional values that have to be set as environment variables, like listed in the list below.

| Property             | Description                                                                        |
|----------------------|------------------------------------------------------------------------------------|
| EXTERNAL_DOMAIN_NAME | The external domain name used for the PWA. Example: `localhost.e-spirit.live:4200` |
| LISTEN_ADDRESS       | The address that the PWA is listening on. Example: `localhost.e-spirit.live:4200`. |

### Optional environment configuration values

All the configuration can be done with environment variables.
They are overridden by `config/local.js` though, so only if the `config/default.js` can be loaded, the environemnt variables are used here.

The configuration against the custom B2C Commerce instance is set in the `.env` file and will be used in `./config/default.js`.

Rename `.env.template` to `.env` and fill in the fields described below:

| Property             | Description                                                                                                                              |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| PORT                 | The port on which the PWA is started. Default is set to `3000`.                                                                          |
| CLIENT_ID            | The public SLAS client id.                                                                                                               |
| ORGANIZATION_ID      | The identifier for your organization for API access.                                                                                     |
| SHORT_CODE           | An eight-character code assigned to a realm for routing purposes.                                                                        |
| SITE_ID              | The identifier for a particular e-commerce site.                                                                                         |
| B2C_URL              | The url to your B2C Commerce instance.                                                                                                   |
| CONN_MODE            | Whether to use http or https for the PWA. Default is set to `https`.                                                                     |
| SSL_FILE_PATH        | The path to the combined SSL file.                                                                                                       |
| EXTERNAL_DOMAIN_NAME | The external domain name used for the PWA. Example: `localhost:3000`                                                                     |
| LISTEN_ADDRESS       | The address that the PWA is listening on. Example: `localhost:3000`.                                                                     |
| ECOM_API_URL         | The url to your Frontend API backend service.                                                                                            |
| ECOM_API_LOCALE      | The default locale to use. Default is set to `en_GB`.                                                                                    |
| LOG_LEVEL            | Numeric representation of log levels:<ul><li>DEBUG = 0</li><li>INFO = 1</li><li>WARNING = 2</li><li>ERROR = 3</li><li>NONE = 4</li></ul> |

## Set FirstSpirit Server Origin
With the update to v3 only a few hosts are allowed to host the storefront in an iframe.
Therefore the FirstSpirit server origin needs to be added to `ALLOWED_FIRSTSPIRIT_ORIGINS` in `./overrides/app/constants.js`.

## Set correct site identifier
Make sure to set the correct site identifier under `./config/sites.js`. It needs to match the `SITE_ID` that you have defined in your .env file.

## Add domains to ssr.js
It may be necessary to add your custom domains for the [helmet](https://helmetjs.github.io/) configuration under `./overrides/app/ssr.js`.

## Managed Runtime
In order to push and deploy a bundle to a target environment in Managed Runtime, you need to adjust the `push` and `push+deploy` npm scripts in the package.json.
Replace the `<PROJECT_ID>`, `<EXTERNAL_DOMAIN_NAME>`, `<LISTEN_ADDRESS>` and `<ENVIRONMENT_ID>` with the correct values. The values can be found in the [Runtime Admin Dashboard](https://runtime.commercecloud.com/login).

## SSL Configuration (Combine PEM file)

The PWA does need a combined certificate file to work with SSL enabled. This can be produced with a short command as follows:

```bash
# replace ssl-certificate with your filename.
cat ssl-certificate.key ssl-certificate.pem > ssl-certificate.combined.
````

## Get Started

To start your web server for local development, run the following command in your project directory:

```bash
npm start
```

Now that the development server is running, you can open a browser and preview your PWA:

-   Go to https://localhost:3000/

## Documentation

The full documentation for PWA Kit and Managed Runtime is hosted on the [Salesforce Developers](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/overview) portal.

### Useful Links:

-   [Get Started](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/getting-started.html)
-   [Skills for Success](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/skills-for-success.html)
-   [Set Up API Access](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/setting-up-api-access.html)
-   [Configuration Options](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/configuration-options.html)
-   [Proxy Requests](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/proxying-requests.html)
-   [Push and Deploy Bundles](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/pushing-and-deploying-bundles.html)
-   [The Retail React App](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/retail-react-app.html)
-   [Rendering](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/rendering.html)
-   [Routing](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/routing.html)
-   [Phased Headless Rollouts](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/phased-headless-rollouts.html)
-   [Launch Your Storefront](https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/launching-your-storefront.html)

### Components
All new components are created in `app/components/fs-components` and will be mapped with the `firstSpiritComponentSelector` to the specific FirstSpirit section templates defined in the reference project.

## Legal Notices

The Connect for Commerce Frontend API module is a product of [Crownpeak Technology GmbH](https://www.crownpeak.com/), Dortmund, Germany. The Connect for Commerce Frontend API module is subject to the Apache-2.0 license.

Details regarding any third-party software products in use but not created by Crownpeak Technology GmbH, as well as the third-party licenses and, if applicable, update information can be found [here](THIRD-PARTY.md).

## Disclaimer

This document is provided for information purposes only. Crownpeak may change the contents hereof without notice. This document is not warranted to be error-free, nor subject to any other warranties or conditions, whether expressed orally or implied in law, including implied warranties and conditions of merchantability or fitness for a particular purpose. Crownpeak specifically disclaims any liability with respect to this document and no contractual obligations are formed either directly or indirectly by this document. The technologies, functionality, services, and processes described herein are subject to change without notice.