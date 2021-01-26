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
  message,
  Icon,
  Upload
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import NumberInput from "@/components/NumberInput";
import { connect } from "dva";
import styles from "../index.less";
import moment from "moment";

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("只能上传jpeg或者png格式的图片!");
  }
  const isLt1M = file.size / 1024 / 1024 < 1;
  if (!isLt1M) {
    message.error("图片大小不要超过1M!");
  }
  return isJpgOrPng && isLt1M;
}

const NewCharted = Form.create()(props => {
  const {
    modalVisible,
    formValues,
    form,
    handleAdd,
    handleModalVisible,
    type,
    handleEdit,
    changeState,
    imageLoading
  } = props;

  const okHandle = () => {
    if (type === "readonly") return handleModalVisible();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!formValues.images) {
        message.error("请上传图片！");
        return;
      }
      form.resetFields();
      if (type === "add") {
        handleAdd({
          ...fieldsValue,
          images: formValues.images
        });
      } else if (type === "edit") {
        handleEdit({
          ...fieldsValue,
          images: formValues.images
        });
      }
    });
  };

  const labelLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 15 }
  };

  const readonly = type === "readonly";

  const handleChange = info => {
    if (info.file.status === "uploading") {
      changeState({ imageLoading: true });
      return;
    }
    if (info.file.status === "done") {
      changeState({
        formValues: {
          ...formValues,
          images: info.file.response.data.path
        },
        imageLoading: false
      });
    }
  };

  const uploadButton = (
    <div>
      <Icon type={imageLoading ? "loading" : "plus"} />
      <div className="ant-upload-text">上传</div>
    </div>
  );

  return (
    <Modal
      destroyOnClose
      width={window.MODAL_WIDTH}
      title={
        type === "add" ? "新增大图" : type === "readonly" ? "详情" : "编辑"
      }
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        handleModalVisible();
      }}
    >
      <Form>
        <FormItem
          {...labelLayout}
          label="图片"
          extra="大图推荐长宽比2:1，避免拉伸失真!"
        >
          {readonly ? 
          <img src={formValues.images} style={{width: "254px", height: '127px'}}/>:
          <Upload
            name="file"
            listType="picture-card"
            className={styles.avatarUploader}
            showUploadList={false}
            action="/server/file/local/qiniu_upload?file_type=IMAGE_FILE"
            headers={{
              token: localStorage.getItem("token")
            }}
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {formValues.images ? (
              <img src={formValues.images} style={{ width: "100%" }} />
            ) : (
              uploadButton
            )}
          </Upload>}
        </FormItem>
        <FormItem {...labelLayout} label="包车ID">
          {readonly ? (
            <span>{formValues.link}</span>
          ) : (
            form.getFieldDecorator("link", {
              initialValue: formValues.link || ""
            })(<Input style={{ width: "100%" }} placeholder="请输入包车ID" />)
          )}
        </FormItem>
      </Form>
    </Modal>
  );
});

@connect(({ covers, loading }) => ({
  loading: loading.effects["car/fetchCovers"],
  data: covers.list
}))
@Form.create()
export default class CoversManager extends PureComponent {
  static propTypes = {};

  state = {
    modalVisible: false,
    formValues: {},
    type: "add",
    imageLoading: false,
  };

  changeState = newState => {
    this.setState({
      ...newState
    });
  };

  componentDidMount() {
    this.props.dispatch({
      type: "covers/fetchCovers",
      payload: {
        onFailure: msg => {
          message.error(msg || "获取首页大图列表失败");
        }
      }
    });
  }

  handleModalVisible = (flag, type) => {
    this.setState({
      modalVisible: !!flag
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: "covers/saveCover",
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

  columns = [
    {
      title: "图片",
      dataIndex: "images",
      key: "images",
      render: text =>
        text ? (
          <img
            src={text}
            style={{
              width: "200px",
              height: "100px"
            }}
          />
        ) : null
    },
    {
      title: "包车ID",
      dataIndex: "link",
      key: "link"
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
    dispatch({
      type: "covers/saveCover",
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
    this.handleModalVisible();
  };

  onAdd = e => {
    e.preventDefault();
    this.setState({
      formValues:{},
      modalVisible: true,
      type: 'add'
    })
  }

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
      type: "covers/deleteCover",
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

  render() {
    const { loading, data } = this.props;

    const {
      modalVisible,
      type,
      formValues,
      imageLoading,
    } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      type: type || "add",
      handleEdit: this.handleEdit,
      formValues,
      imageLoading,
      changeState: this.changeState
    };
    return (
      <PageHeaderWrap title="首页大图">
        <Card>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <div className={styles.tableListOperator}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={this.onAdd}
                >
                  新增大图
                </Button>
              </div>
              <Table
                rowKey={record => record.id}
                loading={loading}
                dataSource={data}
                pagination={false}
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
