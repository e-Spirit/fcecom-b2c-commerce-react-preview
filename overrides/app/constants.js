/*
 * Copyright (c) 2023, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/*
    Hello there! This is a demonstration of how to override a file from the base template.

    It's necessary that the module export interface remain consistent,
    as other files in the base template rely on constants.js, thus we
    import the underlying constants.js, modifies it and re-export it.
*/

/**
 * === CFC ===
 * Reset value to the original value of 25.
 */

import { DEFAULT_LIMIT_VALUES, DEFAULT_SEARCH_PARAMS } from '@salesforce/retail-react-app/app/constants';

/** CFC Start **/
DEFAULT_LIMIT_VALUES[0] = 25;
DEFAULT_SEARCH_PARAMS.limit = 25;
/** CFC End **/

export { DEFAULT_LIMIT_VALUES, DEFAULT_SEARCH_PARAMS };

/** CFC Start **/
export const ALLOWED_FIRSTSPIRIT_ORIGINS = [
  // Replace with FirstSpirit server origin
  'example.org.hosting'
];
/** CFC End **/

export * from '@salesforce/retail-react-app/app/constants';
