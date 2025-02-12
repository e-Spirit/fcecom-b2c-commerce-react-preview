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
import { EmptyState } from '../../fs-empty-state/emptyState';

/*
 * This is an example slot containing the FsTextImage component.
 */
export const FsTextImage = ({ section }) => {
  if (!section?.data) return <EmptyState section={section} message="Missing data" />;

  // Image Left
  let order = [0, 1];
  let image = { marginRight: 'auto' };

  // Image Right
  if (get(section, 'data.st_variant.identifier') === 'image-right') {
    order = [1, 0];
    image = { marginLeft: 'auto' };
  }

  const imageSrc = get(section, 'data.st_image.resolutions.4x3_M.url');
  const altText = get(section, 'data.st_image_alt_text');
  const headline = get(section, 'data.st_headline');
  const fsText = get(section, 'data.st_text');

  if (!imageSrc && !headline && !fsText?.length) return <EmptyState section={section} message="Missing image / extract" />;

  return (
    <Grid templateColumns="auto 1fr" gap={6} data-preview-id={get(section, 'previewId')} minHeight="30px">
      <GridItem w="100%" display={'flex'} flexDir={'column'} justifyContent={'center'} order={order[0]}>
        <Image maxHeight={'sm'} {...image} maxWidth={'3xl'} borderRadius={'lg'} src={imageSrc} alt={altText} />
      </GridItem>
      <GridItem w="100%" display={'flex'} flexDir={'column'} justifyContent={'center'} order={order[1]}>
        <div>
          <Heading color={'gray.200'} as={'h2'} fontSize={'4xl'}>
            {headline}
          </Heading>
          <RichText fsText={fsText}></RichText>
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
