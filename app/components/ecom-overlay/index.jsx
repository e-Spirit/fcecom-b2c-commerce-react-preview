/**
 * === CFC ===
 * Component to display an overlay that blurs out the primary content for certain actions executed in the ContentCreator: changing the language, creating a page etc.
 */

/** CFC Start **/
import { Modal, ModalBody, ModalContent, ModalOverlay, Spinner, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { ecomMessageOverlayAtomic } from '../../contexts/state/atoms';

export const DynamicFormattedMessage = (props) => <FormattedMessage {...props} />;

export const EcomActionOverlay = () => {
  const [{ isOpen, messageId, defaultMessage }] = useRecoilState(ecomMessageOverlayAtomic);

  const resetOverlay = useResetRecoilState(ecomMessageOverlayAtomic);

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={resetOverlay}>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalBody paddingX={6} paddingY={4}>
            <Stack direction="row" spacing={6} width={['100%', 'auto']} justify="center" align="center">
              <Text fontSize={'xl'} fontWeight={'semibold'}>
                <DynamicFormattedMessage defaultMessage={defaultMessage} id={messageId} />
              </Text>
              <Spinner speed="0.65s" emptyColor="gray.200" color="blue.600" size="md" />
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
/** CFC End **/
