import React from 'react'
import {
  Picker, View, Text,
  StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/dist/FontAwesome'

export default class DropdownInput extends React.Component {
  render() {
    const {
      icon,
      label,
      children,
      iconSize = 22,
      containerStyle,
      iconStyle,
      ...props
    } = this.props
    return (
      <View style={style.container}>
        <View style={style.tag}>
          <Icon name={icon} size={iconSize} style={iconStyle}/>
          <Text>{' '}</Text>
          <Text style={style.label}>{label}</Text>
        </View>
        <View style={style.pickerWrapper}>
          <Picker {...props}>
            {children}
          </Picker>
        </View>
      </View>
    )
  }
}

const style = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pickerWrapper: {
    flex: 1,
  },
  label: {

  }
})
