import React, { PureComponent } from "react";
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
  Col,
  message,
  Divider,
  Tooltip,
  Popconfirm
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import { formatMessage } from "umi-plugin-react/locale";
import { connect } from "dva";
import LocationInput from "@/components/LocationInput";
import moment from "moment";
import NumberInput from "@/components/NumberInput";
import styles from "../index.less";

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

const INIT_SCENE = "BANSHOU_PRIVATE";

const NewOrder = Form.create()(props => {
  const {
    type,
    handleEdit,
    modalVisible,
    form,
    handleModalVisible,
    formValues
  } = props;

  const labelLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  };

  const readonly = type === "readonly";

  const okHandle = () => {
    if (readonly) {
      handleModalVisible();
      return;
    }
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleEdit(fieldsValue);
    });
  };

  const isCompony = formValues && formValues.fapiao_type;

  return (
    <Modal
      destroyOnClose
      width={window.MODAL_WIDTH}
      title={type === "edit" ? "编辑" : "详情"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        handleModalVisible();
      }}
    >
      <Row>
        <Col>
          <FormItem {...labelLayout} label="用户ID">
            <span>{formValues.user_id}</span>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="总金额">
            <span>{formValues.price || 0}</span>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="收件人">
            <span>{formValues.express_name || ""}</span>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="邮寄地址">
            <span>{formValues.express_address || ""}</span>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="邮寄电话">
            <span>{formValues.express_mobile || ""}</span>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="快递单号">
            <span>{formValues.express_number || ""}</span>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="用户名">
            <span>{formValues.user_name || ""}</span>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="发票类型">
            <span>{isCompony ? "企业" : "个人/非企业"}</span>
          </FormItem>
        </Col>
        <Col>
          <FormItem
            {...labelLayout}
            label={isCompony ? "公司名称" : "抬头名称"}
          >
            <span>{formValues.fapiao_name || ""}</span>
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="税务登记证号">
            <span>{formValues.fapiao_num || ""}</span>
          </FormItem>
        </Col>
        {isCompony && (
          <Col>
            <FormItem {...labelLayout} label="注册场所地址">
              <span>{formValues.fapiao_address || ""}</span>
            </FormItem>
          </Col>
        )}
        {isCompony && (
          <Col>
            <FormItem {...labelLayout} label="注册场所电话">
              <span>{formValues.fapiao_telphone || ""}</span>
            </FormItem>
          </Col>
        )}
        {isCompony && (
          <Col>
            <FormItem {...labelLayout} label="开户银行">
              <span>{formValues.fapiao_bank || ""}</span>
            </FormItem>
          </Col>
        )}
        {isCompony && (
          <Col>
            <FormItem {...labelLayout} label="基本开户账号">
              <span>{formValues.fapiao_card || ""}</span>
            </FormItem>
          </Col>
        )}
      </Row>
    </Modal>
  );
});

const ExpressSetting = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleModalVisible,
    formValues,
    handleExpress
  } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleExpress({ ...formValues, ...fieldsValue });
    });
  };

  const labelLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 15 }
  };

  return (
    <Modal
      destroyOnClose
      width={window.MODAL_WIDTH}
      title="快递单号设置"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        handleModalVisible();
      }}
    >
      <Form>
        <FormItem {...labelLayout} label="快递单号">
          {form.getFieldDecorator("express_number", {
            initialValue: formValues.express_number || "",
            rules: [{ required: true, message: "请输入快递单号" }]
          })(<Input style={{ width: "100%" }} />)}
        </FormItem>
      </Form>
    </Modal>
  );
});

@connect(({ bill, loading }) => ({
  loading: loading.effects["bill/fetchBillPage"],
  data: bill.list,
  page: bill.page,
  total: bill.total
}))
@Form.create()
class BillManager extends PureComponent {
  static propTypes = {};

  state = {
    modalVisible: false,
    expressVisible: false,
    formValues: {},
    type: "readonly"
  };

