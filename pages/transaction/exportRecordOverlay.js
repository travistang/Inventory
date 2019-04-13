import React from 'react'
import PropTypes from 'prop-types'

import {
  View, StyleSheet, Text,
  ToastAndroid
} from 'react-native'

import TextInput from '../../components/TextInput'
import Card from '../../components/Card'
import {
  Overlay, Button
} from 'react-native-elements'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { colors } from '../../theme'

const { primary, white } = colors
import { exportDB } from '../../models'

export default class ExportRecordOverlay extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired
  }
  exportData(address) {
    exportDB(address)
      .then(respose => {
        console.warn(response)
        if( response.status != 200) {
          throw new Error()
        }
        ToastAndroid.show(
          "Data exported successfully",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        )

        this.props.onClose()
      })
      .catch(() => (
        ToastAndroid.show(
          "Unable to export data",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        )
      ))
  }
  form() {
    const initialValues = {
      server: ""
    }
    const validationSchema = Yup.object().shape({
      server: Yup.string().required()
    })
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}>
        {
          ({values, errors, dirty, setFieldValue}) => (
            <View style={style.container}>
              <TextInput
                label="server address"
                iconName="database"
                values={values}
                errors={errors}
                setFieldValue={setFieldValue}
                name="server"
              />

              <Button
                title="Export"
                disabledStyle={style.disabledButton}
                buttonStyle={style.button}
                titleStyle={style.buttonTitle}
                onPress={() => this.exportData(values.server)}
                icon={{name: 'share', color: primary }}
                />
            </View>
          )
        }
      </Formik>
    )
  }
  render() {
    const { isOpen, onClose } = this.props
    return (
      <Overlay
        isVisible={isOpen}
        height={200}
        overlayStyle={style.overlay}
        onBackdropPress={onClose}>
        <Card>
          <View>
            <Text style={style.headerText}>
              {"export record to server".toUpperCase()}
            </Text>
            {this.form()}
          </View>
        </Card>
      </Overlay>
    )
  }
}

const style = StyleSheet.create({
  headerText: {
    fontSize: 18,
  },
  container: {
  },
  addressInput: {
    flex: 1,
  },
  button: {
    borderColor: primary,
    backgroundColor: white,
    borderRadius: 16,
    borderWidth: 1,

  },
  disabledButton: {
    opacity: 0.5
  },
  buttonTitle: {
    color: primary,
    fontFamily: 'Railway'
  }
})
