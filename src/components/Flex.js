/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import React from 'react';
import { Box, unit } from './Box';

export const computeFlexProps = props => {
  const {
    direction,
    wrap,
    align,
    justify,
    inline,
    ...rest
  } = props;
  return {
    style: {
      ...rest.style,
      display: inline ? 'inline-flex' : 'flex',
      flexDirection: direction,
      flexWrap: wrap,
      alignItems: align,
      justifyContent: justify,
    },
    ...rest,
  };
};

export const Flex = props => (
  <Box {...computeFlexProps(props)} />
);

export const computeFlexItemProps = props => {
  const {
    style,
    grow,
    order,
    shrink,
    // IE11: Always set basis to specified width, which fixes certain
    // bugs when rendering tables inside the flex.
    basis = props.width,
    align,
    ...rest
  } = props;
  return {
    style: {
      ...style,
      flexGrow: grow,
      flexShrink: shrink,
      flexBasis: unit(basis),
      order: order,
      alignSelf: align,
    },
    ...rest,
  };
};

export const FlexItem = props => (
  <Box {...computeFlexItemProps(props)} />
);

Flex.Item = FlexItem;
