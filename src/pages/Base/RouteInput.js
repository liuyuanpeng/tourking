import React, { Component } from "react";
import { Input, Form, TimePicker } from "antd";
import ImageInput from "@/components/ImageInput";
import NumberInput from "@/components/NumberInput";
import moment from "moment";

const { TextArea } = Input;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 19
  }
};

@Form.create()
class RouteInput extends Component {
  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.value !== state.value) {
      return {
        value: nextProps.value
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      name: value.name || "",
      day_road: value.day_road || "",
      images: value.images || "",
      play_time: value.play_time || "",
      start_time: value.start_time || ""
    };
  }

  triggerChange = newValue => {
    const { onChange, value } = this.props;
    if (onChange) {
      onChange({
        ...value,
        ...newValue
      });
    }
  };

  onChangeRouteName = e => {
    e.preventDefault();
    this.setState({
      name: e.target.value
    });
    this.triggerChange({
      name: e.target.value
    });
  };

  onChangeRouteDesc = e => {
    e.preventDefault();
    this.setState({
      day_road: e.target.value
    });
    this.triggerChange({
      day_road: e.target.value
    });
  };

  onChangeRouteImages = value => {
    this.setState({
      images: value
    });
    this.triggerChange({
      images: value
    });
  };

  onChangeRouteTime = value => {
    this.setState({
      play_time: value
    });
    this.triggerChange({
      play_time: value
    });
  };

  onChangeStartTime = value => {
    if (value instanceof moment) {
      this.setState({
        start_time: value.valueOf()
      });
      this.triggerChange({
        start_time: value.valueOf()
      });
    }
  };

  render() {
    const { name, day_road, images, play_time, start_time } = this.state;

    const { form, readonly } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div
        className="clearfix"
        style={{
          border: "1px solid lightgray",
          padding: "20px",
          width: "94%",
          verticalAlign: "top",
          display: "inline-block"
        }}
      >
        <FormItem {...formItemLayout} label="行程名称">
          {readonly ? (
            <span>{name}</span>
          ) : (
            getFieldDecorator("name", {
              initialValue: name,
              rules: [{ required: true, message: "请输入行程名称" }]
            })(
              <Input
                onChange={this.onChangeRouteName}
                placeholder="请输入行程名称"
              />
            )
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="当日行程">
          {readonly ? (
            <span>{day_road}</span>
          ) : (
            getFieldDecorator("day_road", {
              initialValue: day_road,
              rules: [{ required: true, message: "请编辑行程内容" }]
            })(
              <TextArea
                onChange={this.onChangeRouteDesc}
                placeholder="请编辑行程内容"
              />
            )
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="行程图片">
          {getFieldDecorator("images", {
            initialValue: images
          })(
            <ImageInput
              readonly={readonly}
              onChange={this.onChangeRouteImages}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="开始时间">
          {readonly ? (
            <span>{start_time ? moment(start_time).format("HH:mm") : ""}</span>
          ) : (
            getFieldDecorator("start_time", {
              initialValue: start_time ? moment(start_time) : undefined,
              rules: [{ required: true, message: "请输入开始时间" }]
            })(<TimePicker format="HH:mm" onChange={this.onChangeStartTime} />)
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="游玩时间">
          {readonly ? (
            <span>{play_time}小时</span>
          ) : (
            getFieldDecorator("play_time", {
              initialValue: play_time,
              rules: [{ required: true, message: "请输入游玩时间" }]
            })(
              <NumberInput
                addonAfter="小时"
                onChange={this.onChangeRouteTime}
                placeholder="请输入游玩时间"
              />
            )
          )}
        </FormItem>
      </div>
    );
  }
}

export default RouteInput;
