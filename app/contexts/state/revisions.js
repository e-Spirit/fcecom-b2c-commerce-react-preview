/**
 * === CFC ===
 * Define revisions for ecom-page, ecom-nav and ecom-extra-menu atomics
 */

/** CFC Start **/
import { atom } from 'recoil';

export const bumpRevision = (current) => (current ?? 0) + 1;
export const ecomPageRevisionAtomic = atom({
  key: 'ecom-page-revision',
  default: 0,
});
export const ecomNavigationRevisionAtomic = atom({
  key: 'ecom-nav-revision',
  default: 0,
});

export const ecomExtraMenuRevisionAtomic = atom({
  key: 'ecom-extra-menu-revision',
  default: 0,
});
/** CFC End **/
