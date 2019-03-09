import React from 'react'
import {
  View
} from 'react-native'
import {
  Text
} from 'react-native-elements'
import Icon from 'react-native-vector-icons/dist/FontAwesome'

export default function({ title, icon, style: customStyle, textStyle }) {
  return (
    <View style={{
        marginLeft: 16,
        flexDirection: 'row', alignItems: 'center',
        ...customStyle
    }}>
      <Icon
        style={textStyle}
        name={icon}
        size={22}
      />
      <Text> {' '} </Text>
      <Text style={textStyle}>
        {title.toUpperCase()}
      </Text>
    </View>
  )
}
