import React from 'react'
import { FormatCurrency } from 'utils'
import {
  View, Text, StyleSheet
} from 'react-native'
import { Icon } from 'components'

export default function({
  icon, title, color, value
}) {
  const style = StyleSheet.create({
    cell: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    figure: {
      color,
      fontSize: 22,
      flex: 1,
    },
    iconText: {
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
    title: {
      color,
      fontSize: 12,
    },
    icon: {
      color,
      fontSize: 12
    }
  })
  return (
    <View style={style.cell}>
      <Text style={style.figure}>
        {value}
      </Text>
      <View style={style.iconText}>
        <Icon name={icon} style={style.icon} />
        <Text>{' '}</Text>
        <Text style={style.title}>
          {title.toUpperCase()}
        </Text>
      </View>
    </View>
  )

}
