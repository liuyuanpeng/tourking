import React from "react";
import { connect } from "dva";
import { Form, Button, Icon, message } from "antd";
import RouteInput from "./RouteInput";
import styles from "./style.less";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 1 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 }
  }
};

let id = 1;

@connect(({ formStepForm }) => ({
  data: formStepForm.step,
  mode: formStepForm.mode
}))
@Form.create()
class Step2 extends React.PureComponent {
  constructor(props) {
    super(props);
    const { data } = props;
    const keysValue =
      data.roads && data.roads.length > 0
        ? data.roads.filter(item => item).map((item, index) => index)
        : [0];
    id = keysValue.length;
  }

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  checkRoad = (rule, value, callback) => {
    if (
      value &&
      value.name &&
      value.day_road &&
      value.start_time &&
      value.play_time
    ) {
      callback();
    } else {
      callback("请填写行程的各个必填项!");
    }
  };

  render() {
    const { form, data, dispatch, mode } = this.props;
    const { getFieldDecorator, validateFields, getFieldValue } = form;
    const readonly = mode === "readonly";
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 }
      }
    };
    const keysValue =
      data.roads && data.roads.length > 0
        ? data.roads.filter(item => item).map((item, index) => index)
        : [0];
    getFieldDecorator("keys", { initialValue: keysValue });
    const keys = getFieldValue("keys");

    const onPrev = () => {
      if (dispatch) {
        dispatch({
          type: "formStepForm/saveCurrentStep",
          payload: "basic_info"
        });
      }
    };
    const onValidateForm = e => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!values || values.keys.length === 0) {
          message.error("请添加行程信息!");
          return;
        }
        const roads = values.roads.filter(road=>road)
        if (!err) {
          dispatch({
            type: "formStepForm/saveStepFormData",
            payload: {
              roads
            }
          });
          dispatch({
            type: "formStepForm/saveCurrentStep",
            payload: "others"
          });
        }
      });
    };

    const formItems = keys ? keys.map((k, index) => {
      const itemValue =
        data.roads && data.roads.length > index ? data.roads[index] : {};
      return (
        <Form.Item
          id={`form_item_${index}`}
          {...formItemLayoutWithOutLabel}
          label={`行程${index + 1}`}
          required={false}
          key={k}
        >
          {getFieldDecorator(`roads[${k}]`, {
            initialValue: itemValue || {},
            validateTrigger: ["onChange", "onBlur"],
            rules: [
              {
                required: true,
                message: "请填写行程内的各项内容"
              },
              {
                validator: this.checkRoad
              }
            ]
          })(<RouteInput readonly={readonly} />)}
          {keys.length > 1 && !readonly ? (
            <Icon
              className={styles.dynamicDeleteButton}
              type="minus-circle-o"
              onClick={() => this.remove(k)}
            />
          ) : null}
        </Form.Item>
      );
    }) : null;

    return (
      <Form className={styles.stepForm}>
        {formItems}
        {readonly ? null : (
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add} style={{ width: "60%" }}>
              <Icon type="plus" />
              新增行程
            </Button>
          </Form.Item>
        )}
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
            下一步
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Step2;
