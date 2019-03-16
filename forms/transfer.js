import React from 'react'
import TextInput from '../components/TextInput'
import AccountModel from '../models/account'

import * as _ from 'lodash'
import * as Yup from 'yup'

import { Formik } from 'formik'
import {
  View,
  Picker,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'
import {
  Button
} from 'react-native-elements'
import { FormatCurrency } from '../utils'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import TagCard from '../components/TagCard'
import Background from '../components/Background'
import Card from '../components/Card'
import DropdownInput from '../components/DropdownInput'
import { colors } from '../theme'

const { white, textPrimary, primary, secondary } = colors

const validationSchema = Yup.object().shape({
  name: Yup.string().min(10).required(),
  from: Yup.string().required(),
  to: Yup.string().required(),
  amount: Yup.number().moreThan(0).required(),
  exchangeRate: Yup.number().moreThan(0).required()
})

export default function({
  accountList = [],
  fromAccount, // this is supposed to be an account OBJECT
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
    transactionPreviewContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    amountRateRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center'
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    formContainer: {
      padding: 16
    },
    from: {
      marginTop: 8
    },
    summary: {
      margin: 8,
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
    previewCardContainerStyle: {
      flex: 1,
      marginHorizontal: 4
    },
    ...customStyle
  }
  const onAccountChange = ({ to, account, setFieldValue}) => {
    // complete to-account selection first.
    setFieldValue(to?'to':'from', account._id)
    // the first index has to be there because this is called from picker only
    const toAccount = account
    if(!toAccount) return
    // calculate the exchange rate
    const exchangeRate = AccountModel.getExchangeRate({
      from: fromAccount.currency,
      to: toAccount.currency
    })
    setFieldValue('exchangeRate', exchangeRate)
  }
  const getColorFromAmount = (amount) => {
    if(amount == 0 ) return textPrimary
    return (amount > 0)?secondary:primary
  }
  const ItemPreviewCard = ({
    account: { name, currency, amount},
    previewChangeAmount
  }) => {
    return (
      <TagCard
        config={{containerHeight: 72}}
        virtualContainerStyle={style.previewCardContainerStyle}
        containerStyle={{backgroundColor: secondary, ...style.center}}
        mainElement={(<Text style={{color: white}}>{name}</Text>)}
        bottomVirtualContainerStyle={{flex: 0.5}}
        tagStyle={style.center}
        tagElement={(
          <Text style={{color: getColorFromAmount(previewChangeAmount)}}>
            {FormatCurrency(amount + previewChangeAmount, currency)}
          </Text>
        )}
        >
      </TagCard>
    )
  }
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
          if(!dirty) onAccountChange({
            to: true, account: toAccountList[0],
            setFieldValue
          })

          return (
            <Background>
              <View style={style.transactionPreviewContainer}>
                <ItemPreviewCard
                  account={fromAccount}
                  previewChangeAmount={-values.amount}
                />

                <Icon name='arrow-right' size={36} />
                <ItemPreviewCard
                  account={toAccount}
                  previewChangeAmount={values.amount * values.exchangeRate}
                />
              </View>
              <View style={style.summary}>
                <View>
                  <Text>
                    Total:
                  </Text>
                  <Text style={style.sum}>
                    {FormatCurrency(
                      values.amount * values.exchangeRate,
                      toAccount.currency
                    )}
                  </Text>
                </View>

              </View>

              <Card style={style.formContainer}>
                <TextInput
                  label="Transfer reason"
                  name="name"
                  iconName="tag"
                  iconColor={secondary}
                  inputStyle={{color: textPrimary}}
                  errors={errors}
                  values={values}
                  setFieldValue={setFieldValue}
                />

                <DropdownInput
                  disabled
                  selectedValue={values["from"]}
                  onValueChange={(account) => onAccountChange({
                    to: false,
                    account, setFieldValue})}
                  label="FROM"
                  iconSize={22}
                  iconStyle={{color: primary }}
                  icon="arrow-right"
                >
                </DropdownInput>

                <DropdownInput
                  selectedValue={values["to"]}
                  onValueChange={(account) => onAccountChange({
                    to: true,
                    account, setFieldValue
                  })}
                  label="TO"
                  iconSize={22}
                  iconStyle={{color: primary }}
                  icon="bank"
                >
                  {
                    toAccountList.map((acc,i) => (
                      <Picker.Item key={i} label={acc.name} value={acc} />
                    ))
                  }
                </DropdownInput>
                <TextInput
                  label={`Amount (${fromAccount.currency})`}
                  name="amount"
                  icon="money"
                  keyboardType="decimal-pad"
                  errors={errors}
                  values={values}
                  setFieldValue={setFieldValue}
                />
                <TextInput
                  name="exchangeRate"
                  label="Exchange Rate"
                  icon="refresh"
                  keyboardType="decimal-pad"
                  errors={errors}
                  values={values}
                  controlled={true}
                  setFieldValue={setFieldValue}
                />
              </Card>

              {/* Summary component */}

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
            </Background>
          )
        }
      }
    </Formik>
  )
}
