import React from 'react'
import PropTypes from 'prop-types'

import {
  View, StyleSheet,
  Picker,
  Text, TouchableOpacity,
  Platform
} from 'react-native'
import {
  Formik,
} from 'formik'

import {
  Overlay,
} from 'react-native-elements'
import AccountModel from '../../models/account'
import CreateAccountForm from '../../forms/createAccount'
import { colors } from '../../theme'

const { white, primary, background } = colors

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
        fullScreen
        onBackdropPress={onClose}
        isVisible={isOpen}>
        <View style={style.container}>
          <View style={style.header}>
            <Text style={style.headerText}>
              {"Add an account".toUpperCase()}
            </Text>
            {
              (Platform.OS == 'ios')?(
                <TouchableOpacity
                    onPress={onClose}
                >
                  <Text style={style.cancelText}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              )
              : null
            }
          </View>

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
    textAlign: 'center',
    backgroundColor: background
  },
  form: {
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerText: {
    flex: 1,
    fontSize: 22
  }
})
