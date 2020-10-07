/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import React from 'react';
import { classes } from '../common/react';
import { Box } from './Box';

const FA_OUTLINE_REGEX = /-o$/;

export const Icon = props => {
  const {
    name,
    size,
    spin,
    className,
    style = {},
    rotation,
    ...rest
  } = props;
  if (size) {
    style['fontSize'] = (size * 100) + '%';
  }
  if (typeof rotation === 'number') {
    style['transform'] = `rotate(${rotation}deg)`;
  }
  const faRegular = FA_OUTLINE_REGEX.test(name);
  const faName = name.replace(FA_OUTLINE_REGEX, '');
  return (
    <Box
      as="i"
      className={classes([
        className,
        faRegular ? 'far' : 'fas',
        'fa-' + faName,
        spin && 'fa-spin',
      ])}
      style={style}
      {...rest} />
  );
};
