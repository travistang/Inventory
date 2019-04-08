import React from 'react'
import {
  StyleSheet, View, Text, TouchableOpacity
} from 'react-native'
import {
  Icon
} from '../'
import { colors } from '../../theme'
const { primary, secondary, textSecondary, white} = colors
const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  name: {
    flex: 1,
    fontSize: 16,
  },
  icon: {
    color: primary,
    marginRight: 16,
  },
  centerMapButton: {
    marginLeft: 16,
  }
})


export default function({
  name,
  isMapCentered, isMapInitialised,
  onCenter,
  height
}) {
  let text = name?name:"Unknown Location"
  let containerInitialisingStyle = { }
  let inferredNameStyle = {
    opacity: name?1:0.5,
    color: name?primary:textSecondary
  }
  // special treatment for initialised component
  if(!isMapInitialised) {
    inferredNameStyle = {
      opacity: 1,
      color: white,
    }
    containerInitialisingStyle = {
      backgroundColor: primary,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    }
    text = "Locating..."
  }

  return (
    <View style={{
        ...style.container,
        ...containerInitialisingStyle,
        height}}>
      <Icon name="map-pin" size={22}
        style={{...style.icon, ...inferredNameStyle}}
      />
      <Text style={{...style.name, ...inferredNameStyle}}>
        {text}
      </Text>
      {
        !isMapCentered && (
          <TouchableOpacity
            style={style.centerMapButton}
            onPress={onCenter}>
            <Icon name="crosshairs" size={22}
              style={{...inferredNameStyle}}
            />
          </TouchableOpacity>
        )
      }
    </View>
  )
}
