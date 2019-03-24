import React from 'react'
import {
  View, StyleSheet, Text
} from 'react-native'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
export default function({
  title,
  subtitle = null,
  icon = null}) {
  return (
    <View style={style.container}>
      <Text style={style.text}>
        {icon && <Icon name={icon} size={72}/>}
      </Text>
      <Text style={{...style.text, fontSize: 28}}>
        {title}
      </Text>
      {
        subtitle && (
          <Text style={style.text}>
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
