import React from 'react'
import {
  View
} from 'react-native'
import {
  Text
} from 'react-native-elements'
import Icon from 'react-native-vector-icons/dist/FontAwesome'

export default function({ title, icon }) {
  return (
    <View style={{
        marginLeft: 16,
        flexDirection: 'row', alignItems: 'center'}}>
      <Icon name={icon} size={22} />
      <Text> {' '} </Text>
      <Text>
        {title.toUpperCase()}
      </Text>
    </View>
  )
}
