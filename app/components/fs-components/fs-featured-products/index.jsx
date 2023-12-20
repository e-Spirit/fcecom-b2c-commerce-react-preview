/**
 * === CFC ===
 * Component to display products in a grid using the CFC Product DAP.
 */

/** CFC Start **/
import React from 'react';
import { Box, Heading, Image, LinkBox, SimpleGrid, Text } from '@chakra-ui/react';
import { RichText } from '../RichText';
import get from 'lodash.get';
import { EcomShopLink } from '../fs-link';
import PropTypes from 'prop-types';

const FsFeaturedProducts = ({ section }) => {
  if (!section?.data) return null;

  const data = section.data;
  const products = data.st_products;

  const productItem = products.value.map((product) => {
    if (product.value !== null) {
      return (
        <LinkBox key={product.value.id}>
          <Box>
            <EcomShopLink type={'product'} id={product.value.id}>
              <Image src={product.value.image} objectFit="contain" height={'400px'} width={'100vw'} borderRadius={'lg'} />
              <Heading as={'h3'} size="md" marginTop={5} marginBottom={5} marginX={10} textAlign={'center'}>
                {product.value.label}
              </Heading>
              <Text marginX={5}>{product.value.extract}</Text>
            </EcomShopLink>
          </Box>
        </LinkBox>
      );
    }
  });

  return (
    <Box data-preview-id={section.previewId} display={'block'} paddingTop={5} position={'relative'} overflow={'hidden'}>
      <Heading as={'h2'} fontSize={40} textAlign="center">
        {data.st_headline}
      </Heading>
      <Box marginX={36} textAlign="center">
        <RichText fsText={get(section, 'data.st_text')}></RichText>
      </Box>
      <SimpleGrid columns={[1, 2, 3]} spacing={10} marginTop={5} marginBottom={5}>
        {productItem}
      </SimpleGrid>
    </Box>
  );
};

FsFeaturedProducts.propTypes = {
  section: PropTypes.object,
};

export default FsFeaturedProducts;
/** CFC End **/
