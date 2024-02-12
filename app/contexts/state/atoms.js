/**
 * === CFC ===
 * Define atomics that are used with Recoil:
 * - ecom-api for the config
 * - ecom-language for the FirstSpirit and Salesforce locale
 * - ecom-message for the overlay when executing specific actions in the ContentCreator
 * - ecom-page for getting the pageTarget and fsPageId information
 * - ecom-navigation for fetching the navigation from the navigation service
 * - ecom-extra-menu for getting the seo urls and labels for FirstSpirit-Driven content pages
 */

/** CFC Start **/
import { atom, selectorFamily } from 'recoil';
import { ecomExtraMenuRevisionAtomic, ecomNavigationRevisionAtomic, ecomPageRevisionAtomic } from './revisions';
import { fibonacci } from '../../utils/sleep';
import { set } from 'lodash';

export const ecomApiAtomic = atom({
  key: 'ecom-api',
  default: {
    ecomApi: undefined,
    isPreview: false,
    logLevel: 1, // DEBUG = 0, INFO = 1, WARNING = 2, ERROR = 3, NONE = 4
    devMode: false,
  },
  dangerouslyAllowMutability: true,
  effects: [
    ({ onSet }) => {
      onSet(async (_, oldValue) => oldValue?.ecomApi?.clear());
    },
  ],
});

export const ecomLanguageAtomic = atom({
  key: 'ecom-locale',
  default: {
    fs: undefined,
    sf: undefined,
  },
});

export const ecomMessageOverlayAtomic = atom({
  key: 'ecom-message',
  default: {
    isOpen: false,
    messageId: undefined,
    defaultMessage: '',
  },
});

export const ecomPageFamily = selectorFamily({
  key: 'ecom-page',
  default: {},
  get:
    (pageTarget) =>
    async ({ get }) => {
      get(ecomPageRevisionAtomic);

      const { ecomApi } = get(ecomApiAtomic);

      if (!pageTarget) return;
      if (!ecomApi) return;

      if (pageTarget.isFsDriven && !pageTarget.fsPageId) return;
      if (!pageTarget.isFsDriven && !pageTarget.id) return;

      if (pageTarget.isFsDriven) {
        const navigation = await get(ecomNavigationFamily());
        const { fs } = get(ecomLanguageAtomic);

        const caasDocumentId = await new Promise((resolve, reject) => {
          const existing = navigation?.idMap[pageTarget.fsPageId]?.caasDocumentId;
          if (existing) return resolve(existing);

          const MAX_TRIES = 5;
          const wait = (tries) => fibonacci(tries) * 250;

          const getNavigationElement = async (tries = 1) => {
            const navigation = await ecomApi?.fetchNavigation({ initialPath: '/', locale: fs });
            new Promise(() => {
              const navigationElement = navigation.idMap[pageTarget.fsPageId];
              if (navigationElement) return resolve(navigationElement.caasDocumentId);

              if (tries >= MAX_TRIES) reject(`Navigation Element ${pageTarget.fsPageId} does not exist after ${tries} tries`);
              else setTimeout(() => getNavigationElement(tries + 1).then(), wait(tries));
            });
          };

          getNavigationElement();
        });

        return await ecomApi?.findElement({ ...pageTarget, fsPageId: caasDocumentId });
      } else return await ecomApi?.findPage(pageTarget);
    },
});

export const ecomNavigationFamily = selectorFamily({
  key: 'ecom-navigation',
  default: {},
  dangerouslyAllowMutability: true,
  get:
    () =>
    async ({ get }) => {
      get(ecomNavigationRevisionAtomic);
      const { fs } = get(ecomLanguageAtomic);

      const { ecomApi } = get(ecomApiAtomic);
      if (ecomApi) return await ecomApi?.fetchNavigation({ initialPath: '/', locale: fs });
    },
});

export const ecomExtraMenuFamily = selectorFamily({
  key: 'ecom-extra-menu',
  default: {},
  get:
    () =>
    async ({ get }) => {
      get(ecomExtraMenuRevisionAtomic);

      const navigation = await get(ecomNavigationFamily());
      if (!navigation?.seoRouteMap) return {};

      const relevantSeoRoutes = {};

      Object.entries(navigation.seoRouteMap).forEach(([route, id]) => {
        if (route.startsWith('/[products]')) return;
        if (route.startsWith('/[categories]')) return;
        if (route.toLowerCase().startsWith('/homepage')) return;

        const paths = route.replace('.json', '').split('/');
        paths.shift();

        set(relevantSeoRoutes, paths, {
          navigationElement: navigation.idMap[id],
          route: route.replace('.json', ''),
          label: navigation.idMap[id].label,
        });
      });

      return relevantSeoRoutes;
    },
});
/** CFC End **/
