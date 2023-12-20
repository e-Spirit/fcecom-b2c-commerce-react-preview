/**
 * === CFC ===
 * Component to display images as a banner.
 */

/** CFC Start **/
import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { EcomLinkOverlay } from '../fs-link';
import PropTypes from 'prop-types';

const LEFT = 'left';
const CENTER = 'center';
const RIGHT = 'right';
const BG_DARK = 'black';
const BG_LIGHT = 'white';
const TEXT_DARK = 'black';
const TEXT_LIGHT = 'white';

let textPosition, textColor, bgColor;

const setVariant = (variant) => {
  switch (variant) {
    case 'left-light':
      textPosition = LEFT;
      textColor = TEXT_DARK;
      bgColor = BG_LIGHT;
      break;
    case 'center-dark':
      textPosition = CENTER;
      textColor = TEXT_LIGHT;
      bgColor = BG_DARK;
      break;
    case 'center-light':
      textPosition = CENTER;
      textColor = TEXT_DARK;
      bgColor = BG_LIGHT;
      break;
    case 'right-dark':
      textPosition = RIGHT;
      textColor = TEXT_LIGHT;
      bgColor = BG_DARK;
      break;
    case 'right-light':
      textPosition = RIGHT;
      textColor = TEXT_DARK;
      bgColor = BG_LIGHT;
      break;
    default:
      textPosition = LEFT;
      textColor = TEXT_LIGHT;
      bgColor = BG_DARK;
      break;
  }
};

const FsBanner = ({ section }) => {
  if (!section?.data) return null;

  const data = section.data;
  const imgUrl = data.st_image?.resolutions?.['16x9_L']?.url;

  setVariant(data.st_variant?.key);

  return (
    (imgUrl && (
      <Box
        data-preview-id={section.previewId}
        display={'block'}
        position={'relative'}
        paddingY={32}
        borderRadius="lg"
        overflow={'hidden'}
        backgroundImage={`url(${imgUrl})`}
        title={data.st_image_alt_text ?? ''}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize={'cover'}
      >
        <EcomLinkOverlay fsLink={data.st_link}>
          {(data.st_title || data.st_subtitle) && (
            <Box backgroundColor={bgColor} color={textColor} textAlign={textPosition} opacity={0.6} py={5} px={20} mx={'auto'}>
              {data.st_title && (
                <Heading as={'h1'} marginBottom={4} opacity={1}>
                  {data.st_title}
                </Heading>
              )}
              {data.st_subtitle && <Text opacity={1}>{data.st_subtitle}</Text>}
            </Box>
          )}
        </EcomLinkOverlay>
      </Box>
    )) || <Box data-preview-id={section.previewId}></Box>
  );
};

FsBanner.propTypes = {
  section: PropTypes.object,
};
export default FsBanner;
/** CFC End **/
