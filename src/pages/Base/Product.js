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
  Tooltip
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import NumberInput from "@/components/NumberInput";
import { connect } from "dva";
import styles from "../index.less";
import moment from "moment";
import SCENE from '../../constants/scene'

const Option = Select.Option;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;

@connect(({ product, comments, loading }) => ({
  loading: loading.effects["product/fetchProductEvaluatePage"],
  data: product.evaluate,
  page: product.evaluatePage,
  total: product.evaluateTotal
}))
@Form.create()
export default class Product extends PureComponent {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.searchKeys = {};
  }

  componentDidMount() {
    this.searchParams = null;
    this.props.dispatch({
      type: "product/fetchProductEvaluatePage",
      payload: {
        page: 0,
        size: 10,
        onFailure: msg => {
          message.error(msg || "获取产品评价列表失败");
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
      title: "订单ID",
      dataIndex: "order.id",
      key: "order.id"
    },
    {
      title: "订单类型",
      dataIndex: "order.scene",
      key: "order.scene",
      render: text => (SCENE[text])
    },
    {
      title: "评分",
      dataIndex: "evaluate",
      key: "evaluate"
    },
    {
      title: "评价内容",
      dataIndex: "content",
      key: "content",
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: "图片",
      dataIndex: "image",
      key: "image",
      width: 200,
      render: text =>
        text ? (
          <img
            src={text}
            style={{
              width: "200px",
              height: "100px"
            }}
          />
        ) : (
          ""
        )
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      render: (text, record) =>
        record.status === 0 ? (
          <span className={styles.actionColumn}>
            <Popconfirm
              title="确认审核通过?"
              onConfirm={() => {
                this.handleApproval(record.id, 1);
              }}
              okText="是"
              cancelText="否"
            >
              <a href="javascript:;">审核通过</a>
            </Popconfirm>
            <Divider />
            <Popconfirm
              title="确认审核不通过?"
              onConfirm={() => {
                this.handleApproval(record.id, 2);
              }}
              okText="是"
              cancelText="否"
            >
              <a href="javascript:;">审核不通过</a>
            </Popconfirm>
          </span>
        ) : (
          ""
        )
    }
  ];

  handleApproval(id, status) {
    const { dispatch, page, size } = this.props;
    dispatch({
      type: "product/changeEvaluateState",
      payload: {
        id,
        status,
        page,
        size
      }
    });
  }

  handlePageChange = (page, size) => {
    this.props.dispatch({
      type: "product/fetchProductEvaluatePage",
      payload: {
        ...this.searchKeys,
        page,
        size,
        onFailure: msg => {
          message.error(msg || "获取产品评价列表失败");
        }
      }
    });
  };

  render() {
    const { loading, data, page, total } = this.props;

    return (
      <PageHeaderWrap title="产品评价">
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
                scroll={{ x: 1000 }}
              />
            </div>
          </div>
        </Card>
      </PageHeaderWrap>
    );
  }
}
