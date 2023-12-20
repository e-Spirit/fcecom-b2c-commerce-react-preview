/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * === CFC ===
 * Applied changes:
 * - Change layout of home page
 * - Add EcomPageHeader which is only shown when log level is set to DEBUG
 * - Add EcomPage payload: content page with homepage template
 * - Add page slots 'stage' and 'content'
 * - Add FirstSpiritComponentSelector to page slots to render component based on FirstSpirit section template
 * - Use locale from useRecoilValue hook for page creation and forms
 */

import React from 'react';
import { useIntl } from 'react-intl';

// Components
import { Box, Stack } from '@salesforce/retail-react-app/app/components/shared/ui';

// Project Components
import Seo from '@salesforce/retail-react-app/app/components/seo';
import Section from '@salesforce/retail-react-app/app/components/section';
import ProductScroller from '@salesforce/retail-react-app/app/components/product-scroller';

// Constants
import { HOME_SHOP_PRODUCTS_CATEGORY_ID, HOME_SHOP_PRODUCTS_LIMIT, MAX_CACHE_AGE } from '../../constants';

import { useServerContext } from '@salesforce/pwa-kit-react-sdk/ssr/universal/hooks';
import { useProductSearch } from '@salesforce/commerce-sdk-react';
import { FsModal } from '../../../../app/components/fs-components/fs-modal';
import { EcomPageHeader } from '../../../../app/partials/EcomPageHeader';
import { EcomPageSlot } from '../../../../app/contexts/ecomAPI/EcomPageSlot';
import FirstSpiritComponentSelector from '../../../../app/components/firstSpiritComponentSelector';
import { EcomPage } from '../../../../app/contexts/ecomAPI/EcomPage';
import { useRecoilValue } from 'recoil';
import { ecomLanguageAtomic } from '../../../../app/contexts/state/atoms';

/**
 * This is the home page for Retail React App.
 * The page is created for demonstration purposes.
 * The page renders SEO metadata and a few promotion
 * categories and products, data is from local file.
 */
const Home = () => {
  const intl = useIntl();

  // useServerContext is a special hook introduced in v3 PWA Kit SDK.
  // It replaces the legacy `getProps` and provide a react hook interface for SSR.
  // it returns the request and response objects on the server side,
  // and these objects are undefined on the client side.
  const { res } = useServerContext();
  if (res) {
    res.set('Cache-Control', `max-age=${MAX_CACHE_AGE}`);
  }

  const { data: productSearchResult, isLoading } = useProductSearch({
    parameters: {
      refine: [`cgid=${HOME_SHOP_PRODUCTS_CATEGORY_ID}`, 'htype=master'],
      limit: HOME_SHOP_PRODUCTS_LIMIT,
    },
  });

  /** CFC Start **/
  const { fs: locale } = useRecoilValue(ecomLanguageAtomic);
  /** CFC End **/

  return (
    /** CFC Start **/
    <EcomPage
      pageTarget={{
        id: 'homepage',
        type: 'content',
        locale,
        displayNames: {
          EN: 'Homepage EN',
          DE: 'Homepage DE',
        },
        fsPageTemplate: 'homepage',
      }}
    >
      {/** CFC End */}
      <Box data-testid="home-page" layerStyle="page">
        <Seo title="Home Page" description="Commerce Cloud Retail React App" keywords="Commerce Cloud, Retail React App, React Storefront" />
        {/** CFC Start */}
        <FsModal />
        <EcomPageHeader />
        <EcomPageSlot slotName="stage">
          <FirstSpiritComponentSelector />
        </EcomPageSlot>
        <EcomPageSlot slotName="content">
          <FirstSpiritComponentSelector />
        </EcomPageSlot>
        {/** CFC End */}
        {productSearchResult && (
          <Section
            padding={4}
            paddingTop={16}
            title={intl.formatMessage({
              defaultMessage: 'Shop Products',
              id: 'home.heading.shop_products',
            })}
          >
            <Stack pt={8} spacing={16}>
              <ProductScroller overflowX="hidden" products={productSearchResult?.hits} isLoading={isLoading} />
            </Stack>
          </Section>
        )}
      </Box>
      {/** CFC Start */}
    </EcomPage>
    /** CFC End **/
  );
};

Home.getTemplateName = () => 'home';

export default Home;
