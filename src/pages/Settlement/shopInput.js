import React, { Component } from "react";
import { Select, Spin, Tooltip } from "antd";
import debounce from "lodash/debounce";
import { connect } from "dva";

const { Option } = Select;

@connect(({ shop, loading }) => ({
  loading: loading.effects["shop/searchShopList"],
  data: shop.search
}))
class ShopInput extends Component {
  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.value !== state.value) {
      return {
        value: nextProps.value
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
    const { loading, data, drivers, style } = this.props;
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
        placeholder="请输入商家名称搜索"
        notFoundContent={loading ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchDrivers}
        onChange={this.handleChange}
        style={ style || { width: "100%" }}
      >
        {sourceData.map(d => (
          <Option key={d.id}>
            <Tooltip title={`${d.name}`}>{`${d.name}`}</Tooltip>
          </Option>
        ))}
      </Select>
    );
  }
}
export default ShopInput;
