import React from 'react'
import {
  Formik
} from 'formik'
import {
 View,
 Picker
} from 'react-native'

import {
  Text,
  Button
} from 'react-native-elements'

import * as Yup from 'yup'
import * as _ from 'lodash'
import AccountModel from '../models/account'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import TextInput from '../components/TextInput'

export default function({
  initialAccountValues = AccountModel.initialAccountValues,
  onSubmit,
  style
}) {
  return (
    <Formik
      validationSchema={AccountModel.validationSchema()}
      initialValues={initialAccountValues}
    >
    {
      ({
        errors,
        values,
        dirty,
        setFieldValue,
        isSubmitting
      }) => {
        return (
          <View style={style}>
            <TextInput
              label="Account Name"
              name="name"
              errors={errors}
              values={values}
              setFieldValue={setFieldValue}
            />
            <TextInput
              label="Initial Amount"
              name="amount"
              errors={errors}
              values={values}
              keyboardType="numeric"
              setFieldValue={setFieldValue}
            />
            <Picker
              selectedValue={values["currency"]}
              onValueChange={(v) => setFieldValue('currency', v)}
            >
              {
                AccountModel.recognizedCurrency.map((cur, i) => (
                   <Picker.Item label={cur} value={cur}/>
                ))
              }
            </Picker>
            <Button
              title="Create Account"
              onPress={onSubmit.bind(this,values)}
              disabled={
                !dirty
                || !_.isEmpty(errors)
                || isSubmitting
              }
            />
          </View>
        )
      }
    }
    </Formik>
  )
}
