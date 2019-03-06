import React from 'react'
import PropTypes from 'prop-types'
import {
  Formik,

} from 'formik'

import {
  View, StyleSheet,
} from 'react-native'

import {
  Text,
  Button
} from 'react-native-elements'

import * as Yup from 'yup'
import * as _ from 'lodash'
import ItemsInput from '../components/ItemsInput'
import TextInput from '../components/TextInput'

export default class ConsumeForm extends React.Component {
  static propTypes = {
    onConsume: PropTypes.func.required
  }

  constructor(props) {
    super(props)
    this.state = {

    }
    this.itemInputRef = React.createRef()
  }
  consume({values, resetForm}) {
    this.props.onConsume(values).then(() => {
      // reset everything
      resetForm({})
      this.itemInputRef.current.clearItems()
    })
  }
  validationSchema() {
    return Yup.object().shape({
      name: Yup.string().required(),
      items: Yup.array().required().of(
        Yup.object().shape({
          name: Yup.string().required(),
          amount: Yup.number().moreThan(0).required()
        })
      )
    })
   }
  render() {
    return (
      <Formik
        enableReinitialize
        validaationSchema={this.validationSchema()}
      >
      {
        ({
          values, errors, setFieldValue,
          dirty, resetForm
        }) => {
          return (
            <View style={style.container}>

              <TextInput
                label="Name"
                name="name"
                errors={errors}
                values={values}
                setFieldValue={setFieldValue}
              />

              <View style={{margin: 16}}>
                <ItemsInput
                  ref={this.itemInputRef}
                  isBuying={false}
                  onFinishSelection={
                    items => setFieldValue("items", items)
                  }
                />
              </View>

              <Button
                type="outline"
                disbled={!_.isEmpty(errors)}
                onPress={this.consume.bind(this, {values, resetForm})}
                title="Consume"
              />
            </View>
          )
        }
      }
      </Formik>
    )
  }
}

const style = StyleSheet.create({
  container: {
    display: 'flex'
  }
})
