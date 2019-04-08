import React from 'react'
import {
  View, Text, StyleSheet
} from 'react-native'
import { colors } from '../../theme'
const { white, primary, secondary, textSecondary} = colors

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  cell: {
    flexDirection: 'column',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  coordinateText: {
    fontSize: 22,
    color: textSecondary
  },
  subText: {
    color: textSecondary
  }
})
export default function({
  latitude, longitude
}) {
  const trimNumber = num => num.toFixed(2)
  return (
    <View style={style.container}>
      <View style={style.cell}>
        <Text style={style.coordinateText}>
          {trimNumber(latitude)}
        </Text>
        <Text style={style.subText}>
          {'latitude'.toUpperCase()}
        </Text>
      </View>
      <View style={style.cell}>
        <Text style={style.coordinateText}>
          {trimNumber(longitude)}
        </Text>
        <Text style={style.subText}>
          {'longitude'.toUpperCase()}
        </Text>
      </View>
    </View>
  )
}
