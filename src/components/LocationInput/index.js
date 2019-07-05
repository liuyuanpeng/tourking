import React, { Component } from "react";
import { Input, Icon, Modal, Select, message, Col, Row } from "antd";
import { Map, Marker } from "react-amap";
import { connect } from "dva";

const { Search } = Input;
const InputGroup = Input.Group;
const {Option} = Select;

// 定义地图中心点(厦门火车站)
const CENTER = {
  longitude: 118.116217,
  latitude: 24.467527
};

const AMAP_KEY = "40f23cf8d5e782d1905f8a4ffcdd4e3b";

// 自定义定位图标
const LOCATION_ICON = () => (
  <svg width="1.5em" height="1.5em" viewBox="0 0 512 512">
    <path
      d="M256 0c-88.366 0-160 71.634-160 160 0 160 160 352 160 352s160-192 160-352c0-88.366-71.635-160-160-160zM256 256c-53.020 0-96-42.98-96-96s42.98-96 96-96 96 42.98 96 96-42.98 96-96 96z"
      fill="#000000"
    />
  </svg>
);

@connect(({ address }) => ({
  addresses: address.list
}))

export default class LocationInput extends Component {
  static getDerivedStateFromProps(nextProps) {
    if ("value" in nextProps) {
      return {
        ...(nextProps.value || {})
      };
    }
    return null;
  }

  mapEvens = {
    created: () => {
      window.AMap.plugin(
        [
          "AMap.Geocoder",
          "AMap.PlaceSearch",
          "AMap.Autocomplete",
          "AMap.Driving"
        ],
        () => {
          this.geoCode = new window.AMap.Geocoder({
            city: "010" // 城市, 默认全国
          });
          this.placeSearch = new window.AMap.PlaceSearch({
            pageSize: 5,
            pageIndex: 1,
            city: "010"
          });
          this.autoComplete = new window.AMap.Autocomplete({
            city: "010",
            input: "search-input"
          });

          this.driving = new window.AMap.Driving({
            policy: window.AMap.DrivingPolicy.LEAST_TIME
          });
        }
      );
    },
    click: e => {
      const { lnglat } = e;
      this.setState({
        mapPosition: {
          longitude: lnglat.getLng(),
          latitude: lnglat.getLat()
        },
        markPosition: {
          longitude: lnglat.getLng(),
          latitude: lnglat.getLat()
        },
        mapAddress: "正在加载..."
      });
      this.getAddress(lnglat);
    }
  };

  constructor(props) {
    super(props);
    this.map = null;
    this.marker = null;
    this.geoCode = null;
    const value = props.value || {
      location: CENTER,
      address: ""
    };
    this.state = {
      modalVisible: false,
      address: value.address,
      mapPosition: value.location,
      mapAddress: value.address,
      keywords: "",
      markPosition: { longitude: 0, latitude: 0 },
      tmpAddress: undefined
    };
  }

  componentDidMount () {
    const {dispatch} = this.props;
    dispatch({
      type: "address/fetchAddressPage",
      payload: {
        page: 0,
        size: 50,
        onFailure: msg => {
          message.error(msg || "获取常用地址列表失败");
        }
      }
    });
  }

  triggerChange = value => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  okHandle = () => {
    const { mapAddress, mapPosition } = this.state;
    this.setState({
      address: mapAddress
    });
    this.triggerChange({
      address: mapAddress,
      location: mapPosition
    });
    const { origin, destination } = this.props;
    if (origin) {
      const mapOrigin = new window.AMap.LngLat(
        origin.longitude,
        origin.latitude
      );
      const mapDestination = new window.AMap.LngLat(
        mapPosition.longitude,
        mapPosition.latitude
      );
      this.driving.search(mapOrigin, mapDestination, (status, result) => {
        if (status === "complete") {
          if (result.routes.length) {
            const route = result.routes[0];
            this.triggerChange({
              address: mapAddress,
              location: mapPosition,
              time: route.time,
              distance: route.distance
            });
          }
        }
      });
    }
    if (destination) {
      const mapOrigin = new window.AMap.LngLat(
        mapPosition.longitude,
        mapPosition.latitude
      );
      const mapDestination = new window.AMap.LngLat(
        destination.longitude,
        destination.latitude
      );
      this.driving.search(mapOrigin, mapDestination, (status, result) => {
        if (status === "complete") {
          if (result.routes.length) {
            const route = result.routes[0];
            this.triggerChange({
              address: mapAddress,
              location: mapPosition,
              time: route.time,
              distance: route.distance
            });
          }
        }
      });
    }
    this.handleModalVisible();
  };

  getAddress = lnglat => {
    if (!this.geoCode) return;
    this.geoCode.getAddress(lnglat, (status, result) => {
      if (status === "complete") {
        if (result.regeocode) {
          this.setState({
            mapAddress: result.regeocode.formattedAddress || "未知地点"
          });
        } else {
          this.setState({
            mapAddress: "未知地点"
          });
        }
      } else {
        this.setState({
          mapAddress: "未知地点"
        });
      }
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag
    });
  };

  onKeywordChange = e => {
    this.setState({
      keywords: e.target.value
    });
  };

  handleSearch = () => {
    const { value } = window.document.getElementById("search-input");
    this.setState({
      keywords: value
    });
    if (value && value.trim()) {
      this.placeSearch.search(value.trim(), (status, result) => {
        if (status === "complete" && result.poiList.count) {
          const { location } = result.poiList.pois[0];
          const lct = {
            longitude: location.lng,
            latitude: location.lat
          };
          this.getAddress(location);
          this.setState({
            mapPosition: lct,
            markPosition: lct
          });
        }
      });
    }
  };

  onAddressChange = addressId => {

    const {addresses} = this.props;
    const address = addresses.find(item=>item.id === addressId)
    address && this.setState({
      tmpAddress: address.id,
      mapPosition: {
        longitude: address.longitude,
        latitude: address.latitude
      },
      markPosition: {
        longitude: address.longitude,
        latitude: address.latitude
      },
      mapAddress: address.name
    });
  }

  render() {
    const {
      modalVisible,
      address,
      mapPosition,
      mapAddress,
      markPosition,
      keywords,
      tmpAddress
    } = this.state;

    const {addresses} = this.props;

    return (
      <div>
        <Input
          readOnly
          value={address}
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
          width={window.innerWidth}
          destroyOnClose
          style={{ top: "0px" }}
          title="地址定位"
          visible={modalVisible}
          onOk={() => {
            this.okHandle();
          }}
          onCancel={() => {
            this.handleModalVisible();
          }}
        >
          <InputGroup compact>
            <Row style={{width: '100%'}}>
              <Col span={19}>
            <Search
              id="search-input"
              enterButton
              value={keywords}
              onChange={this.onKeywordChange}
              onSearch={this.handleSearch}
            />
              </Col>
              <Col span={5}>
            <Select value={tmpAddress} style={{ width: "100%" }} placeholder="常用地址" onChange={this.onAddressChange}>
              {addresses && addresses.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
            </Select>
              </Col>
            </Row>
            
          </InputGroup>

          <span>{`当前位置: ${mapAddress}`}</span>
          <div
            style={{
              width: `${window.innerWidth - 50}px`,
              height: `${window.innerHeight - 220}px`
            }}
          >
            <Map
              amapkey={AMAP_KEY}
              zoom={13}
              center={mapPosition}
              events={this.mapEvens}
            >
              <Marker position={markPosition} />
            </Map>
          </div>
        </Modal>
      </div>
    );
  }
}
