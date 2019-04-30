import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Input,
  DatePicker,
  Select,
  Button,
  Table,
  Card,
  Form,
  Row,
  Col
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import { connect } from "dva";
import styles from "./Book.less";
import { getFileItem } from "antd/lib/upload/utils";
import StandardTable from "@/components/StandardTable";
import LocationInput from "@/components/LocationInput";

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

const NewOrder = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const labelLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 }
  };

  return (
    <Modal
      destroyOnClose
      title="新增订单"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        handleModalVisible();
      }}
    >
      <Row>
        <Col>
          <FormItem {...labelLayout} label="类型">
            {form.getFieldDecorator("type", {
              rules: [
                {
                  required: true,
                  message: "请选择类型"
                }
              ]
            })(
              <Select
                style={{ width: "60%" }}
                placeholder="请选择类型"
              >
                <Option value="1">类型1</Option>
                <Option value="2">类型2</Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="上车时间">
            {form.getFieldDecorator("time", {
              rules: [
                {
                  required: true,
                  message: "请选择上车时间"
                }
              ]
            })(
              <DatePicker
                showTime={{ format: "HH:mm" }}
                placeholder="上车时间"
                style={{ width: "100%" }}
                getPopupContainer={trigger => trigger.parentNode}
              />
            )}
          </FormItem>
        </Col>
        <Col>
        <FormItem {...labelLayout} label="上车地点">
        {
          form.getFieldDecorator('address', {
            rules: [
              {
                required: true,
                message: "请选择上车地点"
              }
            ]
          })(
            <LocationInput/>
          )
        }
        </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

@connect(({ loading }) => ({
  submitting: loading.effects["form/submitRegularForm"]
}))
@Form.create()
export default class Book extends PureComponent {
  static propTypes = {
  };

  state = {
    modalVisible: false,
    formValues: {},
    selectedRows: []
  };

  columns = [
    {
      title: "乘车人姓名",
      dataIndex: "name"
    },
    {
      title: "类型",
      dataIndex: "type"
    },
    {
      title: "上车地点",
      dataIndex: "address"
    },
    {
      title: "目的地",
      dataIndex: "destination"
    },
    {
      title: "上车时间",
      dataIndex: "time"
    },
    {
      title: "航班号/班次",
      dataIndex: "number"
    },
    {
      title: "电话",
      dataIndex: "phone"
    },
    {
      title: "紧急联系人",
      dataIndex: "emergency"
    },
    {
      title: "备注",
      dataIndex: "backup"
    },
    {
      title: "下单时间",
      dataIndex: "orderTime"
    },
    {
      title: "订单ID",
      dataIndex: "orderNumber"
    },
    {
      title: "订单状态",
      dataIndex: "OrderStatus"
    },
    {
      title: "操作",
      render: (text, record) => (
        <Fragment>
          <a href="javascript:;" onClick={() => this.handleEdit(record)}>编辑</a>}
          <a href="javascript:;" onClick={() => this.handleCancel(record)}>取消</a>}
          <a href="javascript:;" onClick={() => this.handlePush(record)}>推送</a>}
        </Fragment>
      )
    }
  ];

  handleEdit = record => {};

  handleCancel = record => {};

  handlePush = record => {};

  handleMultiplePush = () => {};

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag
    });
  };

  handleAdd = fields => {
    console.log("handleAdd: ", fields);
    this.handleModalVisible();
  };

  handleExport = () => {};

  handleSearch = () => {};

  handleReset = () => {};

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    console.log("handleStandardTableChange: ", params);
  };

  renderForm() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16} type="flex" monospaced="true" arrangement="true">
          <Col span={5}>
            <FormItem label="订单状态">
              {getFieldDecorator("status")(
                <Select
                  placeholder="请选择"
                  style={{ width: "100%" }}
                >
                  <Option value="all">全部</Option>
                  <Option value="2">状态1</Option>
                  <Option value="3">状态2</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem label="时间类型">
              {getFieldDecorator("timeType")(
                <Select placeholder="请选择" style={{ width: "100%" }}>
                  <Option value="0">上车时间</Option>
                  <Option value="1">下单时间</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem label="时间段">
              {getFieldDecorator("date", {
                rules: [
                  {
                    message: formatMessage({ id: "validation.date.required" })
                  }
                ]
              })(
                <RangePicker
                  showTime={{ format: "HH:mm" }}
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
            <FormItem label="输入查找">
              {getFieldDecorator("keyword")(
                <Input placeholder="姓名/手机号/订单ID" />
              )}
            </FormItem>
          </Col>
          <Col>
            <Button
              onClick={() => {
                this.handleReset;
              }}
            >
              重置
            </Button>
          </Col>
          <Col>
            <Button type="primary" onClick={() => this.handleSearch}>
              查询
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { loading, data = [] } = this.props;
    const { selectedRows = [], modalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible
    };

    return (
      <PageHeaderWrap title="预约管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleModalVisible(true)}
              >
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={() => this.handleMultiplePush}>
                    批量推送
                  </Button>
                </span>
              )}
              <Button type="primary" onClick={() => this.handleExport}>
                导出查询
              </Button>
            </div>
            <div className={styles.tableWrapper}>
              <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                tableStyle={{ minWidth: "1200px", overflow: scroll }}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </div>
        </Card>
        <NewOrder {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrap>
    );
  }
}
