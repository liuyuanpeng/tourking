import React, { PureComponent } from "react";
import {
  Card,
  Form,
  Row,
  Col,
  Button,
  Select,
  Input,
  Table,
  Divider,
  Modal,
  Popconfirm,
  message,
  Spin,
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import NumberInput from "@/components/NumberInput";
import { connect } from "dva";
import moment from "moment";
import styles from "../index.less";

@connect(({ visitusers, loading, user }) => ({
  loading: loading.effects["visitusers/fetchVisitUsers"],
  data: visitusers.list,
  totalPages: visitusers.total,
  currentPage: visitusers.page,
  shopId: user.shopId
}))
@Form.create()
class VisitUsers extends PureComponent {

  columns = [
    {
      title: "微信标识",
      dataIndex: "open_id",
      key: "open_id"
    },
    {
      title: "昵称",
      dataIndex: "user_wxname",
      key: "user_wxname"
    },
    {
      title: "头像",
      dataIndex: "user_wxavatar",
      key: "user_wxavatar",
      render: text => (text ? <img style={{width: '60px', height: '60px'}} src={text} /> : null)
    }
  ];

  componentDidMount() {
    const { dispatch, shopId } = this.props;
    console.log(shopId);
    shopId &&
      dispatch({
        type: "visitusers/fetchVisitUsers",
        payload: {
          source_shop_id: shopId,
          page: 0,
          size: 10,
          onFailure: msg => {
            message.error(msg || "获取扫码用户列表失败");
          }
        }
      });
  }

  handlePageChange = (page, size) => {
    const { dispatch, shopId } = this.props;
    shopId &&
      dispatch({
        type: "visitusers/fetchVisitUsers",
        payload: {
          source_shop_id: shopId,
          page,
          size,
          onFailure: msg => {
            message.error(msg || "获取扫码用户列表失败");
          }
        }
      });
  };

  render() {
    const { loading, data, currentPage, totalPages } = this.props;

    return (
      <PageHeaderWrap title="扫码用户">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Table
                rowKey={record => record.open_id}
                loading={loading}
                pagination={{
                  pageSize: 10,
                  current: currentPage + 1,
                  total: 10 * totalPages,
                  onChange: (page, pageSize) => {
                    this.handlePageChange(page - 1, pageSize);
                  }
                }}
                dataSource={data}
                columns={this.columns}
              />
            </div>
          </div>
        </Card>
      </PageHeaderWrap>
    );
  }
}

export default VisitUsers;
