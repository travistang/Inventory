import React from 'react'
import { Marker } from 'react-native-maps-osmdroid'
import { View } from 'react-native'
import { Icon } from 'components'
import { colors } from 'theme'
const { primary } = colors

export default function({
  location
}) {
  return (
    <Marker coordinate={location}>
      <Icon name="map-pin" size={22} style={{color: primary}} />
    </Marker>
  )
}
