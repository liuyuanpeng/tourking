import React, { PureComponent } from "react";
import {
  Input,
  DatePicker,
  Select,
  Button,
  Table,
  Card,
  Form,
  Row,
  Col,
  message
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import { formatMessage } from "umi-plugin-react/locale";
import { connect } from "dva";
import moment from "moment";
import ShopInput from "./shopInput";
import styles from "./index.less";

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ order, loading }) => ({
  submitting: loading.effects["order/fetchSettledPage"],
  data: order.list,
  page: order.page,
  total: order.total
}))
@Form.create()
class Settlement extends PureComponent {
  static propTypes = {};

  state = {
    selectedRowKeys: []
  };

  columns = [
    {
      title: "结算状态",
      dataIndex: "order_status",
      key: "settled_type",
      render: text => (text === "SETTLED" ? "已结算" : "待结算")
    },
    {
      title: "来源商家",
      dataIndex: "shop_name",
      key: "shop_name"
    },
    {
      title: "费用",
      dataIndex: "price",
      key: "price"
    },
    {
      title: "结算时间",
      dataIndex: "settled_time",
      key: "settled_time",
      render: text => (text ? moment(text).format("YYYY-MM-DD hh:mm") : "")
    },
    {
      title: "乘客姓名",
      dataIndex: "username",
      key: "username"
    },
    {
      title: "类型",
      dataIndex: "scene",
      key: "scene",
      render: text => (text === "JIEJI" ? "接机" : "送机")
    },
    {
      title: "上车地点",
      dataIndex: "start_place",
      key: "start_place"
    },
    {
      title: "目的地",
      dataIndex: "target_place",
      key: "target_place"
    },
    {
      title: "上车时间",
      dataIndex: "start_time",
      key: "start_time",
      render: text => (text ? moment(text).format("YYYY-MM-DD hh:mm") : "")
    },
    {
      title: "航班号/班次",
      dataIndex: "air_no",
      key: "air_no"
    },
    {
      title: "电话",
      dataIndex: "mobile",
      key: "mobile"
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark"
    },
    {
      title: "下单时间",
      dataIndex: "create_time",
      key: "create_time",
      render: text => (text ? moment(text).format("YYYY-MM-DD hh:mm") : "")
    },
    {
      title: "订单ID",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "操作",
      fixed: "right",
      key: "aciton",
      width: 50,
      render: (text, record) =>
        record.order_status === "SETTLED" ? (
          ""
        ) : (
          <span>
            <a href="javascript:;" onClick={() => this.handleSettle(record)}>
              结算
            </a>
          </span>
        )
    }
  ];

  rowSelection = {
    onChange: selectedRowKeys => {
      this.setState({
        selectedRowKeys
      });
    },
    getCheckboxProps: record => ({
      disabled: record.order_status === "SETTLED"
    })
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.searchKeys = {};
    dispatch({
      type: "order/fetchSettledPage",
      payload: {
        page: 0,
        size: 10,
        onFailure: msg => {
          message.error(msg || "获取结算列表失败");
        }
      }
    });
  }

  handleSettle = record => {
    const { dispatch, page } = this.props;
    dispatch({
      type: "order/settleOrder",
      payload: {
        id: record.id,
        page,
        size: 10,
        ...this.searchKeys,
        onSuccess: () => {
          message.success("结算成功");
        },
        onFailure: msg => {
          message.error(msg || "结算失败");
        }
      }
    });
  };

  handleMultiSettle = () => {
    const { dispatch, page } = this.props;
    const { selectedRowKeys } = this.state;
    const { searchKeys } = this;
    dispatch({
      type: "order/batchSettled",
      payload: {
        ids: selectedRowKeys.toString(),
        ...searchKeys,
        page,
        size: 10,
        onSuccess: () => {
          message.success("批量结算成功");
          this.setState({
            selectedRowKeys: []
          });
        },
        onFailure: msg => {
          message.error(msg || "批量结算失败");
        }
      }
    });
  };

  handleExport = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const { create_range, settled_range, ...others } = values;
      this.searchKeys = { ...others };
      Object.keys(this.searchKeys).forEach(key => {
        if (!this.searchKeys[key]) {
          delete this.searchKeys[key];
        }
      });
      if (create_range && create_range.length) {
        this.searchKeys = {
          ...this.searchKeys,
          create_start: create_range[0].startOf("day").valueOf(),
          create_end: create_range[1].endOf("day").valueOf()
        };
      }
      if (settled_range && settled_range.length) {
        this.searchKeys = {
          ...this.searchKeys,
          settled_start: settled_range[0].startOf("day").valueOf(),
          settled_end: settled_range[1].endOf("day").valueOf()
        };
      }

