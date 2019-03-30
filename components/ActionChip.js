import React from 'react'
import {
  View, TouchableOpacity, StyleSheet, Text
} from 'react-native'
import {
  Icon
} from 'react-native-elements'
import { colors } from '../theme'
const {white, primary, secondary} = colors
/*
  Similar to ActionBox, but this looks like a chip instead of a box...
*/
export default function ({
  config: {name, conversionFunction},
  key,
  selected = false,
  height = 32,
  onSelect,
  style: customStyle
}) {
  const color = primary // so it's easier to change later
  const computedStyle = {
    backgroundColor: selected?color:"transparent",
    height,
    borderRadius: height / 2,
    borderWidth: 1,
    borderColor: color,
    paddingHorizontal: height / 2 // make sure the arc from both sides are not occupied
  }
  return (
    <TouchableOpacity onPress={onSelect}>
      <View style={{
          ...style.container,
          ...customStyle,
          ...computedStyle
      }}>
        <Text style={{color: selected?white:color}}>
          {name.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 8
  }
})
