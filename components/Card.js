import React from 'react'
import {
  View, StyleSheet,
  Text
} from 'react-native'
import {
  colors
} from '../theme'
const {
  white, black, textPrimary
} = colors

const style = StyleSheet.create({
  container: {
    backgroundColor: white,
    borderRadius: 16, // the corners of the cards,
    zIndex: 2,
  }
})
export default function({
  children,
  style: customStyle,
  ...props
}) {
  return (
    <View
      style={{...style.container, ...customStyle}}
      {...props}
    >
      {children}
    </View>
  )
}
