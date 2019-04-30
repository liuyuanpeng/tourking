import React, { Component } from "react";
import PropTypes from "prop-types";
import { Input, Icon, Modal } from "antd";
import { Map, Marker } from "react-amap";

// 定义地图中心点(厦门火车站)
const CENTER = {
  longitude: 118.116295,
  latitude: 24.467455
};

// 自定义定位图标
const LOCATION_ICON = () => (
  <svg width="1.5em" height="1.5em" viewBox="0 0 512 512">
    <path
      d="M256 0c-88.366 0-160 71.634-160 160 0 160 160 352 160 352s160-192 160-352c0-88.366-71.635-160-160-160zM256 256c-53.020 0-96-42.98-96-96s42.98-96 96-96 96 42.98 96 96-42.98 96-96 96z"
      fill="#000000"
    />
  </svg>
);

export default class LocationInput extends Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.marker = null;
    this.geoCode = null;
  }
  state = {
    modalVisible: false,
    position: CENTER,
    currentPosition: ""
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag
    });
  };

  okHandle = () => {
    this.handleModalVisible();
  };

  mapEvens = {
    created: map => {
      window.AMap.plugin("AMap.Geocoder", () => {
        this.geoCode = new AMap.Geocoder({
          city: "010" //城市, 默认全国
        });
      });
    },
    click: e => {
      const lnglat = e.lnglat;
      this.setState({
        position: lnglat,
        currentPosition: "正在加载..."
      });
      this.getAddress(lnglat);
    }
  };

  getAddress = lnglat => {
    this.geoCode &&
      this.geoCode.getAddress(lnglat, (status, result) => {
        if (status === "complete") {
          if (result.regeocode) {
            console.log(result.regeocode.formattedAddress);
            this.setState({
              currentPosition: result.regeocode.formattedAddress || "未知地点"
            });
          } else {
            this.setState({
              currentPosition: "未知地点"
            });
          }
        } else {
          this.setState({
            currentPosition: "未知地点"
          });
        }
      });
  };

  render() {
    const { modalVisible, position, currentPosition } = this.state;
    return (
      <div>
        <Input
          disabled
          value={currentPosition}
          addonAfter={
            <Icon
              component={LOCATION_ICON}
              onClick={() => {
                this.handleModalVisible(true);
              }}
            />
          }
        />
        <Modal
          width={550}
          destroyOnClose
          title="地址定位"
          visible={modalVisible}
          onOk={() => {
            this.okHandle();
          }}
          onCancel={() => {
            this.handleModalVisible();
          }}
        >
          <div style={{ width: "500px", height: "400px" }}>
            <Map center={CENTER} events={this.mapEvens}>
              <Marker position={position} />
            </Map>
          </div>
        </Modal>
      </div>
    );
  }
}
