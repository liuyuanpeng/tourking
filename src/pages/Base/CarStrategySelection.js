import React, { Component } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { connect } from "dva";
import NumberInput from '@/components/NumberInput';
import price from '@/models/price';

const Option = Select.Option;

@connect(({ car_type, price, sit }) => ({
  carTypes: car_type.list,
  priceStrategies: price.list,
  sits: sit.list
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
      chexing_id: value.chexing_id || "",
      price_strategy_id: value.price_strategy_id || "",
      zuowei_id: value.zuowei_id,
      price: value.price
    };
  }

  changeCarType = chexing_id => {
    if (!("value" in this.props)) {
      this.setState({ chexing_id });
    }
    this.triggerChange({ chexing_id });
  };

  changePriceStrategy = price_strategy_id => {
    if (!("value" in this.props)) {
      this.setState({ price_strategy_id });
    }
    this.triggerChange({ price_strategy_id });
  };

  changeSit = zuowei_id => {
    if (!("value" in this.props)) {
      this.setState({ zuowei_id });
    }
    this.triggerChange({ zuowei_id });
  };

  changePrice = price => {
    if (!("value" in this.props)) {
      this.setState({ price });
    }
    this.triggerChange({ price });
  };

  triggerChange = changeValue => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changeValue));
    }
  };

  render() {
    const { chexing_id, price_strategy_id, zuowei_id, price } = this.state;
    const { carTypes, priceStrategies, sits, isBAOCHE=false } = this.props;
    return (
      <div style={{ display: "inline-block", width: "calc(100% - 40px)" }}>
        <Select
          style={{ width: "100%" }}
          value={chexing_id}
          onChange={this.changeCarType}
        >
          {carTypes.map(item => (
            <Option key={item.id}>{item.name}</Option>
          ))}
        </Select>
        <span style={{ marginRight: "20px" }}>座位类型:</span>
        <div
          style={{
            display: "inline-block",
            verticalAlign: "top",
            width: "calc(100% - 85px)"
          }}
        >
          <Select
            style={{ width: "100%" }}
            value={zuowei_id}
            onChange={this.changeSit}
          >
            {sits.map(item => (
              <Option key={item.id}>{item.name}</Option>
            ))}
          </Select>
        </div>
        {isBAOCHE ? (
          <div>
            <span style={{ marginRight: "20px" }}>一口价:</span>
            <div
              style={{
                display: "inline-block",
                verticalAlign: "top",
                width: "calc(100% - 85px)"
              }}
            >
            <NumberInput value={price}  prefix="￥" suffix="/天" numberType="integer" onChange={this.changePrice} />
            </div>
          </div>
        ) : (
          <div>
            <span style={{ marginRight: "20px" }}>起步价:</span>
            <div
              style={{
                display: "inline-block",
                verticalAlign: "top",
                width: "calc(100% - 85px)"
              }}
            >
            <NumberInput value={price}  prefix="￥" suffix="/起" numberType="integer" onChange={this.changePrice} />
            </div>
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
        )}
      </div>
    );
  }
}
