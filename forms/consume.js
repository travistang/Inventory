import React from 'react'
import PropTypes from 'prop-types'
import {
  Formik,

} from 'formik'

import {
  View, StyleSheet,
} from 'react-native'

import {
  Button
} from '../components'

import * as Yup from 'yup'
import * as _ from 'lodash'
import {
  ItemsInput, TextInput, Card
} from '../components'

import { colors } from '../theme'
const { white, secondary, primary } = colors

export default class ConsumeForm extends React.Component {
  static propTypes = {
    onConsume: PropTypes.func.required
  }

  constructor(props) {
    super(props)
    this.state = {

    }
    this.itemInputRef = React.createRef()
    this.initialValues = {
      name: "",
      items: []
    }
    this.validationSchema = Yup.object().shape({
      name: Yup.string().required(),
      items: Yup.array().required().of(
        Yup.object().shape({
          name: Yup.string().required(),
          amount: Yup.number().moreThan(0).required()
        })
      )
    })
  }
  consume({values, resetForm}) {
    this.props.onConsume(values).then(() => {
      // reset everything
      resetForm({})
      this.itemInputRef.current.clearItems()
    })
  }

  render() {
    return (
      <Formik
        enableReinitialize
        initialValues={this.initialValues}
        validationSchema={this.validationSchema}
      >
      {
        ({
          values, errors, setFieldValue,
          dirty, resetForm
        }) => {
          return (
            <View style={style.container}>
              <Card>
                <TextInput
                  label="Name"
                  icon="tag"
                  iconColor={primary}
                  name="name"
                  errors={errors}
                  values={values}
                  setFieldValue={setFieldValue}
                />
              </Card>

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
                type="block"
                color={primary}
                disabled={!_.isEmpty(errors) || !dirty}
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
  submitButton: {
    backgroundColor: white,
    borderRadius: 16,
    borderColor: secondary,

  },
  container: {
    display: 'flex'
  }
})
