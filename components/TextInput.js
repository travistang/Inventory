import React from 'react'
import {
  Input
} from 'react-native-elements'
import { View } from 'react-native'
import PropTypes from 'prop-types'

export default class TextInput extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    values: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    setFieldValue: PropTypes.func.isRequired,
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
  render() {
    const {
      label, values,
      name, errors,
      setFieldValue, ...props
    } = this.props
    const errorMessage = errors[name]
    return (
      <Input label={label} name={name}
        value={values[name]}
        onChangeText={(value) => this.setFieldValue(value)}
        errorProps={errorMessage}
        {...props}
      />
    )
  }
}
