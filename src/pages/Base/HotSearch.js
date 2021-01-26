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

const NewHotSearch = Form.create()(props => {
  const {
    modalVisible,
    formValues,
    form,
    handleAdd,
    handleModalVisible,
    type,
    handleEdit,
    city
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
      <FormItem {...labelLayout} label="热门搜索">
        {readonly ? (
          <span>{formValues.name}</span>
        ) : (
          form.getFieldDecorator("name", {
            initialValue: formValues.name || "",
            rules: [{ required: true, message: "请输入搜索词" }]
          })(<Input style={{ width: "100%" }} />)
        )}
      </FormItem>
      <FormItem {...labelLayout} label="城市">
        {readonly ? (
          <span>
            {city.find(item => item.id === city_id)
              ? city.find(item => item.id === city_id).name
              : ""}
          </span>
        ) : (
          form.getFieldDecorator("city_id", {
            initialValue: formValues.city_id || "",
            rules: [{ required: true, message: "请选择城市" }]
          })(
            <Select style={{ width: "100%" }}>
              {city &&
                city.map(item => {
                  return (
                    <Option key={`${item.id}`} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
            </Select>
          )
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({ city, hotsearch, loading }) => ({
  loading: loading.effects["hotsearch/fetchHotSearchPage"],
  data: hotsearch.list,
  page: hotsearch.page,
  total: hotsearch.total,
  city: city.list
}))
@Form.create()
export default class HotSearch extends PureComponent {
  static propTypes = {};

  state = {
    modalVisible: false,
    formValues: {
    },
    type: "add",
    city_id: ''
  };

  componentDidMount() {
    this.props.dispatch({
      type: "city/fetchCityList",
      payload: {
        onSuccess: city => {
          if (city && city.length) {
            const city_id = city[0].id
            this.setState({
              city_id
            })
            this.city_id = city_id
            this.props.dispatch({
              type: "hotsearch/fetchHotSearchPage",
              payload: {
                city_id,
                page: 0,
                size: 10,
                onFailure: msg => {
                  message.error(msg || "获取热搜列表失败,请先配置城市列表");
                }
              }
            });
          } else {
            message.error("获取城市列表失败");
          }
        },
        onFailure: msg => {
          message.error(msg || "获取城市列表失败");
        }
      }
    });
    
  }

  handleModalVisible = (flag, type) => {
    this.setState({
      modalVisible: !!flag,
      type: type || "add",
      formValues: {
      }
    });
  };

  handleAdd = fields => {
    const {dispatch} = this.props
    dispatch({
      type: "hotsearch/saveHotSearch",
      payload: {
        data: fields,
        city_id: this.city_id,
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

  columns = [
    {
      title: "热门搜索",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "司机",
      dataIndex: "city_id",
      key: "city_id",
      render: text => {
        const {city} = this.props
        const curCity = city.find(item=>item.id === text)
        return curCity.name || ''
      }
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
            title="确定删除该热门搜索吗?"
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
    dispatch({
      type: "hotsearch/saveHotSearch",
      payload: {
        data: {
          ...formValues,
          ...info
        },
        city_id: this.city_id,
        onSuccess: () => {
          message.success("操作成功");
        },
        onFailure: msg => {
          message.error(msg || "操作失败");
        }
      }
    });
    this.setState({
      formValues: {
      },
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

  onReadOnly = record => {
    this.setState({
      formValues: { ...record },
      modalVisible: true,
      type: "readonly"
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: "hotsearch/deleteHotSearch",
      payload: {
        data: record.id,
        city_id: this.city_id,
        onSuccess: () => {
          message.success("删除成功");
        },
        onFailure: msg => {
          message.error(msg || "删除失败");
        }
      }
    });
  };

  handleSearch = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.city_id = values.city_id
        dispatch({
          type: "hotsearch/fetchHotSearchPage",
          payload: {
            page: 0,
            size: 10,
            ...values,
            onFailure: msg => {
              message.error(msg || "获取热搜列表失败");
            }
          }
        });
      }
    });
  };

  renderForm = () => {
    const {
      form: { getFieldDecorator },
      city
    } = this.props;

    const {city_id} = this.state

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16} type="flex" monospaced="true" arrangement="true">
          <Col span={9}>
            <FormItem label="城市">
              {getFieldDecorator("city_id", {
            initialValue: city_id || "",
            rules: [{ required: true, message: "请选择城市" }]
          })(
            <Select style={{ width: "100%" }}>
              {city &&
                city.map(item => {
                  return (
                    <Option key={`${item.id}`} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
            </Select>
          )}
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
      type: "hotsearch/fetchHotSearchPage",
      payload: {
        page,
        size,
        city_id: this.city_id,
        onFailure: msg => {
          message.error(msg || "获取车辆列表失败");
        }
      }
    });
  };

  render() {
    const { loading, data, city, page, total } = this.props;

    const { modalVisible, type, formValues } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      type: type || "add",
      handleEdit: this.handleEdit,
      formValues,
      city
    };
    return (
      <PageHeaderWrap title="热门搜索管理">
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
                  新增热搜
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
                  onChange: (page, pageSize) => {
                    this.handlePageChange(page - 1, pageSize);
                  }
                }}
                columns={this.columns}
              />
            </div>
          </div>
        </Card>
        <NewHotSearch {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrap>
    );
  }
}
