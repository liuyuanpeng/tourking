import React, { Component } from "react";
import { Select } from "antd";
import NumberInput from '@/components/NumberInput'

export default class DistanceAndPriceInput extends Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ("value" in nextProps) {
      return {
        ...(nextProps.value || {})
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      distance: value.distance || "",
      price: value.price || ""
    };
  }

  changeDistance = distance => {
    if (!("value" in this.props)) {
      this.setState({ distance });
    }
    this.triggerChange({ distance });
  };

  changePrice = price => {
    if (!("value" in this.props)) {
      this.setState({ price });
    }
    this.triggerChange({ price });
  };

  triggerChange = changeValue => {
    const {onChange} = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changeValue));
    }
  };

  render() {
    const { distance, price } = this.state;
    return (
      <div style={{ display: "inline-block", width: "calc(100% - 40px)" }}>
        <NumberInput onChange={this.changeDistance} style={{textAlign: 'right'}} value={distance} addonBefore='分段里程:' addonAfter='公里' />
        <NumberInput onChange={this.changePrice} style={{textAlign: 'right'}} value={price} addonBefore="一口价:" addonAfter="元" />
      </div>
    );
  }
}
