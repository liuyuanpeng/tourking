import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
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
  Icon,
  DatePicker,
  message,
  Tooltip,
  Carousel
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import NumberInput from "@/components/NumberInput";
import { connect } from "dva";
import styles from "../index.less";
import moment from "moment";

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

const DISCOVERY_TYPES = {
  JINGDIAN: "景点",
  MEISHI: "美食",
  SHIPIN: "视频",
  GONGLUE: "攻略"
};

const NewComment = Form.create()(props => {
  const { modalVisible, formValues, form, handleModalVisible } = props;

  const okHandle = () => {
    handleModalVisible();
    return;
  };

  const labelLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 15 }
  };

  const images = formValues.images ? formValues.images.split(",") : "";

  return (
    <Modal
      destroyOnClose
      width={window.MODAL_WIDTH}
      title="详情"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        handleModalVisible();
      }}
    >
      <FormItem {...labelLayout} label="用户ID">
        <pre>{formValues.user_id}</pre>
      </FormItem>
      <FormItem {...labelLayout} label="发现类型">
        <span>{DISCOVERY_TYPES[formValues.faxian_category]}</span>
      </FormItem>
      <FormItem {...labelLayout} label="评论内容">
        <pre>{formValues.content}</pre>
      </FormItem>
    </Modal>
  );
});

@connect(({ discovery, loading }) => ({
  loading: loading.effects["discovery/fetchDiscoveryCommentPage"],
  data: discovery.comment,
  page: discovery.commentPage,
  total: discovery.commentTotal
}))
@Form.create()
export default class CommentApprove extends PureComponent {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.searchKeys = {};
  }

  state = {
    formValues: {},
    modalVisible: false
  };

  componentDidMount() {
    this.searchParams = null;
    this.props.dispatch({
      type: "discovery/fetchDiscoveryCommentPage",
      payload: {
        page: 0,
        size: 10,
        onFailure: msg => {
          message.error(msg || "获取评论列表失败");
        }
      }
    });
  }

  columns = [
    {
      title: "用户",
      key: "avatar",
      width: 100,
      render: (text, record) => {
        return (
          <div style={{width: '100px'}}>
            {record.user.avatar ? (
              <img
                src={record.user.avatar}
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "10px",
                  marginRight: "5px"
                }}
              />
            ) : (
              <Icon type="user" style={{
                width: "20px",
                  height: "20px",
                  borderRadius: "10px",
                  marginRight: "5px"
              }} />
            )}
            {record.user.nick_name || record.user.name || record.user.id}
          </div>
        );
      }
    },
    {
      title: "发现类型",
      dataIndex: "faxian_category",
      key: "faxian_category",
      render: text => DISCOVERY_TYPES[text]
    },
    {
      title: "评论内容",
      dataIndex: "content",
      key: "content",
      render: text => (
        <Tooltip title={text}>
          <span className={styles.twoLine} style={{
            width: '200px',
            WebkitBoxOrient: 'vertical'
          }}>{text}</span>
        </Tooltip>
      )
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => (
        <span className={styles.actionColumn}>
          <a href="javascript:;" onClick={this.onReadonly.bind(this, record)}>
            查看详情
          </a>
          {/* <Divider type="vertical" />
          <Popconfirm
            title="确认删除评论?"
            onConfirm={() => {
              this.handleDelete(record.id);
            }}
            okText="是"
            cancelText="否"
          >
            <a href="javascript:;">删除评论</a>
          </Popconfirm> */}
          {!record.valid && <Divider type="vertical" />}
          {!record.valid && (
            <Popconfirm
              title="确认审核通过?"
              onConfirm={() => {
                this.handleApproval(record.id, true);
              }}
              okText="是"
              cancelText="否"
            >
              <a href="javascript:;">审核通过</a>
            </Popconfirm>
          )}
          {record.valid && <Divider type="vertical" />}
          {record.valid && (
            <Popconfirm
              title="确认下架?"
              onConfirm={() => {
                this.handleApproval(record.id, false);
              }}
              okText="是"
              cancelText="否"
            >
              <a href="javascript:;">下架</a>
            </Popconfirm>
          )}
        </span>
      )
    }
  ];

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag
    });
  };

  onReadonly = record => {
    this.setState({
      modalVisible: true,
      formValues: {
        ...record
      }
    });
  };

  handleApproval(id, valid) {
    const { dispatch, page, size } = this.props;
    dispatch({
      type: "discovery/validDiscoveryComment",
      payload: {
        id,
        valid,
        page,
        size
      }
    });
  }

  handleDelete = (id) => {
    const { dispatch, page, size } = this.props;
    dispatch({
      type: "discovery/deleteDiscoveryComment",
      payload: {
        id,
        page,
        size,
        onSuccess: () => {
          message.info("删除成功")
        },
        onFailure: msg => {
          message.error(msg || '删除失败')
        }
      }
    });
  }

  handlePageChange = (page, size) => {
    this.props.dispatch({
      type: "discovery/fetchDiscoveryCommentPage",
      payload: {
        ...this.searchKeys,
        page,
        size,
        onFailure: msg => {
          message.error(msg || "获取评论列表失败");
        }
      }
    });
  };

  render() {
    const { loading, data, page, total } = this.props;

    const { modalVisible, formValues } = this.state;

    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      formValues
    };
    return (
      <PageHeaderWrap title="评论管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
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

        <NewComment {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrap>
    );
  }
}
