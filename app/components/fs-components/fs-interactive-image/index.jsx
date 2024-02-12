/**
 * === CFC ===
 * Component to display an image map with product links as an interactive image.
 * It displays a product flyout while hovering over the item.
 */

/** CFC Start **/
import React from 'react';
import { Box, Button, Grid, GridItem, Heading, Image, keyframes, Popover, PopoverTrigger, Portal } from '@chakra-ui/react';
import FsProductFlyout from '../fs-product-flyout';
import { get, isEmpty } from 'lodash';
import { RichText } from '../RichText';
import PropTypes from 'prop-types';

const createOverlayPositionData = (area, imgWidth, imgHeight) => {
  const positionAndDimension = {
    left: `0%`,
    top: `0%`,
  };
  if (area.rightBottom && area.leftTop && imgWidth && imgHeight) {
    const leftTopX = get(area, ['leftTop', 'x'], 0);
    const leftTopY = get(area, ['leftTop', 'y'], 0);
    positionAndDimension.left = `${toPercentageValue(leftTopX, imgWidth)}%`;
    positionAndDimension.top = `${toPercentageValue(leftTopY, imgHeight)}%`;
  }
  return positionAndDimension;
};

const toPercentageValue = (percent, baseValue, decimals = 2) => {
  const usedBaseValue = toIntValue(baseValue, 0);
  const usedPercentageValue = toIntValue(percent, 0);
  return usedBaseValue === 0 ? '0' : ((usedPercentageValue / usedBaseValue) * 100).toFixed(decimals);
};

const toIntValue = (value, fallback = 0) => {
  let result = typeof value === 'number' ? value : null;
  if (typeof value === 'string') {
    result = parseInt(value, 10);
  }
  return result == null || Number.isNaN(result) ? fallback : result;
};

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg)
  }
`;

const FsInteractiveImage = ({ section }) => {
  const initRef = React.useRef();

  if (!section?.data) return null;

  const data = section.data;
  const headLine = get(data, 'st_headline', null);
  const text = get(data, 'st_text', null);
  const imgUrl = get(data, ['st_interactive_image', 'media', 'resolutions', 'ORIGINAL', 'url'], null);
  const imgAltText = get(data, 'st_image_alt_text', null);
  const pictureWidth = get(data, ['st_interactive_image', 'media', 'resolutions', 'ORIGINAL', 'width'], null);
  const pictureHeight = get(data, ['st_interactive_image', 'media', 'resolutions', 'ORIGINAL', 'height'], null);
  const areas = get(data, ['st_interactive_image', 'areas'], []);

  const hasText = headLine || !isEmpty(text);
  const imageStyle = hasText ? { maxWidth: '6xl', maxHeight: 'lg' } : {};

  return (
    <Grid templateColumns={hasText ? '1fr auto' : '1fr'} gap={6} data-preview-id={get(section, 'previewId')}>
      {hasText && (
        <GridItem w="100%" display={'flex'} flexDir={'column'} justifyContent={'center'}>
          {headLine && (
            <Heading color={'gray.200'} as={'h2'} fontSize={'4xl'}>
              {headLine}
            </Heading>
          )}
          {text && <RichText fsText={text}></RichText>}
        </GridItem>
      )}
      <GridItem w={hasText ? '100%' : 'fit-content'} display={'flex'} width={'fit-content'} flexDir={'column'} justifyContent={'center'}>
        <Box display={'block'} position={'relative'} borderRadius="lg" overflow={'hidden'}>
          {imgUrl && <Image src={imgUrl} alt={imgAltText ?? ''} {...imageStyle}></Image>}
          {areas.length > 0 &&
            areas.map((area, i) => (
              <Popover closeOnBlur={true} placement="left" initialFocusRef={initRef} key={i}>
                {() => (
                  <>
                    <PopoverTrigger>
                      <Button
                        height={15}
                        width={15}
                        minWidth={15}
                        paddingInline={0}
                        position={'absolute'}
                        backgroundColor={'rgba(186, 0, 101, .8)'}
                        boxShadow={'rgba(186, 0, 101, .3) 0 0 0 6px, rgba(186, 0, 101, .3) 0 0 0 15px !important'}
                        animation={`${spin} 2s ease-in infinite`}
                        borderRadius={50}
                        top={createOverlayPositionData(area, pictureWidth, pictureHeight)?.top}
                        left={createOverlayPositionData(area, pictureWidth, pictureHeight)?.left}
                      ></Button>
                    </PopoverTrigger>
                    <Portal>
                      <FsProductFlyout area={area}></FsProductFlyout>
                    </Portal>
                  </>
                )}
              </Popover>
            ))}
        </Box>
      </GridItem>
    </Grid>
  );
};

FsInteractiveImage.propTypes = {
  section: PropTypes.object,
};

export default FsInteractiveImage;
/** CFC End **/
