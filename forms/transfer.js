import React from 'react'
import TextInput from '../components/TextInput'
import AccountModel from '../models/account'

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
import { FormatCurrency } from '../utils'
import Icon from 'react-native-vector-icons/dist/FontAwesome'

const validationSchema = Yup.object().shape({
  name: Yup.string().min(10).required(),
  from: Yup.string().required(),
  to: Yup.string().required(),
  amount: Yup.number().moreThan(0).required(),
  exchangeRate: Yup.number().moreThan(0).required()
})

export default function({
  accountList = [],
  fromAccount,
  style: customStyle = {},
  onSubmit,
}) {
  const finalStyle = {...style, ...customStyle}
  const toAccountList = accountList.filter(acc => acc._id != fromAccount._id)
  const getAccountById = (id) =>
    toAccountList.filter(acc => acc._id == id)[0]

  const initialValues = {
    name: "",
    from: fromAccount._id,
    to: "",
    amount: 0,
    exchangeRate: 1,
  }
  const style = {
    amountRateRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center'
    },
    from: {
      marginTop: 8
    },
    summary: {
      marginTop: 8
    },
    ...customStyle
  }
  const onToAccountChange = (acc, setFieldValue) => {
    // complete to-account selection first.
    setFieldValue('to', acc)
    // the first index has to be there because this is called from picker only
    const toAccount = getAccountById(acc)
    if(!toAccount) return
    // calculate the exchange rate
    const exchangeRate = AccountModel.getExchangeRate({
      from: fromAccount.currency,
      to: toAccount.currency
    })
    setFieldValue('exchangeRate', exchangeRate)
  }

  // first trigger once
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
    >
      {
        ({
          errors,
          values,
          dirty,
          setFieldValue,
          isSubmitting
        }) => {
          if(toAccountList.length < 1) return null
          // get the instance of "to" account for later use
          const toAccountId = values["to"] || toAccountList[0]._id
          const toAccount = getAccountById(toAccountId)
          if(!toAccount) return null
          // trigger the "update "
          if(!dirty) onToAccountChange(toAccountList[0]._id, setFieldValue)

          return (
            <View>
              <TextInput
                label="Transfer reason"
                name="name"
                errors={errors}
                values={values}
                setFieldValue={setFieldValue}
              />
              <View style={style.from}>
                <Text h5>
                    From: {fromAccount.name}
                </Text>
              </View>
              <Picker
                selectedValue={values["to"]}
                onValueChange={(acc) => onToAccountChange(acc,setFieldValue)}
                label="To account"
              >
                {
                  toAccountList.map((acc,i) => (
                    <Picker.Item key={i} label={acc.name} val={acc._id} />
                  ))
                }
              </Picker>
              <TextInput
                label={`Amount (${fromAccount.currency})`}
                name="amount"
                keyboardType="decimal-pad"
                errors={errors}
                values={values}
                setFieldValue={setFieldValue}
              />
              <TextInput
                name="exchangeRate"
                label="Exchange Rate"
                keyboardType="decimal-pad"
                errors={errors}
                values={values}
                controlled={true}
                setFieldValue={setFieldValue}
              />
              {/* Summary component */}
              <View style={style.summary}>
                <Text h4>
                  Total:
                </Text>
                <Text h2 style={style.sum}>
                  {FormatCurrency(
                    values.amount * values.exchangeRate,
                    toAccount.currency
                  )}
                </Text>
              </View>
              <View style={style.summary}>
                <Button
                  icon={<Icon
                    name="exchange"
                    style={{marginRight: 8}}
                    color="white"/>}
                  block
                  title="Transfer"
                  onPress={() => onSubmit(values)}
                  disabled={
                    !dirty
                    || !_.isEmpty(errors)
                    || isSubmitting
                  }
                />
              </View>
            </View>
          )
        }
      }
    </Formik>
  )
}
