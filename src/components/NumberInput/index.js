import React, { Component } from "react";
import PropTypes from "prop-types";
import { Input } from "antd";

export default class NumberInput extends Component {
  static propTypes = {
    numberType: PropTypes.string
  };

  static defaultProps = {
    numberType: ''
  }

  getRegex = () => {
    const { numberType } = this.props;
    if (numberType === "integer") {
      return {
        regex: /^-?(0|[1-9][0-9]*)$/,
        allowNegative: true
      };
    } if (numberType === "positive integer") {
      return {
        regex: /^[1-9][0-9]*$/,
        allowNegative: false
      };
    } if (numberType === "natural integer") {
      return {
        regex: /^0|[1-9][0-9]*$/,
        allowNegative: false
      };
    } if (numberType === "natural decimal") {
      return {
        regex: /^(0|[1-9][0-9]*)(\.[0-9]*)?$/,
        allowNegative: false
      };
    } 
      return {
        regex: /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/,
        allowNegative: true
      };
    
  };

  onChange = e => {
    const { value } = e.target;
    const reg = this.getRegex();
    if (
      (!Number.isNaN(value) && reg.regex.test(value)) ||
      value === "" ||
      (reg.regex.allowNegative && value === "-")
    ) {
      const {onChange} = this.props;
      if (onChange) {
        onChange(value)
      }
    }
  };

  // '.' at the end or only '-' in the input box.
  onBlur = () => {
    const { value, onBlur, onChange } = this.props;
    if (value && (value.charAt(value.length - 1) === "." || value === "-")) {
      onChange(value.slice(0, -1));
    }
    if (onBlur) {
      onBlur();
    }
  };

  render() {
    const { numberType, ...others } = this.props;
    return <Input {...others} onChange={this.onChange} onBlur={this.onBlur} />;
  }
}