      dispatch({
        type: "order/exportSettled",
        payload: {
          ...this.searchKeys
        },
        callback: response => {
          if (response.type.indexOf('application/json') !== -1) {
            message.error(response.message || '导出失败')
            return
          }
          const blob = new Blob([response], { type: "Files" });
          const aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = URL.createObjectURL(blob);
          aLink.download = "结算订单列表.xls";
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
        }
      });
    });
  };

  handleSearch = e => {
    const { dispatch, page, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const { create_range, settled_range, ...others } = values;
      this.searchKeys = { ...others };
      Object.keys(this.searchKeys).forEach(key => {
        if (!this.searchKeys[key]) {
          delete this.searchKeys[key];
        }
      });
      if (create_range && create_range.length) {
        this.searchKeys = {
          ...this.searchKeys,
          create_start: create_range[0].startOf("day").valueOf(),
          create_end: create_range[1].endOf("day").valueOf()
        };
      }
      if (settled_range && settled_range.length) {
        this.searchKeys = {
          ...this.searchKeys,
          settled_start: settled_range[0].startOf("day").valueOf(),
          settled_end: settled_range[1].endOf("day").valueOf()
        };
      }

      dispatch({
        type: "order/fetchSettledPage",
        payload: {
          page,
          size: 10,
          ...this.searchKeys,
          onFailure: msg => {
            message.error(msg || "获取结算列表失败!");
          }
        }
      });
    });
  };

  handleReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    this.searchKeys = {};
    dispatch({
      type: "order/fetchSettledPage",
      payload: {
        page: 0,
        size: 10,
        ...this.searchKeys,
        onFailure: msg => {
          message.error(msg || "获取结算列表失败!");
        }
      }
    });
  };

  handleRefresh = () => {
    const { dispatch, page } = this.props;
    dispatch({
      type: "order/fetchSettledPage",
      payload: {
        page,
        size: 10,
        ...this.searchKeys,
        onFailure: msg => {
          message.error(msg || "获取结算列表失败!");
        }
      }
    });
  };

  handlePageChange = (page, size) => {
    const { dispatch } = this.props;
    dispatch({
      type: "order/fetchSettledPage",
      payload: {
        page,
        size,
        ...this.searchKeys,
        onFailure: msg => {
          message.error(msg || "获取订单列表失败");
        }
      }
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16} type="flex" monospaced="true" arrangement="true">
          <Col span={8}>
            <FormItem label="结算状态">
              {getFieldDecorator("settled_type")(
                <Select allowClear style={{ width: "100%" }}>
                  <Option value="1">已结算</Option>
                  <Option value="2">待结算</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="商家来源">
              {getFieldDecorator("shop_id")(<ShopInput allowClear />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="订单ID">
              {getFieldDecorator("order_id")(<Input />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="精确查找">
              {getFieldDecorator("value")(<Input placeholder="姓名/电话" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="目的地">
              {getFieldDecorator("target_place")(<Input />)}
            </FormItem>
          </Col>
          <Col>
            <FormItem label="结算时间">
              {getFieldDecorator("settled_range")(
                <RangePicker
                  disabledDate={this.disabledDate}
                  style={{ width: "100%" }}
                  placeholder={[
                    formatMessage({ id: "form.date.placeholder.start" }),
                    formatMessage({ id: "form.date.placeholder.end" })
                  ]}
                />
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem label="下单时间">
              {getFieldDecorator("create_range")(
                <RangePicker
                  disabledDate={this.disabledDate}
                  style={{ width: "100%" }}
                  placeholder={[
                    formatMessage({ id: "form.date.placeholder.start" }),
                    formatMessage({ id: "form.date.placeholder.end" })
                  ]}
                />
              )}
            </FormItem>
          </Col>
          <Col>
            <Button type="primary" onClick={this.handleSearch}>
              查询
            </Button>
          </Col>
          <Col>
            <Button onClick={this.handleReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { loading, data, page, total } = this.props;
    const { selectedRowKeys } = this.state;
    return (
      <PageHeaderWrap title="结算管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {selectedRowKeys && selectedRowKeys.length > 0 && (
                <Button type="primary" onClick={this.handleMultiSettle}>
                  批量结算
                </Button>
              )}
              <Button icon="reload" type="primary" onClick={this.handleRefresh}>
                刷新
              </Button>
              <Button
                icon="export"
                type="primary"
                onClick={this.handleExport}
              >
                导出查询
              </Button>
            </div>
            <div className={styles.tableWrapper}>
              <Table
                rowKey={record => record.id}
                loading={loading}
                rowSelection={this.rowSelection}
                pagination={{
                  pageSize: 10,
                  current: page + 1,
                  total: total * 10,
                  onChange: (curPage, pageSize) => {
                    this.handlePageChange(curPage - 1, pageSize);
                  }
                }}
                dataSource={data}
                columns={this.columns}
                scroll={{ x: 2080 }}
              />
            </div>
          </div>
        </Card>
      </PageHeaderWrap>
    );
  }
}
export default Settlement;
