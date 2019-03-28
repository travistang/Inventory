import React from 'react'
import {
  Formik
} from 'formik'
import {
 View,
 Picker,
 Text, Image,
 TouchableOpacity,
 StyleSheet
} from 'react-native'

import { flagOfCurrency } from '../models'
import {
  Button
} from 'react-native-elements'

import * as Yup from 'yup'
import * as _ from 'lodash'
import AccountModel from '../models/account'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import TextInput from '../components/TextInput'

import AutocompleteTextInput from '../components/AutocompleteTextInput'

const style = StyleSheet.create({
  currencyOptionContainer: {
    flexDirection: 'row',
    padding: 8,
    justifyContent: 'space-between'
  },
  countryFlag: {
    height: 24,
    width: 32,
    marginRight: 8,
  },
  currencyOptionText: {
    fontSize: 24
  }
})
export default function({
  initialAccountValues = AccountModel.initialAccountValues,
  onSubmit,
  style: customStyle
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
          <View style={customStyle}>
            <TextInput
              label="Account Name"
              iconName="tag"
              name="name"
              errors={errors}
              values={values}
              setFieldValue={setFieldValue}
            />
            <TextInput
              label="Initial Amount"
              name="amount"
              iconName="money"
              errors={errors}
              values={values}
              keyboardType="numeric"
              setFieldValue={setFieldValue}
            />
            <AutocompleteTextInput
              options={
                (AccountModel.recognizedCurrency || [])
                  .map(currency => ({value: currency}))
              }
              transformInput={v => v.toUpperCase().trim()}
              renderItem={({value: cur}) => (
                <View style={style.currencyOptionContainer}>
                  <Image style={style.countryFlag}
                    source={{uri: flagOfCurrency(cur)}}
                  />
                  <Text style={style.currencyOptionText}>
                    {cur}
                  </Text>
                </View>
              )}
              label="dollar"
              name="currency"
              iconName="dollar"
              errors={errors}
              values={values}
              setFieldValue={setFieldValue}
              onChangeText={v => setFieldValue('currency', v)}
            />

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
