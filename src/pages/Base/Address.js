import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import {
  Tree,
  Card,
  Form,
  Row,
  Col,
  Button,
  Select,
  Input,
  InputNumber,
  Table,
  Divider,
  Modal,
  Popconfirm,
  message
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import NumberInput from "@/components/NumberInput";
import { connect } from "dva";
import styles from "../index.less";
import moment from "moment";
import LocationInput from "@/components/LocationInput";

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

const NewAddress = Form.create()(props => {
  const {
    modalVisible,
    formValues,
    form,
    handleAdd,
    handleModalVisible,
    type,
    handleEdit
  } = props;

  const okHandle = () => {
    if (type === "readonly") handleModalVisible();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const data = {
        name: fieldsValue.name,
        detail: fieldsValue.address.address,
        longitude: fieldsValue.address.location.longitude,
        latitude: fieldsValue.address.location.latitude
      };
      if (type === "add") {
        handleAdd(data);
      } else {
        handleEdit(data);
      }
    });
  };

  const labelLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 15 }
  };

  const readonly = type === "readonly";

  return (
    <Modal
      destroyOnClose
      width={window.MODAL_WIDTH}
      title={type === "add" ? "新增" : type === "readonly" ? "详情" : "编辑"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        handleModalVisible();
      }}
    >
      <FormItem {...labelLayout} label="目的地">
        {readonly ? (
          <span>{formValues.name}</span>
        ) : (
          form.getFieldDecorator("name", {
            initialValue: formValues.name || "",
            rules: [{ required: true, message: "请输入目的地" }]
          })(<Input style={{ width: "100%" }} />)
        )}
      </FormItem>
      <FormItem {...labelLayout} label="详细地址">
        {form.getFieldDecorator("address", {
          initialValue: formValues.id
            ? {
                address: formValues.detail,
                location: {
                  longitude: formValues.longitude,
                  latitude: formValues.latitude
                }
              }
            : "",
          rules: [
            {
              required: true,
              message: "请选择详细地址"
            }
          ]
        })(<LocationInput />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ address, loading }) => ({
  loading: loading.effects["address/fetchAddressPage"],
  data: address.list,
  page: address.page,
  total: address.total
}))
@Form.create()
class Address extends PureComponent {
  static propTypes = {};

  state = {
    modalVisible: false,
    formValues: {},
    type: "add"
  };

  columns = [
    {
      title: "常用地点",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "详细地址",
      dataIndex: "detail",
      key: "detail"
    },
    {
      title: "添加时间",
      dataIndex: "create_time",
      key: "create_time",
      render: text => moment(text).format("YYYY-MM-DD HH:mm")
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => (
        <span className={styles.actionColumn}>
          <a
            href="javascript:;"
            onClick={() => {
              this.onEdit(record);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除该常用地址吗?"
            onConfirm={() => {
              this.handleDelete(record);
            }}
            okText="是"
            cancelText="否"
          >
            <a href="javascript:;">删除</a>
          </Popconfirm>
        </span>
      )
    }
  ];

  componentDidMount() {
    this.props.dispatch({
      type: "address/fetchAddressPage",
      payload: {
        page: 0,
        size: 10,
        onFailure: msg => {
          message.error(msg || "获取常用地址列表失败");
        }
      }
    });
  }

  handleModalVisible = (flag, type) => {
    this.setState({
      modalVisible: !!flag,
      type: type || "add",
      formValues: {}
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: "address/saveAddress",
      payload: {
        data: fields,
        onSuccess: () => {
          message.success("新增成功!");
        },
        onFailure: msg => {
          message.error(msg || "新增失败!");
        }
      }
    });
    this.handleModalVisible();
  };

  handleEdit = info => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: "address/saveAddress",
      payload: {
        data: {
          ...formValues,
          ...info
        },
        onSuccess: () => {
          message.success("操作成功");
        },
        onFailure: msg => {
          message.error(msg || "操作失败");
        }
      }
    });
    this.setState({
      formValues: {},
      modalVisible: false,
      type: "add"
    });
  };

  onEdit = record => {
    this.setState({
      formValues: { ...record },
      modalVisible: true,
      type: "edit"
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: "address/deleteAddress",
      payload: {
        data: record.id,
        onSuccess: () => {
          message.success("删除成功");
        },
        onFailure: msg => {
          message.error(msg || "删除失败");
        }
      }
    });
  };

  handlePageChange = (page, size) => {
    this.props.dispatch({
      type: "address/fetchAddressPage",
      payload: {
        value: this.searchKey || "",
        page,
        size,
        onFailure: msg => {
          message.error(msg || "获取常用地址列表失败");
        }
      }
    });
  };

  handleSearch = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.searchKey = values.value || "";
        values.value
          ? dispatch({
              type: "address/fetchAddressPage",
              payload: {
                value: values.value,
                page: 0,
                size: 10
              }
            })
          : dispatch({
              type: "address/fetchAddressPage",
              payload: {
                page: 0,
                size: 10,
                onFailure: msg => {
                  message.error(msg || "获取常用地址列表失败");
                }
              }
            });
      }
    });
  };

  renderForm = () => {
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16} type="flex" monospaced="true" arrangement="true">
          <Col span={9}>
            <FormItem label="精确查找">
              {getFieldDecorator("value")(<Input placeholder="送签区域" />)}
            </FormItem>
          </Col>
          <Col span={5}>
            <Button onClick={this.handleSearch} type="primary">
              查询
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const { loading, data, page, total } = this.props;

    const { modalVisible, type, formValues } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      type: type || "add",
      handleEdit: this.handleEdit,
      formValues
    };
    return (
      <PageHeaderWrap title="常用地址配置">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListForm}>
              <div className={styles.tableListOperator}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleModalVisible(true)}
                >
                  新增常用地址
                </Button>
              </div>
              <Table
                rowKey={record => record.id}
                loading={loading}
                dataSource={data}
                pagination={{
                  pageSize: 10,
                  current: page + 1,
                  total: total * 10,
                  onChange: (curPage, pageSize) => {
                    this.handlePageChange(curPage - 1, pageSize);
                  }
                }}
                columns={this.columns}
              />
            </div>
          </div>
        </Card>
        <NewAddress {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrap>
    );
  }
}
export default Address;
