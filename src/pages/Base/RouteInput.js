import React, { Component } from "react";
import { Input, TimePicker } from "antd";
import ImageInput from "@/components/ImageInput";
import NumberInput from "@/components/NumberInput";
import moment from "moment";
import classnames from "classnames";
import styles from "./RouteInput.less";

const { TextArea } = Input;

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

    const {readonly } = this.props;

    const requiredClassName = classnames(styles.label, {
      [styles.label_required]: true
    });

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
        <span className={requiredClassName}>行程名称</span>
        <span className={styles.form_content}>
          {readonly ? (
            name
          ) : (
            <Input
              onChange={this.onChangeRouteName}
              placeholder="请输入行程名称"
              value={name}
            />
          )}
        </span>
        <span className={requiredClassName}>当日行程</span>
        <span className={styles.form_content}>
          {readonly ? (
            day_road
          ) : (
            <TextArea
              value={day_road}
              onChange={this.onChangeRouteDesc}
              placeholder="请编辑行程内容"
            />
          )}
        </span>

        <span className={requiredClassName}>行程图片</span>
        <ImageInput
          className={styles.form_content}
          value={images}
          readonly={readonly}
          onChange={this.onChangeRouteImages}
        />
        <span className={requiredClassName}>开始时间</span>
        <span className={styles.form_content}>
          {readonly ? (
            <span>{start_time ? moment(start_time).format("HH:mm") : ""}</span>
          ) : (
            <TimePicker
              value={start_time ? moment(start_time) : undefined}
              format="HH:mm"
              onChange={this.onChangeStartTime}
            />
          )}
        </span>
        <span className={requiredClassName}>游玩时间</span>
        <span className={styles.form_content}>
          {readonly ? (
            <span>{play_time}小时</span>
          ) : (
            <NumberInput
              value={play_time}
              addonAfter="小时"
              onChange={this.onChangeRouteTime}
              placeholder="请输入游玩时间"
            />
          )}
        </span>
      </div>
    );
  }
}

export default RouteInput;
