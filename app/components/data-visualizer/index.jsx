/* eslint-disable react/no-unescaped-entities */

/**
 * === CFC ===
 * Component to display CaaS data as JSON.
 */

/** CFC Start **/
import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

import { ObjectView } from 'react-object-view';
import PropTypes from 'prop-types';

/*
 * This is an example slot containing the DataVisualizer component
 */
const DataVisualizer = ({ section }) => (
  <>
    <div data-preview-id={section?.id}>
      <Heading color={'gray.200'} as="h2">
        DataVisualizer
      </Heading>
      <Text>The following payload will be passed to section '{section?.id}'</Text>
      <Box className="container" position="relative" transform="rotate(0deg)" minWidth="100%" padding="0">
        <Box className="data-container" marginTop="10px">
          <ObjectView
            data={section}
            options={{
              hideDataTypes: false,
              hideObjectSize: false,
              hidePreviews: false,
              expandLevel: 1,
              previewElementsMaxCount: 7,
              previewOpacity: 0.5,
              previewPropertiesMaxCount: 4,
              previewStringMaxLength: 20,
            }}
            styles={{
              lineHeight: 1.7,
              tabWidth: 2,
              fontSize: 14,
              fontFamily: 'Courier, monospace',
            }}
          />
        </Box>
      </Box>
    </div>
  </>
);

DataVisualizer.propTypes = {
  section: PropTypes.object,
};

export default DataVisualizer;
/** CFC End **/
