/**
 * === CFC ===
 * Component to display products in a grid using the CFC Product DAP.
 */

/** CFC Start **/
import React from 'react';
import { Box, Heading, Image, LinkBox, SimpleGrid, Text } from '@chakra-ui/react';
import { RichText } from '../RichText';
import { get } from 'lodash';
import { EcomShopLink } from '../fs-link';
import PropTypes from 'prop-types';
import { EmptyState } from '../../fs-empty-state/emptyState';

const FsFeaturedProducts = ({ section }) => {
  // missing data
  if (!section?.data) return <EmptyState section={section} message="Missing data" />;

  const data = section.data;

  // products
  const products = data.st_products;

  // extract
  const headline = data.st_headline;
  const fsText = get(section, 'data.st_text');

  // null
  if (!products?.value?.length && !headline && !fsText?.length) return <EmptyState section={section} message="Missing any data" />;

  return (
    <Box data-preview-id={section.previewId} display={'block'} paddingTop={5} position={'relative'} overflow={'hidden'}>
      <Heading as={'h2'} fontSize={40} textAlign="center">
        {headline}
      </Heading>
      <Box marginX={36} textAlign="center">
        <RichText fsText={fsText}></RichText>
      </Box>
      <SimpleGrid columns={[1, 2, 3]} spacing={10} marginTop={5} marginBottom={5}>
        {products.value?.map((product) => {
          if (!product.value) return <EmptyState message="Missing product data" />;

          const { image, id, extract, label } = product.value;

          return (
            <LinkBox key={id}>
              <Box>
                <EcomShopLink type={'product'} id={id}>
                  <Image src={image} objectFit="contain" height={'400px'} width={'100vw'} borderRadius={'lg'} />
                  <Heading as={'h3'} size="md" marginTop={5} marginBottom={5} marginX={10} textAlign={'center'}>
                    {label}
                  </Heading>
                  <Text marginX={5}>{extract}</Text>
                </EcomShopLink>
              </Box>
            </LinkBox>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

FsFeaturedProducts.propTypes = {
  section: PropTypes.object,
};

export default FsFeaturedProducts;
/** CFC End **/
