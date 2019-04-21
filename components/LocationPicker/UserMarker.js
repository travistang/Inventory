import React from 'react'
import { Circle, Marker } from 'react-native-maps-osmdroid'
import {
  View, Text
} from 'react-native'
import { colors } from 'theme'
import { addOpacity } from 'utils'
const { white, primary } = colors

export default function({
  location: {latitude, longitude, accuracy}
}) {
  // stop rendering invalid circles on map
  if(!latitude || !longitude || !accuracy)
    return null
  const point = {latitude, longitude}
  return (
    <View>
      <Marker coordinate={point} pinColor={primary}>
          <Text> You are here </Text>
      </Marker>
      <Circle
        strokeColor={primary}
        fillColor={addOpacity(primary, 0.3)}
        radius={accuracy * 10}
        center={point}
      />

    </View>
  )
}
