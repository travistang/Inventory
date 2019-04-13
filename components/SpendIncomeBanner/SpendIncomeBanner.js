import React from 'react'
import {
  View, StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native'

import Cell from './cell'

import { colors } from 'theme'
const { background, primary, secondary } = colors

export default function({
  expenditure, income, currency, onPress
}) {
  const style = StyleSheet.create({
    container: {
      paddingHorizontal: 16,
    },
    row: {
      flexDirection: 'row',
    }
  })

  return (
    <TouchableOpacity
      onPress={onPress}
      style={style.container}>
      <View style={style.row}>
        <Cell
          icon="fire"
          title="expenditure"
          color={primary}
          values={expenditure}
          currency={currency}
        />
        <Cell
          icon="money"
          title="income"
          color={secondary}
          values={income}
          currency={currency}
        />
      </View>
    </TouchableOpacity>
  )
}
