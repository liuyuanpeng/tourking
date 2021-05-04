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
import ImageInput from "../../components/ImageInput";
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

const NewCarType = Form.create()(props => {
  const {
    modalVisible,
    formValues,
    form,
    handleAdd,
    handleModalVisible,
    type,
    handleEdit,
    imageLoading,
    changeState
  } = props;

  const okHandle = () => {
    if (type === "readonly") {
      handleModalVisible();
      return;
    }
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!formValues.cover_image) {
        message.error("请上传封面图片！");
        return;
      }
      form.resetFields();
      if (type === "add") {
        handleAdd({ ...fieldsValue, cover_image: formValues.cover_image });
      } else {
        handleEdit({ ...fieldsValue, cover_image: formValues.cover_image });
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
      const cover_image =
        process.env.NODE_ENV === "development"
          ? info.file.response.data.path.replace("www", "tms")
          : info.file.response.data.path;
      changeState({
        formValues: {
          ...formValues,
          cover_image
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
      title={type === "add" ? "新增" : type === "readonly" ? "详情" : "编辑"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        handleModalVisible();
      }}
    >
      <FormItem {...labelLayout} label="车辆分类">
        {readonly ? (
          <span>{formValues.name}</span>
        ) : (
          form.getFieldDecorator("name", {
            initialValue: formValues.name || "",
            rules: [{ required: true, message: "请输入车辆分类名称" }]
          })(<Input style={{ width: "100%" }} />)
        )}
      </FormItem>
      <FormItem {...labelLayout} label="分类描述">
        {readonly ? (
          <span>{formValues.description}</span>
        ) : (
          form.getFieldDecorator("description", {
            initialValue: formValues.description || ""
          })(<Input style={{ width: "100%" }} />)
        )}
      </FormItem>
      <FormItem
        {...labelLayout}
        label="封面图片"
        extra="大图推荐长宽比约200:130，避免拉伸失真!"
      >
        {readonly ? (
          <img
            src={formValues.cover_image}
            style={{ width: "200px", height: "230px" }}
          />
        ) : (
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
            {formValues.cover_image ? (
              <img src={formValues.cover_image} style={{ width: "100%" }} />
            ) : (
              uploadButton
            )}
          </Upload>
        )}
      </FormItem>

      <FormItem {...labelLayout} label="乘客说明">
        {readonly ? (
          <span>{formValues.passengers}</span>
        ) : (
          form.getFieldDecorator("passengers", {
            initialValue: formValues.passengers || "",
            rules: [{ required: true, message: "请输入乘客说明" }]
          })(<Input style={{ width: "100%" }} />)
        )}
      </FormItem>
      <FormItem {...labelLayout} label="行李说明">
        {readonly ? (
          <span>{formValues.baggages}</span>
        ) : (
          form.getFieldDecorator("baggages", {
            initialValue: formValues.baggages || "",
            rules: [{ required: true, message: "请输入行李说明" }]
          })(<Input style={{ width: "100%" }} />)
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({ car_type, loading }) => ({
  loading: loading.effects["car_type/fetchCarTypes"],
  data: car_type.list
}))
@Form.create()
export default class CarType extends PureComponent {
  static propTypes = {};

  state = {
    modalVisible: false,
    formValues: {},
    type: "add",
    imageLoading: false
  };

  changeState = newState => {
    this.setState({
      ...newState
    });
  };

  componentDidMount() {
    this.props.dispatch({
      type: "car_type/fetchCarTypes",
      payload: {
        onFailure: msg => {
          message.error(msg || "获取车辆分类列表失败");
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
      type: "car_type/saveCarType",
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
      title: "车辆分类",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "封面图片",
      dataIndex: "cover_image",
      key: "cover_image",
      render: text =>
        text ? (
          <img
            src={text}
            style={{
              width: "200px",
              height: "130px"
            }}
          />
        ) : null
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description"
    },
    {
      title: "乘客说明",
      dataIndex: "passengers",
      key: "passengers"
    },
    {
      title: "行李说明",
      dataIndex: "baggages",
      key: "baggages"
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
          {/* <Divider type="vertical" />
          <Popconfirm
            title="确定删除该车辆分类吗?"
            onConfirm={() => {
              this.handleDelete(record);
            }}
            okText="是"
            cancelText="否"
          >
            <a href="javascript:;">删除</a>
          </Popconfirm> */}
        </span>
      )
    }
  ];

  handleEdit = info => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: "car_type/saveCarType",
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
      type: "car_type/deleteCarType",
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

    const { modalVisible, type, formValues, imageLoading } = this.state;

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
      <PageHeaderWrap title="车辆分类配置">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <div className={styles.tableListOperator}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleModalVisible(true)}
                >
                  新增车辆分类
                </Button>
              </div>
              <Table
                rowKey={record => record.id}
                loading={loading}
                dataSource={data}
                columns={this.columns}
              />
            </div>
          </div>
        </Card>
        <NewCarType {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrap>
    );
  }
}
