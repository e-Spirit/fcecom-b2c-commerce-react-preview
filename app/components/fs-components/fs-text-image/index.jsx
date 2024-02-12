/**
 * === CFC ===
 *  Component to display a text, an image or both.
 */

/** CFC Start **/
import React from 'react';
import { Grid, GridItem, Heading, Image } from '@chakra-ui/react';
import { get } from 'lodash';
import { RichText } from '../RichText';
import PropTypes from 'prop-types';

/*
 * This is an example slot containing the FsTextImage component.
 */
export const FsTextImage = ({ section }) => {
  // Image Left
  let order = [0, 1];
  let image = { marginRight: 'auto' };

  // Image Right
  if (get(section, 'data.st_variant.identifier') === 'image-right') {
    order = [1, 0];
    image = { marginLeft: 'auto' };
  }

  return (
    <Grid templateColumns="auto 1fr" gap={6} data-preview-id={get(section, 'previewId')}>
      <GridItem w="100%" display={'flex'} flexDir={'column'} justifyContent={'center'} order={order[0]}>
        <Image
          maxHeight={'sm'}
          {...image}
          maxWidth={'3xl'}
          borderRadius={'lg'}
          src={get(section, 'data.st_image.resolutions.4x3_M.url')}
          alt={get(section, 'data.st_image_alt_text')}
        />
      </GridItem>
      <GridItem w="100%" display={'flex'} flexDir={'column'} justifyContent={'center'} order={order[1]}>
        <div>
          <Heading color={'gray.200'} as={'h2'} fontSize={'4xl'}>
            {get(section, 'data.st_headline')}
          </Heading>
          <RichText fsText={get(section, 'data.st_text')}></RichText>
        </div>
      </GridItem>
    </Grid>
  );
};

FsTextImage.propTypes = {
  section: PropTypes.object,
};

export default FsTextImage;
/** CFC End **/
