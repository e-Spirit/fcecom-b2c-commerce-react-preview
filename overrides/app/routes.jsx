/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* istanbul ignore file */
// NOTE!
// This file is being ignored in the test coverage report for now. It reports `0%` functions
// tested, which brings down the overall coverage and blocks CI. There are tests still, but
// we don't want it to count toward coverage until we figure out how to cover the `functions`
// metric for this file in its test.

/**
 * === CFC ===
 * Applied changes:
 * - Added EcomPageDecider component for the contentpages.
 */

import React from 'react';
import loadable from '@loadable/component';
import { getConfig } from '@salesforce/pwa-kit-runtime/utils/ssr-config';

// Components
import { Skeleton } from '@salesforce/retail-react-app/app/components/shared/ui';
import { configureRoutes } from '@salesforce/retail-react-app/app/utils/routes-utils';

const fallback = <Skeleton height="75vh" width="100%" />;

// Create your pages here and add them to the routes array
// Use loadable to split code into smaller js chunks
const Home = loadable(() => import('./pages/home'), { fallback });
const EcomPageDecider = loadable(() => import('../../app/pages/ecom-page-decider'), { fallback });
const Login = loadable(() => import('@salesforce/retail-react-app/app/pages/login'), { fallback });
const Registration = loadable(() => import('@salesforce/retail-react-app/app/pages/registration'), { fallback });
const ResetPassword = loadable(() => import('@salesforce/retail-react-app/app/pages/reset-password'), { fallback });
const Account = loadable(() => import('@salesforce/retail-react-app/app/pages/account'), { fallback });
const Cart = loadable(() => import('@salesforce/retail-react-app/app/pages/cart'), { fallback });
const Checkout = loadable(() => import('@salesforce/retail-react-app/app/pages/checkout'), { fallback });
const CheckoutConfirmation = loadable(() => import('@salesforce/retail-react-app/app/pages/checkout/confirmation'), { fallback });
const LoginRedirect = loadable(() => import('@salesforce/retail-react-app/app/pages/login-redirect'), { fallback });
const ProductDetail = loadable(() => import('./pages/product-detail'), { fallback });
const ProductList = loadable(() => import('./pages/product-list'), { fallback });
const Wishlist = loadable(() => import('@salesforce/retail-react-app/app/pages/account/wishlist'), { fallback });

const routes = [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/login',
    component: Login,
    exact: true,
  },
  {
    path: '/registration',
    component: Registration,
    exact: true,
  },
  {
    path: '/reset-password',
    component: ResetPassword,
    exact: true,
  },
  {
    path: '/account',
    component: Account,
  },
  {
    path: '/checkout',
    component: Checkout,
    exact: true,
  },
  {
    path: '/checkout/confirmation/:orderNo',
    component: CheckoutConfirmation,
  },
  {
    path: '/callback',
    component: LoginRedirect,
    exact: true,
  },
  {
    path: '/cart',
    component: Cart,
    exact: true,
  },
  {
    path: '/product/:productId',
    component: ProductDetail,
  },
  {
    path: '/search',
    component: ProductList,
  },
  {
    path: '/category/:categoryId',
    component: ProductList,
  },
  {
    path: '/account/wishlist',
    component: Wishlist,
  },
  /** CFC Start **/
  {
    path: '/*',
    component: EcomPageDecider,
  },
  /** CFC End **/
];

export default () => {
  const config = getConfig();
  return configureRoutes(routes, config, {
    ignoredRoutes: ['/callback', '*'],
  });
};
