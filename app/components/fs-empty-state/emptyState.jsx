import { useRecoilValueLoadable } from 'recoil';
import { ecomApiAtomic } from '../../contexts/state/atoms';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Box } from '@salesforce/retail-react-app/app/components/shared/ui';
import { useEcomPage } from '../../contexts/ecomAPI/EcomPage';

export const EmptyState = ({ section, message = 'Section not translated' }) => {
  const {
    contents: { isPreview, logLevel },
  } = useRecoilValueLoadable(ecomApiAtomic);

  const { ecomPage } = useEcomPage();

  if (!isPreview) return null;

  const locale = ecomPage?.previewId?.split('.')?.[1];

  return (
    <Box
      {...(section ? { 'data-preview-id': get(section, 'previewId') } : {})}
      position="relative"
      minHeight="75px"
      bg="rgb(240, 240, 240)"
      border="2px dashed rgba(86, 86, 86, 0.15)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      color="rgba(86, 86, 86, 0.3)"
      px="10px"
    >
      <span>⚠️ {message} ⚠️</span>
      {logLevel === 0 && <span>current locale: {locale}</span>}
    </Box>
  );
};

EmptyState.propTypes = {
  section: PropTypes.object,
  message: PropTypes.string,
};
