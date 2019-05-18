import React, { Component } from "react";
import PropTypes from "prop-types";
import { Input, Icon, Modal, Button } from "antd";
import { Map, Marker } from "react-amap";

const Search = Input.Search;

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

export default class LocationInput extends Component {
  static getDerivedStateFromProps(nextProps) {
    if ("value" in nextProps) {
      return {
        ...(nextProps.value || {})
      };
    }
    return null;
  }
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
      position: value.location,
      address: value.address,
      mapCenter: value.location,
      mapPosition: value.location,
      mapAddress: value.address,
      keywords: ''
    };
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag
    });
  };

  triggerChange = value => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(value);
    }
  };
  okHandle = () => {
    this.setState({
      address: this.state.mapAddress,
      position: this.state.mapPosition
    });
    this.triggerChange({
      address: this.state.mapAddress,
      location: this.state.mapPosition
    });
    this.handleModalVisible();
  };

  mapEvens = {
    created: map => {
      window.AMap.plugin(
        ["AMap.Geocoder", "AMap.PlaceSearch", "AMap.Autocomplete"],
        () => {
          this.geoCode = new AMap.Geocoder({
            city: "010" //城市, 默认全国
          });
          this.placeSearch = new AMap.PlaceSearch({
            pageSize: 5,
            pageIndex: 1,
            city: "010"
          });
          this.autoComplete = new AMap.Autocomplete({
            city: "010",
            input: "search-input"
          });
        }
      );
    },
    click: e => {
      const lnglat = e.lnglat;
      this.setState({
        mapPosition: {
          longitude: lnglat.getLng(),
          latitude: lnglat.getLat()
        },
        mapAddress: "正在加载..."
      });
      this.getAddress(lnglat);
    }
  };

  getAddress = lnglat => {
    this.geoCode &&
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

  onKeywordChange = e => {
    this.setState({
      keywords: e.target.value
    });
  };
  handleSearch = wtfValue => {
    const value = window.document.getElementById("search-input").value;
    this.setState({
      keywords: value
    });
    if (value && value.trim()) {
      this.placeSearch.search(value.trim(), (status, result) => {
        if (status === "complete" && result.poiList.count) {
          const location = result.poiList.pois[0].location;
          const lct = {
            longitude: location.lng,
            latitude: location.lat
          };
          this.getAddress(location);
          this.setState({
            mapPosition: lct
          });
        }
      });
    }
  };

  render() {
    const { modalVisible, address, mapPosition, mapAddress } = this.state;
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
          centered
          title="地址定位"
          visible={modalVisible}
          onOk={() => {
            this.okHandle();
          }}
          onCancel={() => {
            this.handleModalVisible();
          }}
        >
          <Search
            id="search-input"
            enterButton
            value={this.state.keywords}
            onChange={this.onKeywordChange}
            onSearch={this.handleSearch}
          />
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
              <Marker position={mapPosition} />
            </Map>
          </div>
        </Modal>
      </div>
    );
  }
}
