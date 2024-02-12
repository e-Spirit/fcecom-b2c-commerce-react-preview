/**
 * === CFC ===
 * Component to display a modal that overlays the primary content.
 */

/** CFC Start **/
import React, { useEffect } from 'react';
import { Button, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import { get } from 'lodash';
import { useEcomPage } from '../../../contexts/ecomAPI/EcomPage';
import { useEcomNavigation } from '../../../contexts/ecomAPI/EcomNavigation';

export const FsModal = () => {
  const { ecomPage } = useEcomPage();
  const { resolveReference } = useEcomNavigation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const modalData = get(ecomPage, ['data', 'pt_modals', '0', 'data'], null);

  useEffect(() => {
    const hasModalBeenDisplayed = sessionStorage.getItem('modalDisplayed');

    if (!hasModalBeenDisplayed && modalData) {
      const timer = setTimeout(() => {
        onOpen();
        sessionStorage.setItem('modalDisplayed', 'true');
      }, 15000); // Delay of 30 seconds

      return () => clearTimeout(timer);
    }
  }, [modalData]);

  if (!modalData) return null;

  const imgUrl = get(modalData, ['st_picture', 'resolutions', '16x9_M', 'url'], null);
  const linkData = get(modalData, ['st_link', 'data'], null);
  const linkTarget = resolveReference(linkData?.lt_link);
  return (
    <Modal isCentered isOpen={isOpen} size={'xl'} onClose={onClose} motionPreset="slideInBottom">
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent borderRadius={'lg'}>
        {modalData.st_headline && <ModalHeader textAlign="center">{modalData.st_headline}</ModalHeader>}
        <ModalCloseButton top={'16px'} right={'20px'} />
        <ModalBody>
          {modalData.st_subline && (
            <Text fontSize={'xl'} fontWeight={'bolder'} mb={4}>
              {modalData.st_subline}
            </Text>
          )}
          {imgUrl && <Image src={imgUrl} borderRadius={'lg'} />}
          {modalData.st_text && <Text mt={4}>{modalData.st_text}</Text>}
        </ModalBody>
        {linkTarget && (
          <ModalFooter justifyContent="center">
            <Button as="a" href={linkTarget} variant={'outline'} borderRadius={'lg'}>
              {linkData.lt_text}
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};
/** CFC End **/
