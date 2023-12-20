/**
 * === CFC ===
 * Component to display various link types.
 */

/** CFC Start **/
import React from 'react';
import { useEcomNavigation } from '../../../contexts/ecomAPI/EcomNavigation';
import { LinkOverlay } from '@chakra-ui/react';
import { Link as RouteLink } from 'react-router-dom';
import PropTypes from 'prop-types';

export const EcomLinkOverlay = ({ fsLink, children, fallbackToChildren = true }) => {
  const { resolveReference } = useEcomNavigation();
  const link = resolveReference(fsLink);

  if (!link && fallbackToChildren) return children;

  switch (fsLink?.template) {
    case 'external_link':
      return (
        <LinkOverlay as={'a'} href={link} target={'_blank'}>
          {children}
        </LinkOverlay>
      );
    default:
      return (
        <LinkOverlay as={RouteLink} to={link}>
          {children}
        </LinkOverlay>
      );
  }
};

export const EcomShopLink = ({ id, type, children }) => {
  let link;
  if (type && id) link = `/${type}/${id}`;

  return (
    <LinkOverlay as={RouteLink} to={link}>
      {children}
    </LinkOverlay>
  );
};

EcomLinkOverlay.propTypes = {
  fsLink: PropTypes.object,
  children: PropTypes.object,
  fallbackToChildren: PropTypes.bool,
};

EcomShopLink.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  children: PropTypes.object,
};
/** CFC End **/