  columns = [
    {
      title: "用户ID",
      dataIndex: "user_id",
      key: "user_id"
    },
    {
      title: "总金额",
      dataIndex: "price",
      key: "price"
    },
    {
      title: "邮寄地址",
      dataIndex: "express_address",
      key: "express_address",
      render: text => (
        <Tooltip title={text}>
          <div
            style={{
              width: "200px",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {text}
          </div>
        </Tooltip>
      )
    },
    {
      title: "提价时间",
      dataIndex: "create_time",
      key: "create_time",
      render: text => (text ? moment(text).format("YYYY-MM-DD HH:mm") : "")
    },
    {
      title: "抬头名称",
      dataIndex: "fapiao_name",
      key: "fapiao_name"
    },
    {
      title: "税务证号",
      dataIndex: "fapiao_num",
      key: "fapiao_num"
    },
    {
      title: "收件人",
      dataIndex: "express_name",
      key: "express_name"
    },
    {
      title: "快递单号",
      dataIndex: "express_number",
      key: "express_number"
    },
    {
      title: "操作",
      fixed: "right",
      key: "aciton",
      width: 150,
      render: (text, record) => {
        const noExpress = !record.express_number
        return (
          <span className={styles.actionColumn}>
            <a href="javascript:;" onClick={() => this.onReadonly(record)}>
              查看
            </a>
            { noExpress && (
              <Divider type="vertical" />
            )}
            { noExpress && (
              <Popconfirm
                title="确认现在邮寄？"
                onConfirm={() => {
                  this.handleDispatch(record);
                }}
                okText="是"
                cancelText="否"
              >
                <a href="javascript:;">邮寄发票</a>
              </Popconfirm>
            )}
          </span>
        );
      }
    }
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "bill/fetchBillPage",
      payload: {
        page: 0,
        size: 10
      },
      fail: msg => {
        message.error(msg || "获取发票列表失败");
      }
    });
  }

  onReadonly = record => {
    this.setState({
      formValues: { ...record },
      modalVisible: true,
      type: "readonly"
    });
  };

  onEdit = record => {
    this.setState({
      formValues: { ...record },
      modalVisible: true,
      type: "edit"
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag
    });
  };

  handleExpressVisible = flag => {
    this.setState({
      expressVisible: !!flag
    });
  };

  handleExport = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      this.searchKeys = { ...values };
      Object.keys(this.searchKeys).forEach(key => {
        if (!this.searchKeys[key]) {
          delete this.searchKeys[key];
        }
      });

      if (!this.searchKeys.scene) {
        this.searchKeys.scene = INIT_SCENE;
      }
      if (this.searchKeys.time_range) {
        delete this.searchKeys.time_range;
        this.searchKeys = {
          ...this.searchKeys,
          start: values.time_range[0].startOf("day").valueOf(),
          end: values.time_range[1].endOf("day").valueOf()
        };
      }
      const fileName = "订单列表.xls";
      dispatch({
        type: "order/exportOrder",
        payload: {
          ...this.searchKeys
        },
        callback: response => {
          if (response.type.indexOf("application/json") !== -1) {
            message.error(response.message || "导出失败");
            return;
          }
          const blob = new Blob([response], { type: "Files" });
          const aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = URL.createObjectURL(blob);
          aLink.download = fileName;
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
        }
      });
    });
  };

  handleRefresh = () => {
    const { dispatch, page } = this.props;
    dispatch({
      type: "bill/fetchBillPage",
      payload: {
        page,
        size: 10
      },
      fail: msg => {
        message.error(msg || "获取发票列表失败!");
      }
    });
  };

  handlePageChange = (page, size) => {
    const { dispatch } = this.props;
    dispatch({
      type: "bill/fetchBillPage",
      payload: {
        page,
        size
      },
      fail: msg => {
        message.error(msg || "获取发票列表失败");
      }
    });
  };

  handleDispatch = record => {
    this.setState({
      formValues: { ...record },
      expressVisible: true
    });
  };

  handleExpress = record => {
    const { dispatch, page } = this.props;
    const { id, express_number } = record;
    dispatch({
      type: "bill/setExpressNumber",
      payload: {
        bill_id: id,
        express_number,
        page,
        size: 10
      },
      success: () => {
        message.info("操作成功");
      },
      fail: msg => {
        message.info(msg || "操作失败");
      }
    });

    this.setState({
      formValues: {},
      expressVisible: false
    });
  };

  render() {
    const {
      loading,
      data,
      page,
      total
    } = this.props;
    const {
      modalVisible,
      expressVisible,
      formValues,
      type
    } = this.state;

    const parentMethods = {
      type,
      formValues,
      handleModalVisible: this.handleModalVisible,
      handleEdit: this.handleEdit,
      updateFormValue: this.updateFormValue
    };

    const expressMethods = {
      formValues,
      handleModalVisible: this.handleExpressVisible,
      handleExpress: this.handleExpress
    };

    return (
      <PageHeaderWrap title="发票管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator}>
              <Button icon="reload" type="primary" onClick={this.handleRefresh}>
                刷新
              </Button>
              {/* <Button icon="export" type="primary" onClick={this.handleExport}>
                导出查询
              </Button> */}
            </div>
            <div className={styles.tableWrapper}>
              <Table
                rowKey={record => record.id}
                loading={loading}
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
                scroll={{ x: 1200 }}
              />
            </div>
          </div>
        </Card>
        <NewOrder {...parentMethods} modalVisible={modalVisible} />
        <ExpressSetting {...expressMethods} modalVisible={expressVisible} />
      </PageHeaderWrap>
    );
  }
}
export default BillManager;
