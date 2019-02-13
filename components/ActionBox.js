import React from 'react'
import {
  TouchableOpacity,
  View
} from 'react-native'

import {
  Text
} from 'react-native-elements'
import Icon from 'react-native-vector-icons/dist/FontAwesome'


export default function({
  text,
  icon,
  onPress,
  color,
  style: customStyle = {}
}) {
  const style = {
    container: {
      border: `1px solid ${color}`,
      borderRadius: 16,
      color,
      width: 72,
      height: 72,
    },
    icon: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    textContainer: {
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center'
    },
    text: {
      color
    }
  }
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{...style.container, ...customStyle}}>
        <View style={style.icon}>
          <Icon name={icon} color={color} size={48}/>
        </View>
        <View style={style.textContainer}>
          <Text style={style.text} h5>
            {text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
