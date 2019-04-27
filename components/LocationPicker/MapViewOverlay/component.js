import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import { Overlay } from "react-native-elements";
import { Button } from "components";
import MapView, { Marker, UrlTile } from "react-native-maps-osmdroid";

import { colors } from "theme";
const { white, primary } = colors;

import {
  LocationForm,
  UserMarker,
  SelectionMarker,
  LocationMarker
} from "LocationPicker";

const style = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: "column",
    flex: 1,
    backgroundColor: white
  },
  header: {
    marginBottom: 16
  },
  mapViewContainer: {
    height: 260,
    // marginTop: titleHeight,
    overflow: "hidden",
    borderRadius: 16
  },
  mapView: {
    width: "100%",
    height: 240
  }
});
const addressComponentHeight = 72;

export default function({
  initialRegion,
  isOpen,
  onClose,

  isLocating,
  isMapCentered,
  isMapMoved,
  reversedGeoencodingName,
  inputName,
  cameraLocation,

  getMapReference,
  userLocation,
  onRegionChange,
  onRegionChangeComplete,
  onRequestCenterMapView,
  onMapPressed,

  onInputNameChanged,
  onSubmitButtonPressed,
  onMarkerPressed,
  disableButton,

  locationsNearby
}) {
  return (
    <Overlay fullScreen onBackdropPress={onClose} isVisible={isOpen}>
      <KeyboardAvoidingView style={style.container}>
        <Text style={style.header}>
          {"Choose Transaction Location".toUpperCase()}
        </Text>
        <View style={style.mapViewContainer}>
          <MapView
            ref={getMapReference}
            style={style.mapView}
            provider={Platform.os === "ios" ? null : "osmdroid"}
            showsTraffic={false}
            showsCompass={false}
            loadingEnabled={true}
            showsUserLocation={true}
            cacheEnabled={true}
            onRegionChange={onRegionChange}
            onPress={onMapPressed}
            onRegionChangeComplete={onRegionChangeComplete}
            initialRegion={{ ...initialRegion, ...userLocation }}
          >
            <SelectionMarker location={cameraLocation} />
            <UserMarker location={userLocation} />
            {locationsNearby.map(({ location, name }, i) => (
              <LocationMarker
                onPress={() => onMarkerPressed(i)}
                key={name}
                name={name}
                location={location}
              />
            ))}
          </MapView>
        </View>

        <LocationForm
          locationsNearby={locationsNearby}
          onCenter={onRequestCenterMapView}
          onNameChanged={onInputNameChanged}
          reversedGeoencodingName={reversedGeoencodingName}
          isMapCentered={isMapCentered}
          isLocating={isLocating}
          name={inputName}
          height={addressComponentHeight}
        />

        <Button
          disabled={disableButton}
          onPress={onSubmitButtonPressed}
          title="Submit"
          type="block"
          color={primary}
        />
      </KeyboardAvoidingView>
    </Overlay>
  );
}
