import React from 'react'
import TextInput from '../components/TextInput'
import TransactionModel from '../models/transaction'

import * as _ from 'lodash'
import * as Yup from 'yup'

import { Formik } from 'formik'
import {
 View,
 Picker,
 StyleSheet,
 Text
} from 'react-native'
import {
  Button
} from 'react-native-elements'

import AccountCard from '../components/AccountCard'
import DropdownInput from '../components/DropdownInput'
import Card from '../components/Card'
import { colors } from '../theme'
const {
  secondary, white, textPrimary, primary
} = colors

const initialValues = {
  name: "",
  obtainedAmount: 0,
  to: ""
}

const style = StyleSheet.create({
  container: {
    // margin: 16
  },
  submitButton: {
    margin: 8,
    backgroundColor: secondary,
  },
  inputContainer: {
    padding: 8,
  },

})

const validationSchema = Yup.object().shape({
  obtainedAmount: Yup.number()
    .required(),
  to: Yup.string().required(),
  name: Yup.string()
    .min(8, "Item name is too short")
    .required()
})

export default function({
  isIncome = true,
  accountList = [],
  style: customStyle = {},
  onSubmit,
  accountId = null
}) {
  const getAccountById = (id) => (
    accountList.filter(acc => acc._id == id)[0]
  )
  const finalStyle = {...style, ...customStyle}
  let finalIntialValues = initialValues
  if(accountId) {
    finalIntialValues = {...initialValues, to: accountId}
  } else {
    // if no account is given, select the first one from the list
    finalIntialValues = {
      ...initialValues,
      to: initialValues.accountList[0]}
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
            <AccountCard
              isInput={true}
              amountChange={isIncome?(values.obtainedAmount):(-values.obtainedAmount)}
              account={getAccountById(values.to)}
            />
            <Card style={style.inputContainer}>
              <DropdownInput
                label="Account"
                icon="bank"
                selectedValue={values.to}
                onValueChange={v => setFieldValue('to',v)}>
                {
                  accountList.map(({name, _id: id}) => (
                    <Picker.Item label={name} value={id} />
                  ))
                }
              </DropdownInput>
              <TextInput
                label={isIncome?"Income name":"Expenditure name"}
                name="name"
                iconName="tag"
                iconColor={secondary}
                errors={errors}
                values={values}
                setFieldValue={setFieldValue}
                inputStyle={{color: textPrimary }}
                returnKeyType="next"
              />
              <TextInput
                label="Amount"
                name="obtainedAmount"
                iconName="money"
                iconColor={primary}
                errors={errors}
                values={values}
                keyboardType="decimal-pad"
                setFieldValue={setFieldValue}
                inputStyle={{color: textPrimary }}
                returnKeyType="next"
              />
            </Card>

            <Button
              containerStyle={style.submitButton}
              buttonStyle={{backgroundColor: secondary}}
              titleStyle={{fontFamily: 'Raleway'}}
              title={isIncome?"Record Income":"Record Expenditure"}
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
