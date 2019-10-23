import React, { Fragment } from "react";
import { connect } from "dva";
import { Button, Input, Form, message } from "antd";
import { router } from "umi";
import styles from "./style.less";

const { TextArea } = Input;

@connect(({ formStepForm }) => ({
  data: formStepForm.step,
  mode: formStepForm.mode
}))
@Form.create()
class Step3 extends React.PureComponent {
  onSubmit = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'formStepForm/submitStepForm',
      payload: {
        onSuccess: () => {
          router.push('charteredmanager');
        },
        onFailure: msg => {
          message.error(msg || '操作失败!')
        }
      }
    })
  };

  render() {
    const { data, dispatch, form, mode } = this.props;
    const readonly = mode === 'readonly'

    const formItemLayout = {
      labelCol: {
        span: 5
      },
      wrapperCol: {
        span: 19
      }
    };

    const { getFieldDecorator, validateFields} = form;

    const onPrev = () => {
      if (dispatch) {
        dispatch({
          type: "formStepForm/saveCurrentStep",
          payload: "travel_route"
        });
      }
    };

    const onValidateForm = () => {
      if (readonly) {
        router.push('charteredmanager');
        return;
      }
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: "formStepForm/saveStepFormData",
            payload: values
          });
          this.onSubmit();
        }
      });
    };
    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <Form.Item {...formItemLayout} label="成团承诺">
          {
            readonly ? (<span>{data.promise}</span>):
            getFieldDecorator("promise", {
            initialValue: data.promise || ''
          })(<TextArea />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="费用包含">
          {
            readonly ?
            (<span>{data.price_include}</span>):
            getFieldDecorator("price_include", {
            initialValue: data.price_include || ''
          })(<TextArea />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="费用不含">
          {readonly ?
            (<span>{data.price_exclude}</span>):getFieldDecorator("price_exclude", {
            initialValue: data.price_exclude || ''
          })(<TextArea />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="预订须知">
          {readonly ?
            (<span>{data.advance_notice}</span>):getFieldDecorator("advance_notice", {
            initialValue: data.advance_notice || ""
          })(<TextArea />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="退订规则">
          {readonly ?
            (<span>{data.refund_rule}</span>):getFieldDecorator("refund_rule", {
            initialValue: data.refund_rule || ""
          })(<TextArea />)}
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 8 }}
          wrapperCol={{
            xs: { span: 20, offset: 0 },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span
            }
          }}
          label=""
        >
          <Button onClick={onPrev} style={{ marginLeft: 8 }}>
            上一步
          </Button>
          <Button
            onClick={onValidateForm}
            type="primary"
            style={{ marginLeft: 8 }}
          >
            {readonly ? '确定' : '提交'}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Step3;
