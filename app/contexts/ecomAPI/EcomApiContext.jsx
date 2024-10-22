/**
 * === CFC ===
 * Context provider for the Frontend API.
 */

/** CFC Start **/
import React, { useContext, useEffect } from 'react';
import { EcomApi, EcomHooks } from 'fcecom-frontend-api-client';
import { EcomNavigationProvider } from './EcomNavigation';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { ecomApiAtomic, ecomMessageOverlayAtomic } from '../state/atoms';
import { bumpRevision, ecomExtraMenuRevisionAtomic, ecomNavigationRevisionAtomic, ecomPageRevisionAtomic } from '../state/revisions';
import { EcomAction } from '../EcomAction';
import { useHistory } from 'react-router-dom';
import { EcomActionOverlay } from '../../components/ecom-overlay';
import { getConfig } from '@salesforce/pwa-kit-runtime/utils/ssr-config';
import PropTypes from 'prop-types';

export const EcomApiContext = React.createContext();

export const EcomApiProvider = ({ children }) => {
  const setEcomApi = useSetRecoilState(ecomApiAtomic);

  const updateNavigation = useSetRecoilState(ecomNavigationRevisionAtomic);
  const updatePage = useSetRecoilState(ecomPageRevisionAtomic);
  const updateExtraMenu = useSetRecoilState(ecomExtraMenuRevisionAtomic);

  // Overlay
  const setOverlay = useSetRecoilState(ecomMessageOverlayAtomic);
  const resetOverlay = useResetRecoilState(ecomMessageOverlayAtomic);
  const openOverlay = ({ messageId, defaultMessage }) => setOverlay(() => ({ messageId, defaultMessage, isOpen: true }));

  const { ECOM_API_URL, LOG_LEVEL, ECOM_API_LOCALE } = getConfig().ecom ?? {};

  useEffect(() => {
    const ecomApi = new EcomApi(ECOM_API_URL, LOG_LEVEL);

    ecomApi.setDefaultLocale(ECOM_API_LOCALE);
    ecomApi.init().then((isPreview) => {
      // DEBUG = 0, INFO = 1, WARNING = 2, ERROR = 3, NONE = 4
      const logLevel = LOG_LEVEL ?? 1;
      const devMode = logLevel === 0;

      setEcomApi({ ecomApi, isPreview, logLevel, devMode });

      if (isPreview) {
        // Refresh Navigation
        ecomApi.addHook(EcomHooks.CONTENT_CHANGED, () => updateNavigation(bumpRevision));

        // Refresh Page
        ecomApi.addHook(EcomHooks.CONTENT_CHANGED, () => updatePage(bumpRevision));
        ecomApi.addHook(EcomHooks.SECTION_CREATED, () => updatePage(bumpRevision));
        ecomApi.addHook(EcomHooks.SECTION_CREATION_CANCELLED, () => updatePage(bumpRevision));
        ecomApi.addHook(EcomHooks.ENSURED_PAGE_EXISTS, () => updatePage(bumpRevision));
        ecomApi.addHook(EcomHooks.RERENDER_VIEW, () => updatePage(bumpRevision));

        // Refresh Extra Menu
        ecomApi.addHook(EcomHooks.CONTENT_CHANGED, () => updateExtraMenu(bumpRevision));

        let timeout;
        const closeOverlay = () => resetOverlay() || clearTimeout(timeout);

        // Create Section Overlay
        const showPageCreatingOverlay = () =>
          (timeout = setTimeout(() => {
            openOverlay(EcomAction.PAGE_CREATING);
          }, 150));
        ecomApi.addHook(EcomHooks.PAGE_CREATING, showPageCreatingOverlay);
        ecomApi.addHook(EcomHooks.SECTION_CREATED, closeOverlay);
        ecomApi.addHook(EcomHooks.SECTION_CREATION_CANCELLED, closeOverlay);
        ecomApi.addHook(EcomHooks.ENSURED_PAGE_EXISTS, closeOverlay);
        ecomApi.addHook(EcomHooks.PAGE_CREATION_FAILED, closeOverlay);
      }
    });
  }, []);

  const history = useHistory();

  useEffect(() => {
    let timeout;
    const removeHistoryListener = history.listen(() => {
      timeout = setTimeout(resetOverlay, 1000);
    });

    return () => {
      removeHistoryListener();
      clearTimeout(timeout);
      resetOverlay();
    };
  }, []);

  return (
    <EcomNavigationProvider value={{ updatePage }}>
      <EcomActionOverlay />
      {children}
    </EcomNavigationProvider>
  );
};

EcomApiProvider.propTypes = {
  children: PropTypes.object,
};

export const useEcomApi = () => useContext(EcomApiContext);
/** CFC End **/
