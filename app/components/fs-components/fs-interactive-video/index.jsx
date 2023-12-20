/**
 * === CFC ===
 * Component to display YouTube videos in a video player.
 * Products and text/image items can be set for any timestamp.
 */

/** CFC Start **/
import React, { useEffect, useState } from 'react';
import { Box, Button, Collapse, Flex, Grid, GridItem, Heading, Image, Text, useDisclosure } from '@chakra-ui/react';
import ReactPlayer from 'react-player/lazy';
import get from 'lodash.get';
import maxBy from 'lodash.maxby';
import isEmpty from 'lodash.isempty';
import sortBy from 'lodash.sortby';
import { RichText } from '../RichText';
import { Link as RouterLink } from 'react-router-dom';
import { useEcomNavigation } from '../../../contexts/ecomAPI/EcomNavigation';
import PropTypes from 'prop-types';

const FsProductCatalogEntry = ({ catalog }) => {
  if (!catalog.data.st_product) return null;

  const { id, label, extract, image } = get(catalog, 'data.st_product.value[0].value') ?? {};
  if (!(id || label || extract || image)) return null;

  return (
    <Grid templateColumns="1fr auto" gap={6} mb={5}>
      <GridItem w="100%" display={'flex'} flexDir={'column'} justifyContent={'center'}>
        <Flex flexDir={'column'} alignItems={'flex-start'}>
          <Heading color={'gray.200'}>{label ?? 'Related Product'}</Heading>
          {extract && <Text as={'p'}>{extract}</Text>}
          {id && (
            <Button as={RouterLink} to={`/product/${id}`} variant={'outline'} mt={5}>
              Go to product
            </Button>
          )}
        </Flex>
      </GridItem>
      {image && (
        <GridItem w="100%" display={'flex'} flexDir={'column'} justifyContent={'center'}>
          <Image maxHeight={'3xs'} marginRight={'auto'} maxWidth={'lg'} borderRadius={'lg'} src={image} alt={label} />
        </GridItem>
      )}
    </Grid>
  );
};

const FsInteractiveVideoItem = ({ catalog }) => {
  const heading = get(catalog, 'data.st_headline', null);
  const text = get(catalog, 'data.st_text', []);

  const { resolveReference } = useEcomNavigation();
  const linkTarget = resolveReference(get(catalog, 'data.st_link'));

  return (
    <Grid templateColumns="1fr auto" gap={6} mb={5}>
      <GridItem w="100%" display={'flex'} flexDir={'column'} justifyContent={'center'}>
        <Flex flexDir={'column'} alignItems={'flex-start'}>
          {heading && <Heading color={'gray.200'}>{heading}</Heading>}
          <RichText fsText={text} />
          {linkTarget && (
            <Button as={RouterLink} to={linkTarget} variant={'outline'} borderRadius={'lg'} mt={5}>
              Learn more
            </Button>
          )}
        </Flex>
      </GridItem>
      {!isEmpty(get(catalog, 'data.st_image', [])) && (
        <GridItem w="100%" display={'flex'} flexDir={'column'} justifyContent={'center'}>
          <Image
            maxHeight={'3xs'}
            marginRight={'auto'}
            maxWidth={'lg'}
            borderRadius={'lg'}
            src={get(catalog, 'data.st_image.resolutions.4x3_M.url')}
            alt={get(catalog, 'data.st_image.description')}
          />
        </GridItem>
      )}
    </Grid>
  );
};

