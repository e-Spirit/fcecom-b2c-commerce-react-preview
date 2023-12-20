/**
 * === CFC ===
 * Context provider for the navigation.
 */

/** CFC Start **/
import React, { useCallback, useContext, useEffect } from 'react';
import { EcomHooks } from 'fcecom-frontend-api-client';
import useNavigation from '@salesforce/retail-react-app/app/hooks/use-navigation';
import useMultiSite from '@salesforce/retail-react-app/app/hooks/use-multi-site';
import { useRecoilState, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { ecomApiAtomic, ecomLanguageAtomic, ecomMessageOverlayAtomic, ecomNavigationFamily } from '../state/atoms';
import { MultiSiteContext } from '@salesforce/retail-react-app/app/contexts';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import get from 'lodash.get';
import { EcomAction } from '../EcomAction';
import { getPathWithLocale } from '@salesforce/retail-react-app/app/utils/url';
import { fibonacci } from '../../utils/sleep';
import { bumpRevision, ecomNavigationRevisionAtomic } from '../state/revisions';
import PropTypes from 'prop-types';
import { toFSLocale, toSfLocale } from '../../utils/locale';

export const EcomNavigation = React.createContext();

export const EcomNavigationProvider = ({ children }) => {
  const navigate = useNavigation();

  // Ecom API
  const {
    contents: { ecomApi, isPreview },
  } = useRecoilValueLoadable(ecomApiAtomic);
  const { contents: navigation, state } = useRecoilValueLoadable(ecomNavigationFamily());
  const updateNavigation = useSetRecoilState(ecomNavigationRevisionAtomic);

  // Localization
  const [{ sf: sfState }, setLocale] = useRecoilState(ecomLanguageAtomic);
  const { locale } = useIntl();
  const { setLocale: setSfLocale } = useContext(MultiSiteContext);

  // Location
  const { buildUrl } = useMultiSite();
  const history = useHistory();

  // Overlay
  const setOverlay = useSetRecoilState(ecomMessageOverlayAtomic);
  const openOverlay = ({ messageId, defaultMessage }) => setOverlay(() => ({ messageId, defaultMessage, isOpen: true }));

  useEffect(() => {
    setLocale(() => ({
      fs: toFSLocale(locale) ?? process.env.ECOM_API_LOCALE,
      sf: locale ?? toSfLocale(process.env.ECOM_API_LOCALE),
    }));
    updateNavigation(bumpRevision);
  }, [locale]);

  //Extracts a navigable link from FS link data
  const resolveReference = useCallback(
    (linkData) => {
      if (!linkData) return null;

      const { type, referenceType, referenceId } = linkData;
      if (type === 'Reference' && referenceType === 'PageRef') return getSeoUrl(referenceId);

      const template = get(linkData, 'template', null);

      switch (template) {
        case 'external_link':
        case 'dom_external_link':
          return get(linkData, 'data.lt_linkUrl', null);
        case 'internal_link':
        case 'dom_internal_link':
          return getSeoUrl(get(linkData, 'data.lt_pageref.referenceId', null));
        case 'content_link':
        case 'dom_content_link':
          return getSeoUrl(get(linkData, 'data.lt_pageref.referenceId', null));
        case 'category_link':
        case 'dom_category_link':
          return `/category/${get(linkData, `data.lt_category.value[0].identifier`)}`;
        case 'product_link':
        case 'dom_product_link':
          return `/product/${get(linkData, `data.lt_product.value[0].identifier`)}`;
        case 'cta_link':
          return resolveReference(get(linkData, `data.lt_link`));
        default:
          return null;
      }
    },
    [navigation]
  );

  // Get seo url from the navigations idMap
  const getSeoUrl = (pageRefUid) => {
    if (pageRefUid) {
      const navigationElement = navigation?.idMap?.[pageRefUid];
      return getSeoUrlFromNavigationElement(navigationElement);
    }
    return null;
  };

  // Get a localized seo url for pageRefUid
  const getLocalizedSeoUrl = async (pageRefUid, locale) => {
    if (pageRefUid && locale) {
      const navigation = await getLocalizedNavigation(locale);
      const navigationElement = navigation?.idMap?.[pageRefUid];
      return getSeoUrlFromNavigationElement(navigationElement);
    }
    return null;
  };

  // Get seo url from the given navigationElement
  const getSeoUrlFromNavigationElement = (navigationElement) => {
    if (navigationElement) {
      if (navigationElement?.customData?.pageTemplate === 'homepage') return '/';

      const seoUrl = navigationElement?.seoRoute;
      return seoUrl ? seoUrl.replace('.json', '') : null;
    }
    return null;
  };

  const getLocalizedNavigation = async (locale) => {
    const navigation = await ecomApi?.fetchNavigation({ initialPath: '/', locale });
    if (navigation) return navigation;
    return null;
  };

  const pollNavigationElement = useCallback(
    async (id, fs) => {
      if (!ecomApi) return;

      return await new Promise((resolve, reject) => {
        const MAX_TRIES = 5;
        const wait = (tries) => fibonacci(tries) * 250;

        const getNavigationElement = async (tries = 1) => {
          const navigation = await ecomApi?.fetchNavigation({ initialPath: '/', locale: fs });
          new Promise(() => {
            const navigationElement = navigation.idMap[id];
            if (navigationElement) {
              updateNavigation(bumpRevision);
              return resolve(navigationElement);
            }

            if (tries >= MAX_TRIES) return reject(`Navigation Element ${id} does not exist after ${tries} tries`);
            else setTimeout(() => getNavigationElement(tries + 1).then(), wait(tries));
          });
        };

        getNavigationElement();
      });
    },
    [navigation]
  );

  useEffect(() => {
    if (isPreview) {
      if (ecomApi && state === 'hasValue' && navigation) {
        const requestPreviewElement = async ({ previewId }) => {
          const [id, fs] = previewId.split('.');
          const sf = toSfLocale(fs);

          // Navigate to site with new locale
          if (sfState !== sf) {
            openOverlay(EcomAction.CHANGE_LANGAUGE);
            setLocale(() => ({ fs, sf }));
            setSfLocale(sf);
          }

          const navigationElement = await pollNavigationElement(id, fs);

          const customData = navigationElement?.customData;
          const pageTemplate = customData?.pageTemplate;
          const ecomShopId = customData?.ecomShopId;

          // Navigate to site with new locale
          if (sfState !== sf) openOverlay(EcomAction.CHANGE_LANGAUGE);

          const navigateByPath = (path) => {
            const targetUrl = getPathWithLocale(sf, buildUrl, {
              disallowParams: ['refine'],
              location: {
                pathname: path,
                search: '',
              },
            });
            sfState !== sf ? (window.location = targetUrl) : history.push(targetUrl);
          };

          switch (pageTemplate) {
            case 'homepage':
              navigateByPath(`/`);
              break;
            case 'landingpage':
            case 'contentpage':
              navigateByPath(getSeoUrlFromNavigationElement(navigationElement));
              break;
            case 'product':
              navigateByPath(`/product/${ecomShopId}`);
              break;
            case 'category':
              navigateByPath(`/category/${ecomShopId}`);
              break;
            default:
              navigateByPath(undefined);
              break;
          }
        };

        const openStorefrontUrl = (params) => {
          const { id, type } = params;

          switch (type) {
            case 'category':
              navigate(`/category/${id}`);
              break;
            case 'product':
              navigate(`/product/${id}`);
              break;
          }
        };

        ecomApi.addHook(EcomHooks.OPEN_STOREFRONT_URL, openStorefrontUrl);
        ecomApi.addHook(EcomHooks.REQUEST_PREVIEW_ELEMENT, requestPreviewElement);
        ecomApi.addHook(EcomHooks.PAGE_CREATED, requestPreviewElement);

        return () => {
          ecomApi.removeHook(EcomHooks.OPEN_STOREFRONT_URL, openStorefrontUrl);
          ecomApi.removeHook(EcomHooks.REQUEST_PREVIEW_ELEMENT, requestPreviewElement);
          ecomApi.removeHook(EcomHooks.PAGE_CREATED, requestPreviewElement);
        };
      }
    }
  }, [ecomApi, state, isPreview]);

  return <EcomNavigation.Provider value={{ navigation, resolveReference, getLocalizedSeoUrl }}>{children}</EcomNavigation.Provider>;
};

EcomNavigationProvider.propTypes = {
  children: PropTypes.array,
};

export const useEcomNavigation = () => useContext(EcomNavigation);
/** CFC End **/
