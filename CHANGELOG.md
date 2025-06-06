## [1.3.5](https://github.com/e-Spirit/fcecom-b2c-commerce-react-preview/compare/v1.3.4...v1.3.5) (2025-05-23)

### Changes

* Updated fcecom-frontend-api-client to v1.8.0.

## [1.3.4](https://github.com/e-Spirit/fcecom-b2c-commerce-react-preview/compare/v1.3.3...v1.3.4) (2025-05-19)

### Changes

* Updated fcecom-frontend-api-client to v1.7.0.

## [1.3.3](https://github.com/e-Spirit/fcecom-b2c-commerce-react-preview/compare/v1.3.2...v1.3.3) (2025-04-08)

### Changes

* Updated fcecom-frontend-api-client to v1.6.0.<br>
  Which includes the following changes:
  * Added the ability to get the available locales in a FirstSpirit project.
  * Fixed formatting issues.

## [1.3.2](https://github.com/e-Spirit/fcecom-b2c-commerce-react-preview/compare/v1.3.1...v1.3.2) (2025-03-20)

### Changes

* Updated fcecom-frontend-api-client to v1.5.0.

## [1.3.1](https://github.com/e-Spirit/fcecom-b2c-commerce-react-preview/compare/v1.3.0...v1.3.1) (2025-02-19)

### Changes

* Updated fcecom-frontend-api-client to v1.4.3.

## [1.3.0](https://github.com/e-Spirit/fcecom-b2c-commerce-react-preview/compare/v1.2.0...v1.3.0) (2025-02-12)

### Changes
* Enhanced the rendering of untranslated sections by adding a placeholder component.

## [1.2.0](https://github.com/e-Spirit/fcecom-b2c-commerce-react-preview/compare/v1.1.2...v1.2.0) (2025-02-05)

### Changes
* Added a new ShareView feature that enables secure sharing of preview content outside of the ContentCreator.

### UPDATE NOTICE

ShareView is a mode of the Frontend API ecosystem that allows users to preview content outside the ContentCreator without requiring it to be released in FirstSpirit.

This feature involves a token generation process that grants users access to a generated token, enabling them to view preview content from the Frontend API Backend or a similar implementation of the Frontend API Server package.

While the functionality works out of the box, some configuration steps are required to enable this view. Refer to the [Frontend API documentation](https://docs.e-spirit.com/ecom/fsconnect-com-api/fsconnect-com-frontend-api/latest/share-view/).

## [1.1.3](https://github.com/e-Spirit/fcecom-b2c-commerce-react-preview/compare/v1.1.2...v1.1.3) (2025-01-09)

### Changes

* Updated fcecom-frontend-api-client to v1.3.2.

## [1.1.2](https://github.com/e-Spirit/fcecom-b2c-commerce-react-preview/compare/v1.1.0...v1.1.2) (2024-12-20)

### Changes

* Updated fcecom-frontend-api-client to v1.3.1.

## [1.1.0](https://github.com/e-Spirit/fcecom-b2c-commerce-react-preview/compare/v1.0.4...v1.1.0) (2024-10-22)

### Changes

* Fixed a bug where `onRerenderView` events were not handled.
* Updated fcecom-frontend-api-client to v1.3.0.

## [1.0.4](https://github.com/e-Spirit/fcecom-b2c-commerce-react-preview/compare/v1.0.3...v1.0.4) (2024-10-16)

### Changes

* Updated fcecom-frontend-api-client to v1.2.1.

## [1.0.3](https://github.com/e-Spirit/fcecom-b2c-commerce-react-preview/compare/v1.0.2...v1.0.3) (2024-10-09)

### Changes

* Updated fcecom-frontend-api-client to v1.2.0.

## [1.0.2](https://github.com/e-Spirit/fcecom-b2c-commerce-react-preview/compare/v1.0.1...v1.0.2) (2024-07-10)

### Changes

* Changed the ID displayed in the debug header to be the pageRefID. This is necessary to do a request directly to the Frontend API Backend.
* Updated fcecom-frontend-api-client to v1.1.0.

## [1.0.1](https://github.com/e-Spirit/fcecom-b2c-commerce-react-preview/compare/v1.0.0...v1.0.1) (2024-06-05)

### Changes

* Updated fcecom-frontend-api-client to v1.0.1.

## [1.0.0](https://github.com/e-Spirit/fcecom-b2c-commerce-react-preview/compare/v0.3.0...v1.0.0) (2024-05-17)

### Changes

* Added missing configuration information to the README.md.
* Updated fcecom-frontend-api-client to v1.0.0.

## [0.3.0](https://github.com/e-Spirit/fcecom-b2c-commerce-react-preview/compare/v0.2.0...v0.3.0) (2024-03-22)

### Changes

* Updated fcecom-frontend-api-client to v0.25.0.

## [0.2.0](https://github.com/e-Spirit/fcecom-b2c-commerce-react-preview/compare/v0.1.3...v0.2.0) (2024-02-12)

### Changes
* Fixed security vulnerabilities located in lodash (CVE-2020-8203) and semver (CVE-2022-25883) by updating the relevant dependencies.
* Fixed an issue that prevents actions like "Add to Cart" when running the PWA inside the FirstSpirit ContentCreator
* The PWA is now compatible with the Salesforce Runtime Environment.
* Added CHANGELOG.md.
* Updated fcecom-frontend-api-client to v0.24.0.

### UPDATE NOTICE
* Please add the FirstSpirit server origin to `./overrides/app/constants.js` of your fcecom-b2c-commerce-react-preview implementation.

Information on previous releases can be found in the [Release Notes](https://docs.e-spirit.com/ecom/fsconnect-com/FirstSpirit_Connect_for_Commerce_Releasenotes_EN.html).
