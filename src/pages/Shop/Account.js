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
  Modal
} from "antd";
import PageHeaderWrap from "@/components/PageHeaderWrapper";
import { connect } from "dva";
import styles from "./Account.less";

const FormItem = Form.Item;

const NewAccount = Form.create()(props => {
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
      title="新增账号"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        handleModalVisible();
      }}
    >
      <Row>
        <Col>
          <FormItem {...labelLayout} label="手机号">
            {form.getFieldDecorator("phone", {
              rules: [
                { required: true, message: "请输入手机号" },
                { len:11, message: '请输入正确的手机号'}
              ]
            })(
              <InputNumber style={{ width: "100%" }} />
            )}
          </FormItem>
        </Col>
        <Col>
          <FormItem {...labelLayout} label="登录密码">
          {form.getFieldDecorator("password", {
              rules: [
                { required: true, message: "请输入登录密码" },
                { min:6, message: '请输入大于6个字符的密码'},
                { max:20, message: '密码长度不能超过20个字符'}
              ]
            })(
              <Input style={{ width: "100%" }} />
            )}
          </FormItem>
          <FormItem {...labelLayout} label="员工姓名">
          {form.getFieldDecorator("name", {
              rules: [
                { required: true, message: "请输入员工姓名" }
              ]
            })(
              <Input style={{ width: "100%" }} />
            )}
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
});

export default class Account extends PureComponent {
  static propTypes = {
  };

  state = {
    modalVisible: false,
    formValues: {}
  }

  handleSearch = () => {

  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag
    });
  };

  handleAdd = fields => {
    console.log("handleAdd: ", fields);
    this.handleModalVisible();
  };

  renderForm = () => {
    const {
      form: {getFieldDecorator}
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout='inline'>
      <Row gutter={16} type="flex" monospaced arrangement>
      <Col span={5}>
      <FormItem label="精确查找">
      {
        getFieldDecorator('key')(
          <Input placeholder="用户名/手机号"/>
        )
      }
      </FormItem>
      </Col>
      <Col span={5}>
      <Button onClick={()=>{this.handleSearch}}>查询</Button>
      </Col>
      </Row>
      </Form>
    )
  }

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin'
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="javascript:;">编辑</a>
          <Divider type="vertical"/>
          <a href="javascript:;">删除</a>
        </span>
      )
    }
  ]

  render() {
    const {loading} = this.props;

    const data = [
      {
        name: 'test name',
        phone: '12132321312312',
        createTime: '2019-01-01',
        lastLogin: '2019-01-01'
      }]
    const {modalVisible} = this.state
    
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible
    }
    return(
      <PageHeaderWrap title="账号管理">
      <Card bordered={false}>
      <div className={styleMedia.tableList}>
      <div className={styles.tableListForm}>
      <div className={styles.tableListOperator}>
      <Button icon='plus' type='primary' onClick={()=>this.handleModalVisible(true)}>新增账号</Button>
      </div>
      <Table
      loading={loading}
      dataSource={data}
      columns={this.columns}
      />
      </div>
      </div>
      </Card>
      <NewAccount {...parentMethods} modalVisible={modalVisible}/>
      </PageHeaderWrap>
    )
  }
}
