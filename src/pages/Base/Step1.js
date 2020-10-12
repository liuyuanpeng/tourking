import React, { Fragment } from "react";
import { connect } from "dva";
import { Form, Input, Button, Select, DatePicker, message } from "antd";
import ImageInput from "@/components/ImageInput";
import NumberInput from "@/components/NumberInput";
import LocationInput from "@/components/LocationInput";
import { router } from "umi";
import moment from "moment";
import styles from "./style.less";
import SCENE from "../../constants/scene";

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
@connect(({ formStepForm, city }) => ({
  data: formStepForm.step,
  mode: formStepForm.mode,
  type: formStepForm.type,
  city: city.list
}))
@Form.create()
class Step1 extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "city/fetchCityList"
    });
  }

  onSubmit = () => {
    const { dispatch, type } = this.props;
    const isScenicFood = type === "scenicfood";
    const isSouvenir = type === "souvenir";
    const isChartered = type === "chartered";
    dispatch({
      type: "formStepForm/submitStepForm",
      payload: {
        onSuccess: () => {
          isScenicFood && router.push("scenicfoodmanager");
          isSouvenir && router.push("souvenirmanager");
          isChartered && router.push("charteredmanager");
        },
        onFailure: msg => {
          message.error(msg || "操作失败!");
        }
      }
    });
  };

  render() {
    const { form, dispatch, data, mode, type, city } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const readonly = mode === "readonly";

    const isScenicFood = type === "scenicfood";
    const isSouvenir = type === "souvenir";
    const isChartered = type === "chartered";

    const onValidateForm = () => {
      if (!isChartered) {
        if (readonly) {
          isScenicFood && router.push("scenicfoodmanager");
          isSouvenir && router.push("souvenirmanager");
          return;
        }
        validateFields((err, values) => {
          if (!err) {
            const { address, ...others } = values;
            const payload = { ...others };
            if (address) {
              payload.target_place = address.address;
              payload.target_latitude = address.location.latitude;
              payload.target_longitude = address.location.longitude;
            }

            dispatch({
              type: "formStepForm/saveStepFormData",
              payload
            });
            this.onSubmit();
          }
        });
        return;
      }
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
              start_time: timeRange[0]
                ? moment(timeRange[0])
                    .startOf("day")
                    .valueOf()
                : undefined,
              end_time: timeRange[1]
                ? moment(timeRange[1])
                    .endOf("day")
                    .valueOf()
                : undefined,
              weight: others.weight ? parseInt(others.weight, 10) : 0
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
          {isChartered ? (
            <Form.Item {...formItemLayout} label="类型">
              {readonly ? (
                <span>{SCENE[data.scene]}</span>
              ) : (
                getFieldDecorator("scene", {
                  initialValue: "ROAD_PRIVATE",
                  rules: [{ required: true, message: "请选择线路类型" }]
                })(
                  <Select placeholder="请选择线路类型" disabled>
                    <Option value="ROAD_PRIVATE">{SCENE.ROAD_PRIVATE}</Option>
                  </Select>
                )
              )}
            </Form.Item>
          ) : (
            <Form.Item {...formItemLayout} label="类型" visible={false}>
              {readonly ? (
                <span>{SCENE[data.scene]}</span>
              ) : (
                getFieldDecorator("scene", {
                  initialValue: isSouvenir ? "BANSHOU_PRIVATE" : (data.scene || ''),
                  rules: [{ required: true, message: "请选择类型" }]
                })(
                  <Select placeholder="请选择类型" disabled={isSouvenir}>
                    {!isSouvenir && (
                      <Option value="JINGDIAN_PRIVATE">
                        {SCENE.JINGDIAN_PRIVATE}
                      </Option>
                    )}
                    {!isSouvenir && (
                      <Option value="MEISHI_PRIVATE">
                        {SCENE.MEISHI_PRIVATE}
                      </Option>
                    )}
                    {isSouvenir && (
                      <Option value="BANSHOU_PRIVATE">
                        {SCENE.BANSHOU_PRIVATE}
                      </Option>
                    )}
                  </Select>
                )
              )}
            </Form.Item>
          )}
          <Form.Item {...formItemLayout} label="所属城市">
            {readonly ? (
              <span>
                {data.city_id
                  ? city.find(item => item.id === data.city_id).name
                  : ""}
              </span>
            ) : (
              form.getFieldDecorator("city_id", {
                rules: [{ required: true, message: "请选择城市" }],
                initialValue: data.city_id || ""
              })(
                <Select style={{ width: "100%" }}>
                  {city.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )
            )}
          </Form.Item>

          <Form.Item {...formItemLayout} label="名称">
            {readonly ? (
              <span>{data.name}</span>
            ) : (
              getFieldDecorator("name", {
                initialValue: data.name || "",
                rules: [{ required: true, message: "请输入名称" }]
              })(<Input placeholder="请输入名称" />)
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="标签">
            {readonly ? (
              <span>{data.tag}</span>
            ) : (
              getFieldDecorator("tag", {
                initialValue: data.tag || ""
              })(<Input placeholder={`多个标签用","隔开(英文半角的",")`} />)
            )}
          </Form.Item>
          {isScenicFood && (
            <Form.Item {...formItemLayout} label="地图标注">
              {readonly ? (
                <span>{data.target_place}</span>
              ) : (
                getFieldDecorator("address", {
                  initialValue: data.id
                    ? {
                        address: data.target_place,
                        location: {
                          longitude: data.target_longitude,
                          latitude: data.target_latitude
                        }
                      }
                    : "",
                  rules: [
                    {
                      required: true,
                      message: "请选择地图标注"
                    }
                  ]
                })(<LocationInput />)
              )}
            </Form.Item>
          )}
          {isChartered && (
            <Form.Item {...formItemLayout} label="开放时间段">
              {readonly ? (
                <span>
                  {`${moment(data.start_time).format(dateFormat)}~
              ${moment(data.end_time).format(dateFormat)}}`}
                </span>
              ) : (
                getFieldDecorator("timeRange", {
                  rules: [{ required: true, message: "请选择开放时间段" }],
                  initialValue:
                    data.start_time && data.end_time
                      ? [moment(data.start_time), moment(data.end_time)]
                      : ""
                })(<RangePicker format={dateFormat} />)
              )}
            </Form.Item>
          )}
          {isChartered && (
            <Form.Item {...formItemLayout} label="预约时间">
              {readonly ? (
                <span>{data.show_days}天内</span>
              ) : (
                getFieldDecorator("show_days", {
                  initialValue: data.show_days || "",
                  rules: [{ required: true, message: "请输入预约时间" }]
                })(
                  <NumberInput
                    numberType="integer"
                    addonAfter="天内"
                    style={{ textAlight: "right" }}
                  />
                )
              )}
            </Form.Item>
          )}
          <Form.Item {...formItemLayout} label="权重">
            {readonly ? (
              <span>{data.weight}</span>
            ) : (
              getFieldDecorator("weight", {
                initialValue: data.weight || "",
                rules: [{ required: true, message: "请输入权重" }]
              })(<NumberInput numberType="integer" />)
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="推荐理由">
            {readonly ? (
              <span>{data.reason}</span>
            ) : (
              getFieldDecorator("reason", {
                initialValue: data.reason || "",
                rules: [{ required: true, message: "请输入推荐理由" }]
              })(<TextArea />)
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="介绍">
            {readonly ? (
              <span>{data.description || ''}</span>
            ) : (
              getFieldDecorator("description", {
                initialValue: data.description || "",
                rules: [{ required: true, message: "请输入介绍" }]
              })(<TextArea />)
            )}
          </Form.Item>
          
          <Form.Item {...formItemLayout} label="图片">
            {getFieldDecorator("images", {
              initialValue: data.images || ""
            })(<ImageInput readonly={readonly} />)}
          </Form.Item>
          {!isScenicFood && (
            <Form.Item {...formItemLayout} label="价格">
              {readonly ? (
                <span>{data.price}</span>
              ) : (
                getFieldDecorator("price", {
                  initialValue: data.price || "",
                  rules: [{ required: true, message: "请输入价格" }]
                })(
                  <NumberInput
                    addonAfter="元"
                    style={{ textAlight: "right" }}
                  />
                )
              )}
            </Form.Item>
          )}
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
              {isChartered ? "下一步" : readonly ? "返回" : "提交"}
            </Button>
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

export default Step1;
