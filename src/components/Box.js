/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import { createElement } from 'react';

/**
 * Coverts our rem-like spacing unit into a CSS unit.
 */
export const unit = value => {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return value + 'rem';
  }
};

/**
 * Same as `unit`, but half the size for integers numbers.
 */
export const halfUnit = value => {
  if (typeof value === 'string') {
    return unit(value);
  }
  if (typeof value === 'number') {
    return unit(value * 0.5);
  }
};

const mapRawPropTo = attrName => (style, value) => {
  if (typeof value === 'number' || typeof value === 'string') {
    style[attrName] = value;
  }
};

const mapUnitPropTo = (attrName, unit) => (style, value) => {
  if (typeof value === 'number' || typeof value === 'string') {
    style[attrName] = unit(value);
  }
};

const mapBooleanPropTo = (attrName, attrValue) => (style, value) => {
  if (value) {
    style[attrName] = attrValue;
  }
};

const mapDirectionalUnitPropTo = (attrName, unit, dirs) => (style, value) => {
  if (typeof value === 'number' || typeof value === 'string') {
    for (let i = 0; i < dirs.length; i++) {
      style[attrName + dirs[i]] = unit(value);
    }
  }
};

const styleMapperByPropName = {
  // Direct mapping
  width: mapUnitPropTo('width', unit),
  minWidth: mapUnitPropTo('minWidth', unit),
  maxWidth: mapUnitPropTo('maxWidth', unit),
  height: mapUnitPropTo('height', unit),
  minHeight: mapUnitPropTo('minHeight', unit),
  maxHeight: mapUnitPropTo('maxHeight', unit),
  fontSize: mapUnitPropTo('fontSize', unit),
  fontFamily: mapRawPropTo('fontFamily'),
  lineHeight: (style, value) => {
    if (typeof value === 'number') {
      style.lineHeight = value;
    }
    else if (typeof value === 'string') {
      style.lineHeight = unit(value);
    }
  },
  opacity: mapRawPropTo('opacity'),
  textAlign: mapRawPropTo('textAlign'),
  // Boolean props
  inline: mapBooleanPropTo('display', 'inline-block'),
  bold: mapBooleanPropTo('fontWeight', 'bold'),
  italic: mapBooleanPropTo('fontStyle', 'italic'),
  nowrap: mapBooleanPropTo('whiteSpace', 'nowrap'),
  // Margins
  m: mapDirectionalUnitPropTo('margin', halfUnit, [
    'Top', 'Bottom', 'Left', 'Right',
  ]),
  mx: mapDirectionalUnitPropTo('margin', halfUnit, [
    'Left', 'Right',
  ]),
  my: mapDirectionalUnitPropTo('margin', halfUnit, [
    'Top', 'Bottom',
  ]),
  mt: mapUnitPropTo('marginTop', halfUnit),
  mb: mapUnitPropTo('marginBottom', halfUnit),
  ml: mapUnitPropTo('marginLeft', halfUnit),
  mr: mapUnitPropTo('marginRight', halfUnit),
  // Margins
  p: mapDirectionalUnitPropTo('padding', halfUnit, [
    'Top', 'Bottom', 'Left', 'Right',
  ]),
  px: mapDirectionalUnitPropTo('padding', halfUnit, [
    'Left', 'Right',
  ]),
  py: mapDirectionalUnitPropTo('padding', halfUnit, [
    'Top', 'Bottom',
  ]),
  pt: mapUnitPropTo('paddingTop', halfUnit),
  pb: mapUnitPropTo('paddingBottom', halfUnit),
  pl: mapUnitPropTo('paddingLeft', halfUnit),
  pr: mapUnitPropTo('paddingRight', halfUnit),
  // Color props
  color: mapRawPropTo('color'),
  textColor: mapRawPropTo('color'),
  backgroundColor: mapRawPropTo('backgroundColor'),
};

export const computeBoxProps = props => {
  const computedProps = {};
  const computedStyles = {};
  // Compute props
  for (let propName of Object.keys(props)) {
    if (propName === 'style') {
      continue;
    }
    const propValue = props[propName];
    const mapPropToStyle = styleMapperByPropName[propName];
    if (mapPropToStyle) {
      mapPropToStyle(computedStyles, propValue);
    }
    else {
      computedProps[propName] = propValue;
    }
  }
  // Concatenate styles
  computedProps.style = {
    ...computedStyles,
    ...props.style,
  };
  return computedProps;
};

export const Box = props => {
  const {
    as = 'div',
    children,
    ...rest
  } = props;
  // Render props
  if (typeof children === 'function') {
    return children(computeBoxProps(props));
  }
  const computedProps = computeBoxProps(rest);
  // Render a wrapper element
  return createElement(as, computedProps, children);
};
