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

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

const NewCharted = Form.create()(props => {
  const {
    modalVisible,
    formValues,
    form,
    handleAdd,
    handleModalVisible,
    type,
    handleEdit,
  } = props;

  const okHandle = () => {
    if (type === "readonly") return handleModalVisible();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (type === "add") {
        handleAdd(fieldsValue);
      } else if (type === "edit") {
        handleEdit(fieldsValue);
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
</Modal>
  );
});

@connect(({ loading }) => ({
  loading: loading.effects["car/fetchCarPage"],
  data: [],
  page: 0,
  total: 0
}))
@Form.create()
export default class Charted extends PureComponent {
  static propTypes = {};

  state = {
    modalVisible: false,
    formValues: {},
    type: "add"
  };

  componentDidMount() {
  }

  handleModalVisible = (flag, type) => {
    this.setState({
      modalVisible: !!flag
    });
  };

  handleAdd = fields => {
    const { dispatch, car_types, drivers } = this.props;
    // dispatch({
    //   type: "car/saveCar",
    //   payload: {
    //     data: fields,
    //     onSuccess: () => {
    //       message.success("新增成功!");
    //     },
    //     onFailure: msg => {
    //       message.error(msg || "新增失败!");
    //     }
    //   }
    // });
    this.handleModalVisible();
  };

  columns = [
    {
      title: "车牌号",
      dataIndex: "car.car_no",
      key: "car.car_no"
    },
    {
      title: "司机",
      dataIndex: "user.name",
      key: "user.name"
    },
    {
      title: "车辆类型",
      dataIndex: "travel_config.name",
      key: "travel_config.name"
    },
    {
      title: "颜色",
      dataIndex: "car.color",
      key: "car.color"
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => (
        <span className={styles.actionColumn}>
          <a
            href="javascript:;"
            onClick={() => {
              this.onReadOnly(record);
            }}
          >
            查看
          </a>
          <Divider type="vertical" />
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
            title="确定删除该车辆吗?"
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

  handleEdit = info => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    // dispatch({
    //   type: "car/saveCar",
    //   payload: {
    //     data: {
    //       ...formValues.car,
    //       ...info
    //     },
    //     onSuccess: () => {
    //       message.success("操作成功");
    //     },
    //     onFailure: msg => {
    //       message.error(msg || "操作失败");
    //     }
    //   }
    // });
    this.handleModalVisible();
  };

  onEdit = record => {
    this.setState({
      formValues: { ...record },
      modalVisible: true,
      type: "edit"
    });
  };

  onReadOnly = record => {
    this.setState({
      formValues: { ...record },
      modalVisible: true,
      type: "readonly"
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    // dispatch({
    //   type: "car/deleteCar",
    //   payload: {
    //     data: record.car.id,
    //     onSuccess: () => {
    //       message.success("删除成功");
    //     },
    //     onFailure: msg => {
    //       message.error(msg || "删除失败");
    //     }
    //   }
    // });
  };

  handleSearch = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.searchKey = values.car_no || "";
        // dispatch({
        //   type: "car/fetchCarPage",
        //   payload: {
        //     page: 0,
        //     size: 10,
        //     car_no: this.searchKey || "",
        //     onFailure: msg => {
        //       message.error(msg || "获取车辆列表失败");
        //     }
        //   }
        // });
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
              {getFieldDecorator("car_no")(<Input placeholder="车牌号" />)}
            </FormItem>
          </Col>
          <Col span={5}>
            <Button onClick={this.handleSearch}>查询</Button>
          </Col>
        </Row>
      </Form>
    );
  };

  handlePageChange = (page, size) => {
    this.props.dispatch({
      type: "car/fetchCarPage",
      payload: {
        page,
        size,
        car_no: this.searchKey || "",
        onFailure: msg => {
          message.error(msg || "获取车辆列表失败");
        }
      }
    });
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
      <PageHeaderWrap title="包车管理">
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
                  新增线路
                </Button>
              </div>
              <Table
                rowKey={record => record.car.id}
                loading={loading}
                dataSource={data}
                pagination={{
                  pageSize: 10,
                  current: page + 1,
                  total: total * 10,
                  onChange: (page, pageSize) => {
                    this.handlePageChange(page - 1, pageSize);
                  }
                }}
                columns={this.columns}
              />
            </div>
          </div>
        </Card>
        <NewCharted {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrap>
    );
  }
}
