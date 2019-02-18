import React from 'react'
import {
  View, StyleSheet,
  TouchableOpacity
} from 'react-native'

import {
  Button, Card,
  Text,
} from 'react-native-elements'

const style = StyleSheet.create({
  cardContainer: {

  },
  surplus: {
    color: 'green',
    fontSize: 32
  }
})
export default function({
  item: { name, amount, unit },
  style: customStyle = {},
  onClick
}) {
  return (
    <TouchableOpacity
      style={customStyle}
      onPress={onClick}>
      <Card
        title={name}>
        <View style={style.cardContainer}>
          <Text style={style.surplus}>
            {`${amount} ${unit}`}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>

  )
}
