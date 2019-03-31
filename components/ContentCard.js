import React from 'react'
import Card from './Card'
import {
  View, StyleSheet,
  Text
 } from 'react-native'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import { colors } from '../theme'
const { white } = colors
const style = StyleSheet.create({
  sectionCardHeader: {
    flexDirection: 'row'
  },
  sectionCardHeaderTextContainer: {
    marginLeft: 4,
  },
  sectionCardHeaderText: {

  },
  container: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    zIndex: 2,
    backgroundColor: white
  }
})
const cardHeader = ({ title, icon }) => (
  <View style={style.sectionCardHeader}>
    <Icon name={icon} size={16} />
    <View style={style.sectionCardHeaderTextContainer}>
      <Text style={style.sectionCardHeaderText}>
        {title.toUpperCase()}
      </Text>
    </View>
  </View>
)

export default function({
  children,
  title, icon,
  style: customStyle,
  ...props
}) {
  return (
    <Card
    style={{...style.container, customStyle}}
      {...props}
    >
      {cardHeader({ title, icon })}
      {children}
    </Card>
  )
}
