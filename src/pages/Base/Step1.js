import React, { Fragment } from "react";
import { connect } from "dva";
import { Form, Input, Button, Select, DatePicker } from "antd";
import ImageInput from "@/components/ImageInput";
import NumberInput from "@/components/NumberInput";
import moment from "moment";
import styles from "./style.less";

const { Option } = Select;

const { RangePicker } = DatePicker;

const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 19
  }
};
const dateFormat = "YYYY-MM-DD";
@connect(({ formStepForm }) => ({
  data: formStepForm.step,
  mode: formStepForm.mode
}))
@Form.create()
class Step1 extends React.PureComponent {
  render() {
    const { form, dispatch, data, mode } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const readonly = mode === "readonly";
    const onValidateForm = () => {
      if (readonly) {
        dispatch({
          type: "formStepForm/saveCurrentStep",
          payload: "travel_route"
        });
        return;
      }
      validateFields((err, values) => {
        if (!err) {
          const { timeRange, ...others } = values;
          dispatch({
            type: "formStepForm/saveStepFormData",
            payload: {
              ...others,
              start_time: timeRange[0] ? moment(timeRange[0])
                .startOf("day")
                .valueOf() : undefined,
              end_time: timeRange[1] ? moment(timeRange[1])
                .endOf("day")
                .valueOf(): undefined,
              weight: others.weight ? parseInt(others.weight, 10): 0
            }
          });
          dispatch({
            type: "formStepForm/saveCurrentStep",
            payload: "travel_route"
          });
        }
      });
    };
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm}>
          <Form.Item {...formItemLayout} label="包车类型">
            {readonly ? (
              <span>
                {data.scene === "DAY_PRIVATE" ? "按天包车" : "线路包车"}
              </span>
            ) : (
              getFieldDecorator("scene", {
                initialValue: data.scene || "",
                rules: [{ required: true, message: "请选择包车类型" }]
              })(
                <Select placeholder="请选择包车类型">
                  <Option value="DAY_PRIVATE">按天包车</Option>
                  <Option value="ROAD_PRIVATE">线路包车</Option>
                </Select>
              )
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="线路名称">
            {readonly ? (
              <span>{data.name}</span>
            ) : (
              getFieldDecorator("name", {
                initialValue: data.name || "",
                rules: [{ required: true, message: "请输入线路名称" }]
              })(<Input placeholder="请输入线路名称" />)
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="线路标签">
            {readonly ? (
              <span>{data.tag}</span>
            ) : (
              getFieldDecorator("tag", {
                initialValue: data.tag || ""
              })(<Input placeholder={`多个标签用","隔开`} />)
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="开放时间段">
            {readonly ? (
              <span>
                {`${moment(data.start_time).format(dateFormat)}~
              ${moment(data.end_time).format(dateFormat)}}`}
              </span>
            ) : (
              getFieldDecorator("timeRange", {
                rules: [{required: true, message: "请选择开放时间段"}],
                initialValue:
                  data.start_time && data.end_time
                    ? [moment(data.start_time), moment(data.end_time)]
                    : ""
              })(<RangePicker format={dateFormat} />)
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="预约时间">
            {readonly ? (
              <span>{data.show_days}天内</span>
            ) : (
              getFieldDecorator("show_days", {
                initialValue: data.show_days || "",
                rules:[
                  {required: true, message: '请输入预约时间'}
                ]
              })(
                <NumberInput
                  numberType="integer"
                  addonAfter="天内"
                  style={{ textAlight: "right" }}
                />
              )
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="权重">
            {readonly ? (
              <span>{data.weight}</span>
            ) : (
              getFieldDecorator("weight", {
                initialValue: data.weight || "",
                rules: [
                  {required: true, message: '请输入权重'}
                ]
              })(<NumberInput numberType="integer" />)
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="推荐理由">
            {readonly ? (
              <span>{data.reason}</span>
            ) : (
              getFieldDecorator("reason", {
                initialValue: data.reason || ""
              })(<TextArea />)
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="线路图片">
            {getFieldDecorator("images", {
              initialValue: data.images || ''
            })(<ImageInput readonly={readonly} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="价格">
            {readonly ? (
              <span>{data.price}</span>
            ) : (
              getFieldDecorator("price", {
                initialValue: data.price || "",
                rules:[
                  {required: true, message: '请输入价格'}
                ]
              })(
                <NumberInput addonAfter="元" style={{ textAlight: "right" }} />
              )
            )}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span
              }
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm}>
              下一步
            </Button>
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

export default Step1;