const FsAdditionalContentEntry = ({ catalog }) => {
  const image = get(catalog, 'data.st_picture');
  if (!image) return null;

  return (
    <Grid templateColumns="auto 1fr" gap={6} mb={5}>
      {image && (
        <GridItem w="100%" display={'flex'} flexDir={'column'} justifyContent={'center'}>
          <Image
            maxHeight={'3xs'}
            marginRight={'auto'}
            maxWidth={'lg'}
            borderRadius={'lg'}
            src={get(catalog, 'data.st_picture.resolutions.4x3_M.url')}
            alt={get(catalog, 'data.st_picture.description')}
          />
        </GridItem>
      )}
      {!isEmpty(get(catalog, 'data.st_text', [])) && (
        <GridItem w="100%" display={'flex'} flexDir={'column'} justifyContent={'center'}>
          <div>
            <Heading color={'gray.200'}>Deep Dive</Heading>
            <RichText fsText={get(catalog, 'data.st_text')} />
          </div>
        </GridItem>
      )}
    </Grid>
  );
};

const FsExtraContentDecider = ({ catalog }) => {
  if (isEmpty(catalog)) return null;
  switch (catalog.sectionType) {
    case 'interactive_video_item':
      return <FsInteractiveVideoItem catalog={catalog} />;
    case 'interactive_video_product_item':
      return (
        <>
          <FsAdditionalContentEntry catalog={catalog} />
          <FsProductCatalogEntry catalog={catalog} />
        </>
      );
    default:
      return null;
  }
};

const FsInteractiveVideo = ({ section }) => {
  const [currentSeconds, setCurrentSections] = useState(0);
  const [catalog, setCatalog] = useState(get(section, 'data.st_catalog[0]'));
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    let catalogs = sortedCatalog.filter((catalog) => catalog.data.st_time < currentSeconds).filter(gap(0.25));

    if (isEmpty(catalogs)) return onClose();

    setCatalog(maxBy(catalogs, (o) => get(o, 'data.st_time')));
    onOpen();
  }, [currentSeconds]);

  if (!section?.data) return null;

  const youtubeId = get(section, 'data.st_youtubeVideo.value[0].identifier');
  const titleFallback = get(section, 'data.st_youtubeVideo.value[0].value.title');
  const sortedCatalog = sortBy(section.data.st_catalog, (o) => get(o, 'data.st_time'));

  const gap = (seconds) => (catalog) => {
    const nextIndex = sortedCatalog.indexOf(catalog) + 1;
    const nextStart = get(sortedCatalog, `[${nextIndex}].data.st_time`, 43200);

    if (nextStart <= currentSeconds) return false;

    return currentSeconds <= nextStart - seconds || currentSeconds >= nextStart;
  };

  const autoplay = section.data.st_autoPlay || false;

  return (
    <div data-preview-id={section?.previewId} key={section?.id}>
      <Box display={'flext'} position={'relative'}>
        <ReactPlayer
          width={'100%'}
          style={{
            aspectRatio: '16 / 9',
            marginBottom: '1.25rem',
            borderRadius: '0.5rem',
            overflow: 'hidden',
          }}
          height={'auto'}
          muted={autoplay}
          loop={false}
          controls={true}
          playing={autoplay}
          onProgress={({ playedSeconds }) => setCurrentSections(playedSeconds)}
          url={`https://www.youtube-nocookie.com/watch?v=${youtubeId}${autoplay ? '&autoplay=1&mute=1' : ''}`}
          config={{
            youtube: {
              embedOptions: {
                allow: 'autoplay; encrypted-media',
                allowFullScreen: true,
              },
            },
          }}
          key={section?.id}
          progressInterval={100}
          fallback={<Text>{titleFallback}</Text>}
        />
        <Collapse in={isOpen || false} animateOpacity>
          <FsExtraContentDecider catalog={catalog} />
        </Collapse>
      </Box>
    </div>
  );
};

FsProductCatalogEntry.propTypes = {
  catalog: PropTypes.object,
};

FsInteractiveVideoItem.propTypes = {
  catalog: PropTypes.object,
};

FsAdditionalContentEntry.propTypes = {
  catalog: PropTypes.object,
};

FsExtraContentDecider.propTypes = {
  catalog: PropTypes.object,
};

FsInteractiveVideo.propTypes = {
  section: PropTypes.object,
};

export default FsInteractiveVideo;
/** CFC End **/
