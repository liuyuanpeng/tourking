import React, { Component } from "react";
import { Input, InputNumber } from "antd";

const InputGroup = Input.Group;

export default class RangeInput extends Component {
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
      min: value.min || "",
      max: value.max || ""
    };
  }

  changeMin = min => {
    if (Number.isNaN(min)) {
      return;
    }
    if (!("min" in this.props)) {
      this.setState({ min });
    }
    this.triggerChange({
      min
    });
  };

  changeMax = max => {
    if (Number.isNaN(max)) {
      return;
    }
    if (!("max" in this.props)) {
      this.setState({ max });
    }
    this.triggerChange({
      max
    });
  };

  triggerChange = changedValue => {
    const {onChange} = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };

  render() {
    const { min, max } = this.state;
    return (
      <InputGroup compact>
        <InputNumber
          value={min}
          onChange={this.changeMin}
          style={{ width: 100, textAlign: "center" }}
        />
        <Input
          style={{
            width: 30,
            borderLeft: 0,
            pointerEvents: "none",
            backgroundColor: "#fff"
          }}
          placeholder="~"
          disabled
        />
        <InputNumber
          value={max}
          onChange={this.changeMax}
          style={{ width: 100, textAlign: "center", borderLeft: 0 }}
        />
      </InputGroup>
    );
  }
}
