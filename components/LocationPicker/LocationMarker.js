import React from 'react'
import { Marker } from 'react-native-maps-osmdroid'
import {
  Icon
} from 'components'

import {
  View, Text, StyleSheet
} from 'react-native'
import { colors, shadow } from 'theme'
const { secondary, white } = colors

const style = StyleSheet.create({
  name: {
    ...shadow,
    backgroundColor: white,
    borderRadius: 8,
    padding: 16,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default function({
  location, name, onPress
}) {
  return (
    <Marker
      onPress={onPress}
      coordinate={location}>
      <View style={style.container}>
        <Text style={style.name}>
          {name}
        </Text>
        <Icon name="map-pin" style={{color: secondary }} />
      </View>

    </Marker>
  )
}
