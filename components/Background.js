import React from 'react'
import {
  ScrollView, StyleSheet
} from 'react-native'
import { colors } from '../theme'
const { background } = colors
const style = StyleSheet.create({
  container: {
    backgroundColor: background
  }
})
export default function({
  children,
  style: customStyle = {},
  ...props
}) {
  return (
    <ScrollView {...props} style={{...style.container, ...customStyle}}>
      {children}
    </ScrollView>
  )
}
