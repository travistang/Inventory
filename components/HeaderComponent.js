import React from 'react'
import {
  View,Text, StyleSheet
} from 'react-native'

import Icon from 'react-native-vector-icons/dist/FontAwesome'

const style = StyleSheet.create({
  text: {
    fontSize: 26,
    // fontWeight: 'bold'
  }
})
export default function({ title, icon, style: customStyle, textStyle }) {
  return (
    <View style={{
        marginLeft: 16,
        flexDirection: 'row', alignItems: 'center',
        ...customStyle
    }}>
    {
      /*
      <Icon
        style={textStyle}
        name={icon}
        size={22}
      />
      <Text> {' '} </Text>
      */
    }


      <Text style={{...style.text, ...textStyle}}>
        {title.toUpperCase()}
      </Text>
    </View>
  )
}
