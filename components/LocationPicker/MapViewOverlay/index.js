import 'jsdom-global/register'
import React from 'react'
import { isEqual } from 'lodash'

import LocationModel from 'models/location'
import Geocoder from 'react-native-geocoder'
import PropTypes from 'prop-types'
import Component from './component'
import * as _ from 'lodash'
/*
  Expected behaviour on centering the map:
  - when the map opens or when user clicks "target" button:
      - center the map.
    when the user moved:
      - do not center the map

*/
export default class MapViewOverlay extends React.Component {
  static propTypes = {
    // the user location from the subscription of the geolocation API
    userLocation: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      accuracy: PropTypes.number.isRequired
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onLocationChosen: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      region: {
        latitude: 0,
        longitude: 0,
      },
      // the resolved geoencoding name given the center of the map
      reversedGeoencodingName: null,
      // optional name given by the user.
      // if this is provided, the name of this location will be saved
      name: "",
      // flag indicating whether the map has been centered
      isLocating: true,
      isMapCentered: false,
      isMapMoved: false,

      locationsNearby: [],

      // flag indicating whether the given location is registered before.
      registeredLocation: null,
    }
    // some random "initial region " set for this map
    this.initialRegion = {
      latitude: 48.13,
      longitude: 11.58,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }
    this.defaultCameraLocation = {
      latitude: 0, longitude: 0
    }
  }
  async getLocationsNearby({latitude, longitude}) {
    const locationsNearby =
      await LocationModel.getSavedLocationsNearby({latitude, longitude})

    this.setState({ locationsNearby })
  }
  componentWillReceiveProps({ isOpen: willOpen, userLocation }) {
    const {
      isOpen: isOpening,
      userLocation: previousUserLocation,
    } = this.props
    if(
      isOpening &&
      willOpen &&
      !_.isEqual(previousUserLocation, userLocation)) {
        this.centerMapView()
      }
  }
  // by center it means to move the camera of the map to where the user is.
  // and the location of the user is subscribed by the parent instead of this component
  centerMapView() {
    if (!this.map) return
    const {
      userLocation: {latitude, longitude}
    } = this.props

    this.map.animateCamera({
      center: {latitude, longitude}
    })

    this.setState({
      isMapCentered: true,
   })
  }

  async onRegionChangeComplete(region) {
    await this.updateReverseGeoencoding(region)
    await this.getLocationsNearby(region)
  }

  async updateReverseGeoencoding(region) {
    const { latitude: lat, longitude: lng } = region
    // mark the start of reverse geoencoding process
    this.setState({
      isLocating: true
    })

    try {
      const reverseGeocodingResult =
        await Geocoder.geocodePosition({lat, lng})

      const [firstResult] = reverseGeocodingResult
      if(!firstResult) return

      const { formattedAddress } = firstResult
      this.setState({
        reversedGeoencodingName: formattedAddress
      })
    } catch(err) {
      // do nothing...
    } finally {
      // whether it succeed or not, it is no longer locating here
      this.setState({
        isLocating: false
      })
    }
  }

  onSubmitButtonPressed() {
    // the center of the map where the user is looking at is the location chosen.
    const {
      region: location,
      name: inputName,
      reversedGeoencodingName,
      registeredLocation,
    } = this.state
    // the location should be saved, when there are input and that its not a location registered.
    const shouldSaveLocation = !!inputName.trim() && !registeredLocation
    const name = shouldSaveLocation?inputName:reversedGeoencodingName
    this.props.onLocationChosen({
      location,
      name,
      shouldSaveLocation,
      registeredLocation,
    })
  }
  onMapMoved(region) {
    this.setState({
      region,
      isMapCentered: false,
      isMapMoved: true,
      registeredLocation: null
    })
  }

  onNameChanged(name) {
    this.setState({ name,  })
  }

  getMapReference(map) {
    this.map = map
  }
  onMapPressed({
    nativeEvent: {
      coordinate: center
    }
  }) {
    this.map.animateCamera({ center })
  }
  // when one of the "locations nearby" is chosen...
  onRegisteredLocationChosen(index) {
    const selectedLocation = this.state.locationsNearby[index]
    if(!selectedLocation) return

    const { location: region, name, _id } = selectedLocation
    this.setState({
      name,
      region,
      registeredLocation: _id
    })
  }

  render() {
    const state = {
      ...this.state,
      cameraLocation: this.state.region,
      inputName: this.state.name
    }
    return (
      <Component
        {...this.props}
        {...state}
        onRegisteredLocationChosen={this.onRegisteredLocationChosen.bind(this)}
        disableButton={!this.map}
        initialRegion={this.initialRegion}
        onRegionChange={this.onMapMoved.bind(this)}
        onRegionChangeComplete={this.onRegionChangeComplete.bind(this)}
        onMapPressed={this.onMapPressed.bind(this)}
        onMarkerPressed={this.onRegisteredLocationChosen.bind(this)}
        getMapReference={this.getMapReference.bind(this)}
        onRequestCenterMapView={this.centerMapView.bind(this)}
        onInputNameChanged={this.onNameChanged.bind(this)}
        onSubmitButtonPressed={this.onSubmitButtonPressed.bind(this)}
      />
    )

  }
}
