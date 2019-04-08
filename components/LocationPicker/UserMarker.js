import React from 'react'
import { Circle } from 'react-native-maps-osmdroid'
import {
  View,
  StyleSheet
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
  return (
    <Circle
      strokeColor={primary}
      fillColor={addOpacity(primary, 0.3)}
      radius={accuracy}
      center={{latitude, longitude}}
    />
  )
}
