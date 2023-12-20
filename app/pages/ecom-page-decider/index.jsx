/*
 * Copyright (c) 2022, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * === CFC ===
 * Component that renders either a Landingpage or a Contentpage depending on the page template.
 * It uses the navigation service to set the id of the CaaS document as fsPageId.
 */

/** CFC Start **/
import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';

import { MAX_CACHE_AGE } from '@salesforce/retail-react-app/app/constants';
import { LandingPage } from './partials/LandingPage';
import { ContentPage } from './partials/ContentPage';
import PageNotFound from '@salesforce/retail-react-app/app/pages/page-not-found';
import { useRecoilValueLoadable } from 'recoil';
import { ecomNavigationFamily } from '../../contexts/state/atoms';

const EcomPageDecider = () => {
  const { params } = useRouteMatch();
  const { contents: navigation } = useRecoilValueLoadable(ecomNavigationFamily());

  const seoId = navigation?.seoRouteMap?.[`/${params['0']}.json`];

  if (!seoId) return <PageNotFound />;

  let navElement = navigation?.idMap[seoId];

  if (!navElement?.customData) navElement = Object.values(navigation?.idMap).find((navElement) => !!navElement.parentIds?.includes(seoId));

  const customData = navElement?.customData;
  const caasId = navElement?.caasDocumentId;
  const pageTemplate = customData?.pageTemplate;

  if (!caasId) return <PageNotFound />;

  switch (pageTemplate) {
    case 'landingpage':
      return <LandingPage fsPageId={caasId} />;
    case 'contentpage':
      return <ContentPage fsPageId={caasId} />;
    default:
      return <PageNotFound />;
  }
};

EcomPageDecider.getTemplateName = () => 'ecom-page-decider';

EcomPageDecider.shouldGetProps = ({ previousLocation, location }) => !previousLocation || previousLocation.pathname !== location.pathname;

EcomPageDecider.getProps = async ({ res }) => {
  if (res) res.set('Cache-Control', `max-age=${MAX_CACHE_AGE}`);

  return {};
};

EcomPageDecider.propTypes = {
  /**
   * The current state of `getProps` when running this value is `true`, otherwise it's
   * `false`. (Provided internally)
   */
  isLoading: PropTypes.bool,
};

export default EcomPageDecider;
/** CFC End **/
