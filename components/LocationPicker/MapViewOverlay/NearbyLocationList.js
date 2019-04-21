import React from 'react'
import {
  ScrollView, StyleSheet, View, Text
} from 'react-native'
import { TagCard, Icon } from 'components'
import { colors, shadow } from 'theme'
const { primary, white } = colors

const style = StyleSheet.create({
  location: {
    flexDirection: 'row',
  },
  container: {
    margin: 8,
  },
  locationText: {
    color: primary,
  },

  locationCard: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 128,
    height: 96,
    borderRadius: 16,
    margin: 8,
    padding: 4,
    ...shadow,
  }
})
const LocationCard = ({name, distance}) => (
  <View
    style={style.locationCard}>
    <Text> {name} </Text>
    <View style={style.location}>
      <Icon name="map-pin" style={{color: white}} />
      <Text style={style.locationText}>
        {`${distance.toFixed(2)} km`}
      </Text>
    </View>
  </View>
)
export default function({
  locations
}) {
  if(locations.length == 0) return null
  return (
    <ScrollView horizontal={true}>
      {
        locations.map(({name, distance}) => (
          <LocationCard
            name={name}
             key={name}
             distance={distance} />
        ))
      }
    </ScrollView>
  )
}
