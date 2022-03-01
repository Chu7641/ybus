import { HomeTwoTone } from '@ant-design/icons';
import {
    Card, Input, Typography,Tooltip
} from 'antd';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';
import React from 'react';
import Geocode from "react-geocode";
import { NotificationManager } from 'react-notifications';
import PlacesAutocomplete, {
    geocodeByAddress
} from 'react-places-autocomplete';

const AnyReactComponent = ({ text }) => <div>{text}</div>;
Geocode.setApiKey("AIzaSyAX2PANITOz9OwOu1oaj3QGZGQelGywIyA");
Geocode.setLanguage("en");
Geocode.enableDebug();

class CustomPlacesAutoComplete extends React.Component {

    state = {
        open: false,
        address: "",
        position: {
            lat: 0,
            lng: 0
        },
        city_name: "",
        defaultPosition: {
            lat: 21.027763,
            lng: 105.834160
        },
        currentdefaultadressMap: ""
    }
    static getDerivedStateFromProps(props, state) {

        if (state.currentdefaultadressMap.toString() !== props.defaultadressMap.toString()) {
            return {
                currentdefaultadressMap: props.defaultadressMap,

            }
        }
        return null
    }
    componentDidUpdate(prevProps, prevState) {

        if (this.state.currentdefaultadressMap && this.state.currentdefaultadressMap !== prevState.currentdefaultadressMap) {
            Geocode.fromAddress(this.state.currentdefaultadressMap).then(
                response => {
                    const { lat, lng } = response.results[0].geometry.location;

                    this.setState({
                        address: this.state.currentdefaultadressMap,
                        defaultPosition: {
                            lat: lat,
                            lng: lng,
                        },
                    }, () => this.props.onChange(this.state.defaultPosition, this.state.address, this.state.city_name))
                },
                error => {
                    console.error(error);
                }
            );
        }

    }


