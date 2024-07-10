/**
 * === CFC ===
 * Component that displays a header that shows whether or not a content page is available in FirstSpirit.
 * This header is only shown when the log level is set to DEBUG.
 */

/** CFC Start **/
import { Box, Text, useClipboard } from '@chakra-ui/react';
import React from 'react';
import { useEcomPage } from '../contexts/ecomAPI/EcomPage';
import { CheckIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { useRecoilValueLoadable } from 'recoil';
import { ecomApiAtomic } from '../contexts/state/atoms';

export const EcomPageHeader = () => {
  const { ecomPage } = useEcomPage();
  const targetId = ecomPage?.refId;

  const { value, hasCopied, onCopy } = useClipboard(targetId);

  const {
    contents: { isPreview, devMode },
  } = useRecoilValueLoadable(ecomApiAtomic);
  if (!(isPreview && devMode)) return null;

  if (ecomPage instanceof Error)
    return (
      <Box>
        <Text color="red" display={'flex'}>
          <WarningTwoIcon marginRight={2}></WarningTwoIcon>
          Error
          <Text as="span" color={'lightgray'} ml={3}>
            {ecomPage.message}
          </Text>
        </Text>
      </Box>
    );

  return (
    <Box>
      {ecomPage?.name ? (
        <Text color="green" display={'flex'} flexDirection={'row'} alignItems={'center'}>
          <CheckIcon marginRight={2}></CheckIcon>
          Page „{ecomPage.name}” is available in FirstSpirit
          {targetId && (
            <Text as="span" color={'lightgray'} ml={3} cursor={hasCopied ? 'auto' : 'pointer'} onClick={onCopy}>
              CaaS Document ID: {hasCopied ? 'Copied' : value}
            </Text>
          )}
        </Text>
      ) : (
        <Text color="red" display={'flex'} flexDirection={'row'} alignItems={'center'}>
          <WarningTwoIcon marginRight={2}></WarningTwoIcon>
          Page is not available in FirstSpirit
        </Text>
      )}
    </Box>
  );
};
/** CFC End **/
