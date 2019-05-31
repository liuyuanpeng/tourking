import React, { Component } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { connect } from "dva";

const Option = Select.Option;

@connect(({ car_type, price }) => ({
  carTypes: car_type.list,
  priceStrategies: price.list
}))
export default class CarStrategySelection extends Component {
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
      config_id: value.price_strategy_id || "",
      price_strategy_id: value.price_strategy_id || ""
    };
  }

  changeCarType = config_id => {
    if (!("value" in this.props)) {
      this.setState({ config_id });
    }
    this.triggerChange({ config_id });
  };

  changePriceStrategy = price_strategy_id => {
    if (!("value" in this.props)) {
      this.setState({ price_strategy_id });
    }
    this.triggerChange({ price_strategy_id });
  };

  triggerChange = changeValue => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changeValue));
    }
  };

  render() {
    const { config_id, price_strategy_id } = this.state;
    const { carTypes, priceStrategies } = this.props;
    return (
      <div style={{ display: "inline-block", width: "calc(100% - 40px)" }}>
        <Select
          style={{ width: "100%" }}
          value={config_id}
          onChange={this.changeCarType}
        >
          {carTypes.map(item => (
            <Option key={item.id}>{item.name}</Option>
          ))}
        </Select>
        <span style={{ marginRight: "20px" }}>价格策略:</span>

        <div
          style={{
            display: "inline-block",
            verticalAlign: "top",
            width: "calc(100% - 85px)"
          }}
        >
          <Select
            style={{ width: "100%" }}
            value={price_strategy_id}
            onChange={this.changePriceStrategy}
          >
            {priceStrategies.map(item => (
              <Option key={item.id}>{item.strategy_name}</Option>
            ))}
          </Select>
          <div>
            {price_strategy_id &&
              priceStrategies.find(item => item.id === price_strategy_id)
                .plan_description}
          </div>
        </div>
      </div>
    );
  }
}
