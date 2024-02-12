/**
 * === CFC ===
 * Component to display multiple banners in a carousal.
 */

/** CFC Start **/
import React, { useEffect, useState } from 'react';
import { Box, Flex, IconButton, Slide } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { get } from 'lodash';
import FsBanner from '../fs-banner';
import PropTypes from 'prop-types';

const FsCarousel = ({ section }) => {
  const data = section.data;
  const autoplay = !!data.st_autoplay?.key;
  const autoplayInterval = get(data, ['st_autoplay', 'key'], 3000);
  const items = get(data, 'st_items', []);

  useEffect(() => {
    let intervalId;

    if (autoplay) {
      intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
      }, autoplayInterval);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [autoplay, autoplayInterval, items.length]);

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!section?.data) return null;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    (items.length > 0 && (
      <Box data-preview-id={section.previewId} display={'block'} position={'relative'} borderRadius="lg" overflow={'hidden'}>
        <Flex>
          <Slide direction={'left'} in={true} style={{ position: 'static' }}>
            <FsBanner position={'absolute'} section={items[currentIndex]}></FsBanner>
          </Slide>
          {items.length > 1 && (
            <Box>
              <IconButton
                aria-label="Previous"
                icon={<ChevronLeftIcon width={10} height={10}/>}
                onClick={handlePrev}
                position="absolute"
                left="2"
                top="50%"
                transform="translateY(-50%)"
                backgroundColor={'none'}
                background={'none'}
              />

              <IconButton
                aria-label={'Next'}
                icon={<ChevronRightIcon width={10} height={10}/>}
                onClick={handleNext}
                position="absolute"
                right="2"
                top="50%"
                transform="translateY(-50%)"
                backgroundColor={'none'}
                background={'none'}
              />
            </Box>
          )}
        </Flex>
      </Box>
    )) || <Box data-preview-id={section.previewId}></Box>
  );
};

FsCarousel.propTypes = {
  section: PropTypes.object,
};

export default FsCarousel;
/** CFC End **/
