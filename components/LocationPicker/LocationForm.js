import React from 'react'
import {
  View
} from 'react-native'

import {
  TextInput
} from 'components'
import * as Yup from 'yup'
import NearbyLocationList from './MapViewOverlay/NearbyLocationList'
import CoordinateComponent from './CoordinateComponent'
import ReverseGeocodingComponent from './ReverseGeocodingComponent'
import {colors, shadow} from 'theme'
const { white } = colors
const style = {
  container: {
    zIndex: 200000,
    borderRadius: 16,
    marginHorizontal: 8,
    flex: 1,
    backgroundColor: white,
    ...shadow
  }
}
// configuration for this form
const initialValues = {
  name: ""
}

const validationSchema = Yup.object().shape({
  name: Yup.string(),
  saveLocation: Yup.bool()
})
export default function({
  locationsNearby,
  reversedGeoencodingName,
  name,
  isLocating,
  isMapCentered,
  height,
  onCenter = () => {},
  onNameChanged = () => {},
}) {
  const transformStyle = {
    transform: [{translateY: -height}],
  }

  return (
    <View style={{...style.container, ...transformStyle}}>
      <ReverseGeocodingComponent
        height={height}
        name={reversedGeoencodingName}
        isLocating={isLocating}
        isMapCentered={isMapCentered}
        onCenter={onCenter}
      />
      <TextInput
        iconName="tag"
        label="Location Name"
        name="name"
        values={{ name }}
        onChangeText={onNameChanged}
      />
    </View>
  )
}
