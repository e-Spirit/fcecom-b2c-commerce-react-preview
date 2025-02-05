/**
 * === CFC ===
 * Component that displays a header that shows whether or not a content page is available in FirstSpirit.
 * This header is only shown when the log level is set to DEBUG.
 */

/** CFC Start **/
import { Box, Text, useClipboard } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useEcomPage } from '../contexts/ecomAPI/EcomPage';
import { CheckIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { useRecoilValueLoadable } from 'recoil';
import { ecomApiAtomic } from '../contexts/state/atoms';
import PropTypes from 'prop-types';

export const EcomPageHeader = () => {
  const { ecomPage, pageTarget } = useEcomPage();
  const targetId = ecomPage?.refId;

  const { value: idValue, hasCopied: hasCopiedId, onCopy: onCopyId } = useClipboard(targetId);

  const {
    contents: { isPreview, devMode, ecomApi },
  } = useRecoilValueLoadable(ecomApiAtomic);
  if (!isPreview) return null;

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

  const temporarily = (func) => {
    func?.(true);
    setTimeout(() => func?.(false), 2000);
  };

  const PageShare = ({ label, params }) => {
    const [hasCopied, setCopied] = useState(false);
    const [hasError, setError] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const getShareViewLink = () => {
      setError(false);
      setLoading(true);

      try {
        ecomApi
          .getShareViewLink(params)
          .then((result) => {
            if (!result) {
              console.error('Nothing was returned while creating a ShareView link', `${result}`);
              return temporarily(setError);
            }

            navigator.clipboard.writeText(result);
            temporarily(setCopied);
          })
          .catch((error) => {
            console.error('An error occurred when getting ShareView link:', error);
            temporarily(setError);
          })
          .finally(() => setLoading(false));
      } catch (error) {
        console.error('An error occurred when processing ShareView link:', error);
        temporarily(setError);
      }
    };

    return (
      <Text as="span" color={'lightgray'} ml={3} cursor={hasCopied && !hasError ? 'auto' : 'pointer'} onClick={getShareViewLink}>
        {isLoading ? 'Loading...' : hasError ? <Text color="red">Failed, retry?</Text> : hasCopied ? <Text color="green">Link copied</Text> : label}
      </Text>
    );
  };

  PageShare.propTypes = {
    label: PropTypes.string.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string,
      lifetimeMs: PropTypes.number.isRequired,
      universalAllow: PropTypes.bool,
      fsDriven: PropTypes.bool,
    }),
  };

  const LIFETIME_24_HR = 24 * 60 * 60 * 1000; // real-life
  const LIFETIME_5_SEC = 5 * 1000; // development duration

  return (
    <Box>
      {ecomPage?.name ? (
        <Text as={'span'} color="green" display={'flex'} flexDirection={'row'} alignItems={'center'}>
          <CheckIcon marginRight={2}></CheckIcon>
          Page „{ecomPage.name}” is available in FirstSpirit
          <PageShare
            label={'Share this Page'}
            params={{
              id: pageTarget?.isFsDriven ? pageTarget.fsPageId : pageTarget?.id,
              type: pageTarget?.type,
              lifetimeMs: LIFETIME_24_HR,
              fsDriven: pageTarget?.isFsDriven,
            }}
          />
          <PageShare
            label={'Share all Pages'}
            params={{
              universalAllow: true,
              lifetimeMs: LIFETIME_24_HR,
            }}
          />
          {devMode && targetId && (
            <Text as="span" color={'lightgray'} ml={3} cursor={hasCopiedId ? 'auto' : 'pointer'} onClick={onCopyId}>
              CaaS Document ID: {hasCopiedId ? 'Copied' : idValue}
            </Text>
          )}
        </Text>
      ) : (
        devMode && (
          <Text as="span" color="red" display={'flex'} flexDirection={'row'} alignItems={'center'}>
            <WarningTwoIcon marginRight={2}></WarningTwoIcon>
            Page is not available in FirstSpirit
          </Text>
        )
      )}
    </Box>
  );
};
/** CFC End **/