    async componentDidMount() {
        if (this.state.currentdefaultadressMap) {

            Geocode.fromAddress(this.state.currentdefaultadressMap).then(
                response => {
                    const { lat, lng } = response.results[0].geometry.location;

                    this.setState({
                        address: this.state.currentdefaultadressMap,
                        defaultPosition: {
                            lat: lat,
                            lng: lng,
                        },
                    }, () => this.props.onChange(this.state.defaultPosition, this.state.address, this.state.city_name))
                },
                error => {
                    console.error(error);
                }
            );
        }

        if (this.props.defaultPosition === null) {

            navigator && navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                this.setState({
                    defaultPosition: {
                        lat: latitude,
                        lng: longitude
                    }
                });
            });
        }
        else {
            var address = "";
            await Geocode.fromLatLng(this.props.defaultPosition.lat, this.props.defaultPosition.lng).then(
                response => {

                    address = response.results[0]['formatted_address']
                    //   .forEach(component => {
                    //     if (component.types.indexOf('administrative_area_level_1') > -1) {
                    //       address = component.long_name;
                    //     }
                    //   });
                    console.log(address);

                },
                error => {
                    console.error(error);
                }
            );

            this.setState({
                ...this.state,
                defaultPosition: this.props.defaultPosition,
                position: this.props.defaultPosition,
                address: address
            })
        }
    }

    static propTypes = {
        address: PropTypes.string,
        city_name: PropTypes.string,
        position: PropTypes.shape({
            lat: PropTypes.number,
            lng: PropTypes.number
        }),
        onChange: PropTypes.func,
        defaultPosition: PropTypes.shape({
            lat: PropTypes.number,
            lng: PropTypes.number
        })
    }

    static defaultProps = {
        address: "",
        position: {
            lat: 0,
            lng: 0
        },
        city_name: "",
        onChange: () => { },
        defaultPosition: null
    }

    close = () => {
        this.setState({
            open: false
        })
    }

    open = () => {
        this.setState({
            open: true
        })
    }

    handleLocationChange = ({ position, address, places }) => {
        // let lg = places.length;
        // let city_name = "";
        // if (lg > 2) {
        //     let address_components = places[lg - 2].address_components;
        //     city_name = address_components[0].long_name;
        // }
        // else {
        //     let address_components = places[lg - 1].address_components;
        //     city_name = address_components[0].long_name;
        // }
        // this.setState({
        //     ...this.state,
        //     position,
        //     address,
        //     city_name
        // }, () => this.props.onChange(this.state.position, this.state.address, this.state.city_name));

    }


    handleChange = address => {
        this.setState({
            ...this.state,
            address: address
        }, () => this.props.onChange(this.state.position, this.state.address, this.state.city_name));
    }

    handleSelect = address => {
        var city_name = '';
        geocodeByAddress(address)
            .then(results => {
                results[0]['address_components'].forEach(component => {
                    if (component.types.indexOf('administrative_area_level_1') > -1) {
                        city_name = component.long_name;
                    }
                });
                var lng = results[0].geometry.location.lng();
                var lat = results[0].geometry.location.lat();
                this.setState({
                    position: {
                        lat: lat,
                        lng: lng,
                    },
                    defaultPosition: {
                        lat: lat,
                        lng: lng,
                    },
                    city_name: city_name,
                    address: results[0].formatted_address
                }, () => this.props.onChange(this.state.position, this.state.address, this.state.city_name));
            })
            .catch(error => {

                NotificationManager.error("Error when type address!");
            });
    };
    renderMarkers(map, maps) {
        let marker = new maps.Marker({
            position: this.state.defaultPosition,
            map,
            title: <span>{this.state.address}</span>
        });
    }
    render() {
        const { defaultPosition, address } = this.state
        const position = [defaultPosition.lat, defaultPosition.lng]
        const Marker = props => {
            return <div className="SuperAwesomePin">
                <Tooltip title={address}>
                <HomeTwoTone style={{fontSize:'16px'}} twoToneColor="#eb2f96"/>
                </Tooltip>
            </div>
          }
        return (

            <React.Fragment>


                <PlacesAutocomplete
                    value={address}
                    onChange={this.handleChange}
                    onSelect={this.handleSelect}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div>
                            <Input
                                {...getInputProps({
                                    placeholder: 'enter then choose a location...',
                                    className: 'location-search-input',
                                })}
                            />
                            <div className="autocomplete-dropdown-container">
                                {loading && <div>Loading...</div>}
                                {suggestions.map(suggestion => {
                                    const className = suggestion.active
                                        ? 'suggestion-item--active'
                                        : 'suggestion-item';
                                    // inline style for demonstration purpose
                                    const style = suggestion.active
                                        ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                        : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                    return (
                                        <div
                                            {...getSuggestionItemProps(suggestion, {
                                                className,
                                                style,
                                            })}
                                        >
                                            <span>{suggestion.description}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </PlacesAutocomplete>

                {/* <LocationPicker
                    containerElement={<div style={{ height: '100%' }} />}
                    mapElement={<div style={{ height: '400px' }} />}
                    onChange={this.handleLocationChange}
                    defaultPosition={this.state.defaultPosition}
                /> */}
                <Card className="mt-4">
                    <Typography.Title level={3}>Bản đồ</Typography.Title>
                    <div style={{ height: '350px', width: '100%' }}>
                        <GoogleMapReact
                            bootstrapURLKeys={{ key: 'AIzaSyAX2PANITOz9OwOu1oaj3QGZGQelGywIyA' }}
                            center={defaultPosition}
                            defaultZoom={15}
                            // onGoogleApiLoaded={({ map, maps }) => this.renderMarkers(map, maps)}
                        >
                            <Marker lat={defaultPosition.lat} lng={defaultPosition.lng} />
                        </GoogleMapReact>
                    </div>

                </Card >

            </React.Fragment >

        )
    }
}

export default CustomPlacesAutoComplete;