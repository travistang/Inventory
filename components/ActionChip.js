import React from 'react'
import {
  View, TouchableOpacity, StyleSheet
} from 'react-native'
import {
  Text, Icon
} from 'react-native-elements'

/*
  Similar to ActionBox, but this looks like a chip instead of a box...
*/
export default function ({
  name, icon,
  color = "blue",
  height = 32,
  onPress,
  selected,
  style: customStyle
}) {
  const computedStyle = {
    backgroundColor: selected?color:"transparent",
    height,
    borderRadius: height / 2,
    borderWidth: 1,
    borderColor: color,
    paddingHorizontal: height / 2 // make sure the arc from both sides are not occupied
  }
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{
          ...customStyle,
          ...style.container,
          ...computedStyle
      }}>
        <Text style={{color: selected?'white':color}}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 8
  }
})
