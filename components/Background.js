import React from 'react'
import {
  ScrollView, StyleSheet
} from 'react-native'
import { colors } from 'theme'
const { background } = colors
const style = StyleSheet.create({
  container: {
    backgroundColor: background
  }
})
export default function({
  children,
  component: Component = ScrollView,
  style: customStyle = {},
  ...props
}) {
  return (
    <Component {...props} style={{...style.container, ...customStyle}}>
      {children}
    </Component>
  )
}
