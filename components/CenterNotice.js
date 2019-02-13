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
      <Text h3>
        {icon && <Icon name={icon} />}
        {title}
      </Text>
      {
        subtitle && (
          <Text h5>
            {subtitle}
          </Text>
        )
      }
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1
  }
})
