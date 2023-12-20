/**
 * === CFC ===
 * - Add EcomPageHeader which is only shown when log level is set to DEBUG
 * - Add EcomPage payload: content page with landingpage template
 * - Add page slots 'stage', 'left_content', 'right_content', 'content' and 'sub_content'
 * - Add FirstSpiritComponentSelector to page slots to render component based on FirstSpirit section template
 * - Use locale from useRecoilValue hook for page creation and forms
 */

/** CFC Start **/
import { EcomPageHeader } from '../../../partials/EcomPageHeader';
import React from 'react';
import { EcomPageSlot } from '../../../contexts/ecomAPI/EcomPageSlot';
import { EcomPage } from '../../../contexts/ecomAPI/EcomPage';
import { Container, Box, Flex } from '@chakra-ui/react';
import FirstSpiritComponentSelector from '../../../components/firstSpiritComponentSelector';
import { useRecoilValue } from 'recoil';
import { ecomLanguageAtomic } from '../../../contexts/state/atoms';
import PropTypes from 'prop-types';

export const LandingPage = ({ fsPageId }) => {
  const { fs: locale } = useRecoilValue(ecomLanguageAtomic);

  return (
    <EcomPage
      pageTarget={{
        fsPageId,
        locale,
        type: 'content',
        fsPageTemplate: 'landingpage',
        isFsDriven: true,
      }}
    >
      <Container layerStyle="page">
        <Flex flexDir={'column'}>
          <EcomPageHeader />
          <EcomPageSlot slotName="stage">
            <FirstSpiritComponentSelector />
          </EcomPageSlot>
          <Flex flexDir={'row'} justifyContent={'space-evenly'} columnGap={10}>
            <Box flexGrow={1}>
              <EcomPageSlot slotName="left_content">
                <FirstSpiritComponentSelector />
              </EcomPageSlot>
            </Box>
            <Box flexGrow={1}>
              <EcomPageSlot slotName="right_content">
                <FirstSpiritComponentSelector />
              </EcomPageSlot>
            </Box>
          </Flex>
          <EcomPageSlot slotName="content">
            <FirstSpiritComponentSelector />
          </EcomPageSlot>
          <EcomPageSlot slotName="sub_content">
            <FirstSpiritComponentSelector />
          </EcomPageSlot>
        </Flex>
      </Container>
    </EcomPage>
  );
};

LandingPage.propTypes = {
  fsPageId: PropTypes.string,
};

/** CFC End **/
