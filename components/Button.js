import React from 'react'
import { StyleSheet } from 'react-native'
import {
  Button
} from 'react-native-elements'
import { colors } from '../theme'
const {
  white,
  primary,
  secondary,
} = colors
// an extra function that gives the button style based on the type of the button
const getButtonStyle = (type, color) => {
  switch(type) {
    case "outline":
      return {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: color,
        backgroundColor: "transparent"
      }
    case "block":
      return {
        backgroundColor: color
      }
    default:
      return { backgroundColor: "transparent"}
  }
}
const getIconConfig = (type, color, name) => {
  switch(type) {
    case "outline":
      return {name, color}
    case "block":
      return {name, color: white}
    default:
      return { name , color}
  }
}
const getTitleStyle = (type, color) => {
  const base = {
    fontFamily: "Railway"
  }
  let typeSpecificStyle = {}
  switch(type) {
    case "outline":
      typeSpecificStyle = {
        color
      }
      break
    case "block":
      typeSpecificStyle = {
        color: white
      }
      break
    default:
      break
  }
  return { ...base, ...typeSpecificStyle }
}
const getDisabledStyle = (type, color ) => {
  return {
    opacity: 0.5
  }
}
/*
  Custom button that fits to our own style
*/
export default function({
  color = secondary,
  type,
  buttonStyle,
  titleStyle,
  icon,
  title = "",
  ...props
}) {
  return (
    <Button
      title={title.toUpperCase()}
      disabledStyle={getDisabledStyle(type, color)}
      buttonStyle={{...getButtonStyle(type, color), ...buttonStyle}}
      titleStyle={{...getTitleStyle(type, color), ...titleStyle}}
      icon={getIconConfig(type, color, icon)}
      {...props}
    />
  )
}
