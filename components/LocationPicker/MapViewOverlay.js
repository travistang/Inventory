import React from 'react'
import { colors } from 'theme'
const { white, primary } = colors

import {
  Overlay
} from 'react-native-elements'
import {
  StyleSheet, Platform,
  KeyboardAvoidingView,
  View, Text, Paltform
} from 'react-native'
import {
  Button
} from 'components'

import { isEqual } from 'lodash'
import MapView, {Marker, UrlTile} from 'react-native-maps-osmdroid'

import Geocoder from 'react-native-geocoder'

import UserMarker from './UserMarker'
import LocationForm from './LocationForm'
import CoordinateComponent from './CoordinateComponent'
import ReverseGeocodingComponent from './ReverseGeocodingComponent'
import PropTypes from 'prop-types'

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
      // a flag indicating whether the map has been moved by the user
      isMapCentered: false,
      // location of the camera of the map
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
      /*
        The difference between this and "isMapInitialised" is that,
        this flag simply tells whether the map is on top of the location of the user.
        This can be set to false when the user moves the map

        as for mapIsInitialized, it indicates whether the map has been moved to the center at least once
        "after" each time the map opens.
      */
      isMapCentered:true,

      isMapInitialised: false,

    }
    // some random "initial region " set for this map
    this.initialRegion = {
      latitude: 48.13,
      longitude: 11.58,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }

    this.styleConfig = {
      addressComponentHeight: 72
    }

  }

  componentWillReceiveProps({ isOpen: willOpen, userLocation }) {
    const {
      isOpen: isOpening,
      userLocation: previousUserLocation,
    } = this.props
    const { isMapInitialised, region } = this.state
    // if the overlay goes from not opening to opening state, receive the map initialised state
    if(!isOpening && willOpen) {
      this.setState({ isMapInitialised: false})
      // if the "current location" is already different from the default one, initialize it right away
      if(
        !isEqual(userLocation, region)) {
        this.centerMapView()
      }
    }
    // if the map is there, not initialized, and now the new location comes
    if(isOpening &&
      !isMapInitialised &&
      !isEqual(previousUserLocation, userLocation)) {
      this.centerMapView()
    }
  }
  // by center it means to move the camera of the map to where the user is.
  // and the location of the user is subscribed by the parent instead of this component
  async centerMapView() {
    const {
      userLocation: {latitude, longitude}
    } = this.props
    // filter out the accuracy attribute
    const userLocation = { latitude, longitude }
    // check if the map reference is still valid
    if (!this.map) return
    this.map.animateCamera({
      center: userLocation
    })
    this.setState({
       region: userLocation,
       isMapCentered: true,
       // this is to tell whether the map should move to the user location again
       isMapInitialised: true,
    })
  }

  async onMapReady() {
    return await Promise.all([
      this.recordCameraLocation.bind(this),
      this.updateReverseGeoencoding.bind(this)
    ])
  }

  async updateReverseGeoencoding() {
    const {
      region: {
        latitude: lat,
        longitude: lng
      }
    } = this.state
    this.setState({
      reversedGeoencodingName: null
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
      // alert(err.message)
    }
  }

  async recordCameraLocation(region) {
    this.setState({region})
  }
  onSubmitButtonPressed() {
    const {
      region: location, name: inputName,
      reversedGeoencodingName
    } = this.state
    const shouldSaveLocation = !!inputName.trim()
    const name = shouldSaveLocation?inputName:reversedGeoencodingName
    this.props.onLocationChosen({
      location,
      name,
      shouldSaveLocation
    })
  }
  async onRegionChange(region) {
    this.invalidateMapCenterFlag()
    return this.recordCameraLocation(region)
  }

  async invalidateMapCenterFlag() {
    this.setState({
      isMapCentered: false
    })
  }
  onNameChanged(name) {
    this.setState({ name })
  }
  render() {
    const {
      isOverlayOpen,
      region: { latitude, longitude },
      name,
      reversedGeoencodingName,
      isMapCentered,
      isMapInitialised
    } = this.state

    const { isOpen, onClose, userLocation } = this.props

    return (
      <Overlay
        fullScreen
        onBackdropPress={onClose}
        isVisible={isOpen}>
        <KeyboardAvoidingView style={style.container}>
          <Text style={style.header}>
            {'Choose Transaction Location'.toUpperCase()}
          </Text>
            <View style={style.mapViewContainer}>
              <MapView
                ref={map => { this.map = map }}
                style={style.mapView}
                provider={Platform.os === 'ios'?null:'osmdroid'}
                showTraffic={false}
                showsCompass={true}
                loadingEnabled={true}
                showsUserLocation={true}
                cacheEnabled={true}
                onMapReady={this.onMapReady.bind(this)}
                onRegionChange={this.onRegionChange.bind(this)}
                onRegionChangeComplete={this.updateReverseGeoencoding.bind(this)}
                initialRegion={this.initialRegion}
              >
              {
                /*
                <UrlTile
                  zIndex={1}
                  urlTemplate="https://maps.wikimedia.org/osm-intl/${z}/${x}/${y}.png"
                />
                */
              }

                <UserMarker
                  location={userLocation}
                />
              </MapView>
            </View>

            <LocationForm
              isMapInitialised={isMapInitialised}
              onCenter={this.centerMapView.bind(this)}
              onNameChanged={this.onNameChanged.bind(this)}
              reversedGeoencodingName={reversedGeoencodingName}
              latitude={latitude}
              longitude={longitude}
              isMapCentered={isMapCentered}
              name={name}
              height={this.styleConfig.addressComponentHeight}
            />

            <Button
              onPress={this.onSubmitButtonPressed.bind(this)}
              title="Submit"
              type="block"
              color={primary}
            />
        </KeyboardAvoidingView>

      </Overlay>
    )
  }
}

const style = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'column',
    flex: 1,
    backgroundColor: white
  },
  header: {
    marginBottom: 16,
  },
  mapViewContainer: {
    height: 320,
    // marginTop: titleHeight,
    overflow: 'hidden',
    borderRadius: 16,

  },
  mapView: {
    width: '100%',
    height: 300,
  },
})
