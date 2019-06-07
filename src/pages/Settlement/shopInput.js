import React, { Component } from "react";
import { Select, Spin } from "antd";
import debounce from "lodash/debounce";
import { connect } from "dva";

const { Option } = Select;

@connect(({ shop, loading }) => ({
  loading: loading.effects["shop/searchShopList"],
  data: shop.search
}))
class ShopInput extends Component {
  static getDerivedStateFromProps(nextProps) {
    if ("value" in nextProps) {
      return {
        ...(nextProps.value || {})
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      value: value || ""
    };
    this.lastFetchId = 0;
    this.fetchDrivers = debounce(this.fetchDrivers, 800);
  }

  fetchDrivers = value => {
    this.lastFetchId += 1;
    const { dispatch } = this.props;
    dispatch({
      type: "shop/searchShopList",
      payload: {
        value
      }
    });
  };

  handleChange = value => {
    this.setState({
      value
    });

    this.props.onChange && this.props.onChange(value);
  };

  render() {
    const { loading, data, drivers } = this.props;
    const { value } = this.state;
    let sourceData = data;
    if (data && data.length <= 0 && drivers) {
      sourceData = drivers;
    }
    return (
      <Select
        {...this.props}
        showSearch
        value={value}
        notFoundContent={loading ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchDrivers}
        onChange={this.handleChange}
        style={{ width: "100%" }}
      >
        {sourceData.map(d => (
          <Option key={d.id}>{`${d.name}`}</Option>
        ))}
      </Select>
    );
  }
}
export default ShopInput;