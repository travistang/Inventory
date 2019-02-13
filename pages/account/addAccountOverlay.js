import React from 'react'
import PropTypes from 'prop-types'

import {
  View, StyleSheet,
  Picker
} from 'react-native'
import {
  Formik,
} from 'formik'

import {
  Overlay,
  Text,
} from 'react-native-elements'
import AccountModel from '../../models/account'
import CreateAccountForm from '../../forms/createAccount'

export default class AddAccountOverlay extends React.Component {
  static propTypes = {
    onCreate: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  }
  createAccount(values) {
    const payload = {
      ...values,
      amount: parseFloat(values.amount)
    }
    AccountModel.addAccount(payload).then(r => {
      this.props.onClose()
    })
  }
  render() {
    const {
      onCreate,
      isOpen,
      onClose
    } = this.props
    return (
      <Overlay
        onBackdropPress={onClose}
        isVisible={isOpen}>
        <View style={style.container}>
          <Text h3> Add an account </Text>
          <CreateAccountForm
            style={style.form}
            onSubmit={values => this.createAccount(values)}
          />
        </View>
      </Overlay>
    )
  }
}

const style = StyleSheet.create({
  container: {
    margin: 8,
    textAlign: 'center'
  },
  form: {
    marginTop: 16,
  }
})
