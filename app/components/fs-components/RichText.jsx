/**
 * === CFC ===
 * Component to display rich text variants. It is used in all components that contain a DOM editor.
 */

/** CFC Start **/
import React from 'react';
import { Box, Button, Link, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { get, isEmpty } from 'lodash';
import { useEcomNavigation } from '../../contexts/ecomAPI/EcomNavigation';
import { Link as RouterLink } from 'react-router-dom';
import { ExternalLinkIcon, LinkIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';

export const StyledFsText = ({ data, content }) => {
  if (typeof content === 'string') return <span>{content}</span>;

  let format = { as: 'span' };

  switch (data['format']) {
    case 'bold':
      format = { ...format, fontWeight: 'bold' };
      break;
    case 'italic':
      format = { ...format, fontStyle: 'italic' };
      break;
    case 'subline':
      format = { ...format, fontWeight: 'bold', fontSize: 'xl' };
      break;
  }

  switch (data['data-fs-style']) {
    case 'format.h2':
      format = { ...format, as: 'h2', fontSize: '2xl' };
      break;
    case 'format.h3':
      format = { ...format, as: 'h3', fontSize: 'xl' };
      break;
    case 'format.subline':
      format = { ...format, fontSize: 'xl', fontWeight: 'bold' };
      break;
  }

  if (!isEmpty(format))
    return (
      <Text {...format}>
        <RichText fsText={content} />
      </Text>
    );

  return <RichText fsText={content} />;
};

export const EcomCtaLink = ({ data }) => {
  const { resolveReference } = useEcomNavigation();

  const link = get(data, 'data.lt_link');
  const theme = get(data, 'data.lt_theme');

  const external = link?.template === 'external_link';
  const targetLink = resolveReference(data);

  let style = { _hover: { boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)' } };

  switch (theme.key) {
    case 'light':
      style = { ...style, variant: 'outline', bg: 'white', borderColor: 'gray.200' };
      break;
    case 'dark':
      style = { ...style, bg: 'blue.800' };
      break;
  }

  if (link.template === 'internal_link')
    return (
      <Button as={RouterLink} to={targetLink} {...style}>
        <RichText fsText={get(data, 'data.lt_text')} />
      </Button>
    );

  if (external)
    return (
      <a href={targetLink} target={'_blank'} rel="noreferrer">
        <Button {...style}>
          <RichText fsText={get(data, 'data.lt_text')} />
        </Button>
      </a>
    );

  return (
    <Button as={RouterLink} to={targetLink} {...style}>
      <RichText fsText={get(link, `data.lt_${link.template?.split('_')[0]}.value[0].value.label`)} />
    </Button>
  );
};

export const EcomRichLink = ({ data, content }) => {
  const { resolveReference } = useEcomNavigation();

  let external, targetLink;

  switch (data.template) {
    case 'cta_link':
      return <EcomCtaLink data={data} />;
    default:
      external = data.template === 'dom_external_link';
      targetLink = resolveReference(data);

      return (
        <Link
          to={targetLink}
          href={targetLink}
          as={external ? 'a' : RouterLink}
          isExternal={external}
          paddingY={1}
          target={external ? '_blank' : '_self'}
          textDecoration={'underline'}
        >
          <RichText fsText={content} />
          <div style={{ display: 'inline-block', width: 4 }} />
          {external ? <ExternalLinkIcon /> : <LinkIcon />}
        </Link>
      );
  }
};

export const RichText = ({ fsText }) => {
  if (!fsText || isEmpty(fsText)) return null;
  if (typeof fsText === 'string') return fsText;

  return fsText?.map((element, i) => {
    const { type, content, data } = element;

    switch (type) {
      case 'block':
        return (
          <div key={i}>
            <StyledFsText {...element} />
          </div>
        );
      case 'linebreak':
        return <br key={i} />;
      case 'paragraph':
        return (
          <Box marginY={2} key={i}>
            <StyledFsText {...element} />
          </Box>
        );
      case 'text':
        return <StyledFsText {...element} key={i} />;
      case 'link':
        return <EcomRichLink data={data} content={content} key={i} />;
      case 'list':
        return (
          <UnorderedList marginTop={2} marginBottom={4} key={i}>
            <RichText fsText={content} />
          </UnorderedList>
        );
      case 'listitem':
        return (
          <ListItem marginX={1} key={i}>
            <RichText fsText={content} />
          </ListItem>
        );
      default:
        return null;
    }
  });
};

StyledFsText.propTypes = {
  data: PropTypes.object,
  content: PropTypes.object,
};

EcomCtaLink.propTypes = {
  data: PropTypes.object,
};

EcomRichLink.propTypes = {
  data: PropTypes.object,
  content: PropTypes.object,
};

RichText.propTypes = {
  fsText: PropTypes.object,
};
/** CFC End **/
