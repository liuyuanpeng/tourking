import React, { Component } from "react";
import { Select, Spin, Tooltip } from "antd";
import debounce from "lodash/debounce";
import { connect } from "dva";

const { Option } = Select;

@connect(({ driver, loading }) => ({
  loading: loading.effects["driver/searchDriverList"],
  data: driver.search
}))
class DriverInput extends Component {
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
      type: "driver/searchDriverList",
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
        allowClear
        showSearch
        value={value}
        placeholder="请输入司机电话或姓名搜索"
        notFoundContent={loading ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchDrivers}
        onChange={this.handleChange}
        style={style || { width: "100%" }}
      >
        {sourceData.map(d => (
          <Option key={d.id}>
            <Tooltip title={`${d.name}(${d.mobile})`}>
              {`${d.name}(${d.mobile})`}
            </Tooltip>
          </Option>
        ))}
      </Select>
    );
  }
}
export default DriverInput;
