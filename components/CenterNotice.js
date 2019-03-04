import React from 'react'
import {
  View, StyleSheet
} from 'react-native'
import { Text } from 'react-native-elements'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
export default function({
  title,
  subtitle = null,
  icon = null}) {
  return (
    <View style={style.container}>
      <Text h1 style={style.text}>
        {icon && <Icon name={icon} size={72}/>}
      </Text>
      <Text h3 style={style.text}>
        {title}
      </Text>
      {
        subtitle && (
          <Text h5 style={style.text}>
            {subtitle}
          </Text>
        )
      }
    </View>
  )
}

const style = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
  container: {
    justifyContent: 'center',
    flex: 1
  }
})
