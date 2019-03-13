import React from 'react'
import {
  View, Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import { colors, shadow } from '../theme'
// some values regarding the tag card to tune

const { white, textPrimary, primary } = colors

export default function({
  mainElement,
  tagElement,
  leftTagElement,
  virtualContainerStyle = {},
  containerStyle = {},
  bottomVirtualContainerStyle = {},
  tagStyle = {},
  config: customConfig = {}
}) {
  const config = {
    containerHeight: 128,
    borderRadius: 8,
    ...customConfig
  }

  const style = ({
    virtualContainer: {
      height: config.containerHeight * 3 / 2,
      paddingRight: config.containerHeight / 4
    },
    container: {
      borderRadius: config.borderRadius,
      flex: 2,
      backgroundColor: white,

      // paddingTop: 16
    },
    tagContainer: {
      borderRadius: config.borderRadius,
      height: config.containerHeight / 2,
      flex: 2,

      transform: [
        { translateX: config.containerHeight / 4},
        { translateY: -config.containerHeight / 4},
      ],
      backgroundColor: white,
      zIndex: 10,
      // box shadow generator
      ...shadow,
    },
    lowerVirtualContainer: {
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
    },
    lowerVirtualLeftContainer: {
      flex: 1,
    }

  })
  return (
    <View style={{
      ...style.virtualContainer,
      ...virtualContainerStyle
    }}>
      <View style={{
        ...style.container,
        ...containerStyle}}>
          {mainElement}
      </View>
      <View style={style.lowerVirtualContainer}>
        <View style={{
          ...style.lowerVirtualLeftContainer,
          ...bottomVirtualContainerStyle
        }}>
          {leftTagElement}
        </View>
        <View style={{
          ...style.tagContainer,
          ...tagStyle}}>
          {tagElement}
        </View>
      </View>

    </View>

  )
}
