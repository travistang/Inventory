import React from 'react'
import {
  View,
  KeyboardAvoidingView,
  StyleSheet, TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Text,
} from 'react-native'
import {
  Button,
  Icon
} from '../../components'
import TextInput from '../TextInput'

import { colors, shadow } from '../../theme'
const {
  white, primary, secondary,
  textSecondary
} = colors

import MapViewOverlay from './MapViewOverlay'
import Geolocation from 'react-native-geolocation-service'

import PropTypes from 'prop-types'

/*
  A component that returns a "location" with the following format:
    location: {
      location: {
        lat: Number,
        lng: Number
      },
      name: String,
    }
*/
export default class LocationPicker extends React.Component {
  static propTypes = {
    ...TextInput.propTypes,
    onLocationChosen: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      isOverlayOpen: false,
      // flag indicating that the permission has been granted
      hasPermission: false,

      userLocation: {
        latitude: 0,
        longitude: 0,
        accuracy: 0,
      },
      // the id for the subscription of user location
      watchPositionId: null,
    }
  }

  async requestLocationPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    const isGranted = await PermissionsAndroid.check(permission)

    if (isGranted) {
      return true
    }
    try {
      const granted = await PermissionsAndroid.request(permission,
        {
          title: 'Location Permission',
          message: 'Location service required to record transaction location',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      )
      return granted === PermissionsAndroid.RESULTS.GRANTED
    } catch (err) {
      alert(`error while requesting permission: ${err.message}`)
    }
  }
  async subscribeUserLocation() {
    const watchId = Geolocation.watchPosition(
      ({coords: userLocation}) => {
        // alert(`userLocation: ${JSON.stringify(userLocation)}`)
        this.setState({ userLocation })
      },
      err => console.warn(err.message),
    {
      enableHighAccuracy: true,
      distanceFilter: 10,
    })
    this.setState({ watchPositionId: watchId})
  }

  componentWillUnmount() {
    const { watchPositionId } = this.state
    Geolocation.clearWatch(watchPositionId)
  }
  async componentDidMount() {
    await this.requestLocationPermission()
    await this.subscribeUserLocation()
  }

  async openOverlay() {
    this.setState({ isOverlayOpen: true })
  }

  onLocationChosen(formValue) {
    const { setFieldValue, name: fieldName } = this.props
    alert(
      `selecting location,
        ${JSON.stringify({region, name, shouldSaveLocation})}
      `)
    //setFieldValue(fieldName, formValue)
    this.hideOverlay()
  }

  onLocationFormValueChange(value) {
    this.setState({
      locationFormValue: value
    })
  }

  hideOverlay() {
    this.setState({
      isOverlayOpen: false
    })
  }

  render() {
    const {
      locationFormValue,
      userLocation,
      isOverlayOpen
    } = this.state
    return (
      <KeyboardAvoidingView>
        <MapViewOverlay
          isOpen={isOverlayOpen}
          onLocationChosen={this.onLocationChosen.bind(this)}
          onClose={this.hideOverlay.bind(this)}
          userLocation={userLocation}
        />
        <TouchableOpacity
          style={{width: '100%'}}
          onPress={this.openOverlay.bind(this)}>
          <TextInput
            name="name"
            values={locationFormValue}
            {...this.props}
            editable={false}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    )
  }
}
