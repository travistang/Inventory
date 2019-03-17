import React from 'react'
import {
  Input
} from 'react-native-elements'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import { Fumi } from 'react-native-textinput-effects'
import Icon from 'react-native-vector-icons/dist/FontAwesome'

export default class TextInput extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    values: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    icon: PropTypes.string,
    iconColor: PropTypes.string,
    style: PropTypes.object,

    // possible types that appear for configuring the TextInput
    controlled: PropTypes.bool,
    keyboardType: PropTypes.string // need to keep track on this
  }
  /*
    Determine whether the input value should be casted to number
    according to the keyboardType prop.
  */
  setFieldValue(value) {
    const { setFieldValue, name, keyboardType } = this.props
    if(keyboardType) {
      const finalValue = parseFloat(value)
      setFieldValue(name, finalValue)
    } else {
      setFieldValue(name, value)
    }
  }
  getValue(value) {
    const {keyboardType} = this.props
    if(!keyboardType) return value
    const finalValue = parseFloat(value) || 0
    return finalValue.toString()

  }
  render() {
    const {
      label, values,
      name, errors,
      icon, iconColor,
      setFieldValue, ...props
    } = this.props
    const errorMessage = errors[name]
    return (
      <Fumi
        label={label}
        value={this.getValue(values[name])}
        onChangeText={(value) => this.setFieldValue(value)}
        iconClass={Icon}
        iconName={icon}
        iconColor={iconColor}
        {...props}
      />
    )
    // return (
    //   <Input label={label} name={name}
    //     value={values[name]}
    //     onChangeText={(value) => this.setFieldValue(value)}
    //     errorProps={errorMessage}
    //     {...props}
    //   />
    // )
  }
}