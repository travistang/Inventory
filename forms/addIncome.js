import React from 'react'
import TextInput from '../components/TextInput'
import TransactionModel from '../models/transaction'

import * as _ from 'lodash'
import * as Yup from 'yup'

import { Formik } from 'formik'
import {
 View,
 Picker,
 StyleSheet
} from 'react-native'
import {
  Text,
  Button
} from 'react-native-elements'

const initialValues = {
  name: "",
  obtainedAmount: 0,
  to: ""
}

const style = StyleSheet.create({
  container: {
    margin: 16
  }
})

const validationSchema = Yup.object().shape({
  obtainedAmount: Yup.number()
    .required()
    .moreThan(0),
  to: Yup.string().required(),
  name: Yup.string()
    .min(8, "Item name is too short")
    .required()
})

export default function({
  accountList = [],
  style: customStyle = {},
  onSubmit,
  accountId = null,
}) {
  const finalStyle = {...style, ...customStyle}
  let finalIntialValues = initialValues
  if(accountId) {
    finalIntialValues = {...initialValues, to: accountId}
  }
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={finalIntialValues}
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
          <View style={finalStyle.container}>
            <TextInput
              label="Income name"
              name="name"
              errors={errors}
              values={values}
              setFieldValue={setFieldValue}
            />
            {
              !accountId && (
                <Picker
                  selectedValue={values["to"]}
                  onValueChange={(v) => setFieldValue('to', v)}
                  label="To account"
                >
                  {
                    accountList.map((acc, i) => (
                      <Picker.Item key={i} label={acc.name} val={acc._id} />
                    ))
                  }
                </Picker>
              )
            }
            <TextInput
              label="Amount"
              name="obtainedAmount"
              errors={errors}
              values={values}
              keyboardType="decimal-pad"
              setFieldValue={setFieldValue}
            />
            <Button
              style={finalStyle.submitButton}
              title="Record Income"
              onPress={() => onSubmit(values)}
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
