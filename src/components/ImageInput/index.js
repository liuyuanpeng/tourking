import React, { Component } from "react";
import { Upload, Icon, Modal } from "antd";

import styles from "./style.less";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class ImageInput extends Component {
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
    const value = props.value || "";
    let list;
    try {
      list = value.split(",");
      list = list.filter(item => item);
    } catch (error) {
      list = null;
    }
    this.state = {
      previewVisible: false,
      previewImage: "",
      fileList:
        list && list.length > 0
          ? list.map((item, index) => {
              return {
                uid: `-${index}`,
                url: item
              };
            })
          : []
    };
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true
    });
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
    if (fileList) {
      const uploadedFileList = fileList.filter(item=>(item.response && item.response.data))
      this.triggerChange(
        uploadedFileList ? uploadedFileList.map(item => item.response.data.path) : []
      );
    }
  };

  triggerChange = value => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value ? value.toString() : "");
    }
  };

  render() {
    const { MAX = 999, readonly } = this.props;
    const { previewVisible, previewImage, fileList } = this.state;
    const removeProps = readonly ? {onRemove: () => {return false}} : {}
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/server/file/local/upload?file_type=IMAGE_FILE"
          listType="picture-card"
          fileList={fileList}
          headers={{
            token: localStorage.getItem("token")
          }}
          className={styles.imageInput}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          disabled={readonly}
          {...removeProps}
        >
          {readonly || fileList.length >= MAX ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default ImageInput;
