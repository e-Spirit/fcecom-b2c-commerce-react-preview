/**
 * === CFC ===
 * - Add EcomPageHeader which is only shown when log level is set to DEBUG
 * - Add EcomPage payload: content page with contentpage template
 * - Add page slots 'stage' and 'content'
 * - Add FirstSpiritComponentSelector to page slots to render component based on FirstSpirit section template
 * - Use locale from useRecoilValue hook for page creation and forms
 */

/** CFC Start **/
import { EcomPageHeader } from '../../../partials/EcomPageHeader';
import React from 'react';
import { EcomPageSlot } from '../../../contexts/ecomAPI/EcomPageSlot';
import { EcomPage } from '../../../contexts/ecomAPI/EcomPage';
import { Container } from '@chakra-ui/react';
import FirstSpiritComponentSelector from '../../../components/firstSpiritComponentSelector';
import { useRecoilValue } from 'recoil';
import { ecomLanguageAtomic } from '../../../contexts/state/atoms';
import PropTypes from 'prop-types';

export const ContentPage = ({ fsPageId }) => {
  const { fs: locale } = useRecoilValue(ecomLanguageAtomic);

  return (
    <EcomPage
      pageTarget={{
        fsPageId,
        locale,
        type: 'content',
        fsPageTemplate: 'contentpage',
        isFsDriven: true,
      }}
    >
      <Container layerStyle="page">
        <EcomPageHeader />
        <EcomPageSlot slotName="stage">
          <FirstSpiritComponentSelector />
        </EcomPageSlot>
        <EcomPageSlot slotName="content">
          <FirstSpiritComponentSelector />
        </EcomPageSlot>
      </Container>
    </EcomPage>
  );
};

ContentPage.propTypes = {
  fsPageId: PropTypes.string,
};
/** CFC End **/
