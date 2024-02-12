/**
 * === CFC ===
 * Component to display the product flyout that is used in the interactive image component.
 */

/** CFC Start **/
import React from 'react';
import { Box, Button, Image, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader } from '@chakra-ui/react';
import { get } from 'lodash';
import { EcomShopLink } from '../fs-link';
import PropTypes from 'prop-types';

const FsProductFlyout = ({ area }) => {
  const product = get(area, 'link.data.lt_product.value[0]', null);
  const label = get(product, 'value.label', null);
  const productId = get(product, 'value.id', null);
  const extract = get(product, 'value.extract', null);
  const image = get(product, 'value.image', null);
  const headLine = get(area, 'link.data.lt_headline', null);

  if (!product) return null;

  return (
    <PopoverContent borderRadius="lg" padding={'10px'}>
      {(headLine || label) && (
        <PopoverHeader paddingInline={'10px'} paddingTop={'3px'}>
          {headLine ?? label}
        </PopoverHeader>
      )}
      <PopoverCloseButton top={4} right={4} />
      {(image || extract) && (
        <PopoverBody>
          {image && <Image src={image} borderRadius="lg" />}
          {extract && <Box paddingY={'10px'}>{extract}</Box>}
        </PopoverBody>
      )}
      <PopoverFooter display={'flex'} justifyContent={'center'}>
        <EcomShopLink type={'product'} id={productId}>
          <Button variant={'outline'} size={'sm'}>
            Open
          </Button>
        </EcomShopLink>
      </PopoverFooter>
    </PopoverContent>
  );
};

FsProductFlyout.propTypes = {
  area: PropTypes.object,
};

export default FsProductFlyout;
/** CFC End **/
