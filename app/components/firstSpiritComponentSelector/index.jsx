/**
 * === CFC ===
 * Component to select which component should be rendered for a specific FirstSpirit section template.
 */

/** CFC Start **/
import React from 'react';
import { Box } from '@chakra-ui/react';

import DataVisualizer from '../data-visualizer';
import FsTextImage from '../fs-components/fs-text-image';
import { useEcomPageSlot } from '../../contexts/ecomAPI/EcomPageSlot';
import FsBanner from '../fs-components/fs-banner';
import FsCarousel from '../fs-components/fs-carousel';
import FsInteractiveImage from '../fs-components/fs-interactive-image';
import FsFeaturedProducts from '../fs-components/fs-featured-products';
import FsInteractiveVideo from '../fs-components/fs-interactive-video';
import PropTypes from 'prop-types';

const EcomSectionWrap = ({ children }) => (
  <Box className="outer-container" minWidth="100%" padding="20px 0">
    {children}
  </Box>
);

const ChooseComponent = ({ section }) => {
  switch (section?.sectionType) {
    case 'text_image':
      return <FsTextImage section={section} />;
    case 'banner':
      return <FsBanner section={section} />;
    case 'carousel':
      return <FsCarousel section={section} />;
    case 'interactive_image':
      return <FsInteractiveImage section={section} />;
    case 'featured_products':
      return <FsFeaturedProducts section={section} />;
    case 'interactive_youtube_video':
      return <FsInteractiveVideo section={section} />;
    default:
      // Use DataVisualizer for every section without a mapped type
      return <DataVisualizer section={section} />;
  }
};

/*
 * This is the component selector component.
 */
const FirstSpiritComponentSelector = () => {
  const { sections, slotName } = useEcomPageSlot();

  return (
    <Box data-fcecom-slot-name={slotName} style={{ minHeight: 20 }}>
      <Box>
        {sections?.map((section) => (
          <EcomSectionWrap key={section?.id}>
            <ChooseComponent section={section} />
          </EcomSectionWrap>
        ))}
      </Box>
    </Box>
  );
};

EcomSectionWrap.propTypes = {
  children: PropTypes.object,
};

ChooseComponent.propTypes = {
  section: PropTypes.object,
};

export default FirstSpiritComponentSelector;
/** CFC End **/
