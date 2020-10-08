/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import React, { Component, createRef } from 'react';
import { classes } from '../common/react';

export const toInputValue = value => (
  typeof value !== 'number' && typeof value !== 'string'
    ? ''
    : String(value)
);

export class Input extends Component {
  constructor() {
    super();
    this.inputRef = createRef();
    this.state = {
      editing: false,
      value: undefined,
    };
    this.handleInput = e => {
      const { editing } = this.state;
      const { onInput } = this.props;
      if (!editing) {
        this.setEditing(true);
      }
      if (onInput) {
        onInput(e, e.target.value);
      }
    };
    this.handleFocus = e => {
      const { editing } = this.state;
      if (!editing) {
        this.setEditing(true);
      }
    };
    this.handleBlur = e => {
      const { editing } = this.state;
      const { onChange } = this.props;
      if (editing) {
        this.setEditing(false);
        if (onChange) {
          onChange(e, e.target.value);
        }
      }
    };
    this.handleKeyDown = e => {
      const { onInput, onChange, onEnter, onKeyDown } = this.props;
      if (onKeyDown) {
        onKeyDown(e, e.target.value);
        if (e.defaultPrevented) {
          return;
        }
      }
      if (e.key === 'Enter') {
        this.setEditing(false);
        if (onInput) {
          onInput(e, e.target.value);
        }
        if (onChange) {
          onChange(e, e.target.value);
        }
        if (onEnter) {
          onEnter(e, e.target.value);
        }
        return;
      }
      if (e.key === 'Escape') {
        this.setEditing(false);
        e.target.value = toInputValue(this.props.value);
        e.target.blur();
        return;
      }
    };
  }

  componentDidMount() {
    const nextValue = this.props.value;
    const input = this.inputRef.current;
    if (input) {
      input.value = toInputValue(nextValue);
    }
    if (this.props.autoFocus) {
      setTimeout(() => input.focus(), 1);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { editing } = this.state;
    const prevValue = prevProps.value;
    const nextValue = this.props.value;
    const input = this.inputRef.current;
    if (input && !editing && prevValue !== nextValue) {
      input.value = toInputValue(nextValue);
    }
  }

  setEditing(editing) {
    this.setState({ editing });
  }

  render() {
    const { props } = this;
    // Input only props
    const {
      className,
      autoFocus,
      onInput,
      onChange,
      onEnter,
      onKeyDown,
      value,
      ...rest
    } = props;
    return (
      <input
        {...rest}
        ref={this.inputRef}
        className={classes([
          'Input',
          className,
        ])}
        onInput={this.handleInput}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onKeyDown={this.handleKeyDown} />
    );
  }
}
