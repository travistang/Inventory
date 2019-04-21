import React from 'react'
import { ContentCard } from 'components'
import { SelectionMarker } from 'LocationPicker'
import { View, Text, StyleSheet, Platform } from 'react-native'
import MapView from 'react-native-maps-osmdroid'

const style = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 16,
  },
  unavailable: {
    margin: 16
  },
  mapView: {
    height: 100,
    width: '100%'
  },
  innerContainer: {
    // paddingVertical: 16,
  },
  mapViewContainer: {
    height: 128
  }
})
export default function({
  location: { location = null , name = "" }
}) {
  return (
    <ContentCard
      title="location"
      icon="map-pin"
    >

      <View style={style.container}>
        {
          location?(

              <MapView
                style={style.mapView}
                provide={Platform.os === 'ios'?null:'osmdroid'}
                initialRegion={{
                  ...location,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01
                }}
                scrollEnabled={false}
                pitchEnabled={false}
              >
                <SelectionMarker location={location} />
              </MapView>


          ):(
            <Text style={style.unavailable}>
              Location unavailable
            </Text>
          )
        }

      </View>

    </ContentCard>
  )
}
