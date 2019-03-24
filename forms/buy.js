import React from 'react'
import PropTypes from 'prop-types'
import {
  Formik,

} from 'formik'
import {
  View, StyleSheet,
  Picker,
  Text, ScrollView,
} from 'react-native'
import {
  Button
} from 'react-native-elements'
import {
  FormatCurrency
} from '../utils'
import * as Yup from 'yup'
import * as _ from 'lodash'
import AccountModel from '../models/account'
import ItemsInput from '../components/ItemsInput'
import TextInput from '../components/TextInput'
import { NavigationEvents } from "react-navigation"
import Card from '../components/Card'
import AccountCard from '../components/AccountCard'
import DropdownInput from '../components/DropdownInput'
import Background from '../components/Background'
import { colors } from '../theme'
const { background, white, primary, secondary } = colors
/*
  Component that represents the form of buying stuff
*/
export default class BuyForm extends React.Component {
  static propTypes = {
    onBuy: PropTypes.func.required,
    account: PropTypes.object
  }
  constructor(props) {
    super(props)
    this.state = {
      accounts: [],
    }
    // add an reference to the items input element of this form
    this.itemInputRef = React.createRef()
  }
  initialValues() {
    const { account } = this.props
    const { accounts: accountList } = this.state
    return {
      // if there's an preset account, set the ID of it as the form value
      //  , otherwise return null
      fromAccount: (account && account._id ) ||
        (accountList.length && accountList[0]._id) || null,
      name: "",
      date: new Date(),
      items: []
    }
  }
  validationSchema() {
    return Yup.object().shape({
      items: Yup.array().required().of(
        Yup.object().shape({
          name: Yup.string().required(),
          amount: Yup.number().moreThan(0).required(),
          cost: Yup.number().moreThan(0).required()
        })
      ),
      name: Yup.string().required(),
      date: Yup.date().required(),
      fromAccount: Yup.string().required()
    })
  }
  // an async - free temporary method for retrieving the account back given the ID
  getAccountById(id) {
    return this.state.accounts
      .filter(acc => acc._id == id)[0]
  }
  loadAccountList() {
    AccountModel.getAccounts().then(accounts => {
      this.setState({ accounts })
    })
  }
  clearItems() {
    this.setState({ items: [] },
      () => this.itemInputRef.current.clearItems()
    )
  }
  render() {
    const { accounts } = this.state
    const { account: presetAccount } = this.props
    return (
      <Formik
        enableReinitialize
        validationSchema={this.validationSchema()}
        initialValues={this.initialValues()}
      >
      {
        ({
          values, errors,
          setFieldValue,
          isSubmitting, dirty,
          resetForm
        }) => {
          const account = presetAccount || this.getAccountById(values["fromAccount"])
          // set the account value to the first one in the list since it is not ready
          if(!account) {
            if(accounts.length) {
              setFieldValue('fromAccount', accounts[0]._id)
            }
          }
          const totalCost = values['items'].reduce((sum, item) => sum + item.cost, 0.0)

          return (
            <View style={style.container}>
              <View>
                <NavigationEvents
                  onWillFocus={this.loadAccountList.bind(this)}
                />
                <View style={style.accountPreviewRow}>
                  {
                    account && (
                      <AccountCard account={account} previewChangeAmount={-totalCost} />
                    )
                  }
                </View>
                <Card style={style.formCard}>
                  {
                    !presetAccount && (
                      <View style={style.accountInputRow}>
                        <DropdownInput
                          label="Account"
                          icon="bank"
                          onValueChange={(acc) => setFieldValue("fromAccount", acc)}
                          selectedValue={values["fromAccount"]}>
                          {
                            accounts.map((acc, i) => (
                              <Picker.Item key={i} label={acc.name} value={acc._id} />
                            ))
                          }
                        </DropdownInput>
                      </View>

                    )
                  }
                  <TextInput label="Name"
                    name="name"
                    errors={errors}
                    values={values}
                    iconName="tag"
                    setFieldValue={setFieldValue}
                  />
                </Card>

                <View style={{margin: 16 }}>
                  <ItemsInput
                    ref={this.itemInputRef}
                    isBuying={true}
                    account={this.getAccountById(values["fromAccount"])}
                    onFinishSelection={
                      (items) => setFieldValue("items", items)
                    }
                  />
                </View>
              </View>

              {
                account && (
                  <View style={style.buyButtonContainer}>
                    <View style={style.totalTextContainer}>
                      <Text style={style.totalLabel}>Total</Text>
                      <Text style={style.totalAmountLabel}>
                        {FormatCurrency(totalCost, account.currency)}
                      </Text>
                    </View>
                    <View style={style.buyButtonInnerContainer}>
                      <Button
                        disabled={_.isEmpty(values["items"])}
                        onPress={() => this.buy({values, resetForm})}
                        icon={{name: "shopping-cart" }}
                        title="Buy"
                      />
                    </View>
                  </View>
              )}

            </View>

          )
        }
      }
    </Formik>
    )
  }

  // trigger the buy action
  buy({values, resetForm}) {
    // reset the form after it is bought
    this.props.onBuy(values)
      .then(() => resetForm({}))
      .then(() => this.clearItems())

  }
}

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
  formCard: {
    padding: 16
  },
  totalTextContainer: {
    padding: 8,
    flexDirection: 'column'
  },
  totalLabel: {
    // color: secondary,
    color: primary,
  },
  totalAmountLabel: {
    // color: secondary,
    color: primary,
    fontSize: 28
  },
  accountInputRow: {
    marginHorizontal: 8
  },
  accountPreviewRow: {
    flexDirection: 'row' ,
    justifyContent: 'center',
    alignItems: 'center'
  },
  // stick with the bottom of the container, and put it above everything
  buyButtonContainer: {
    // zIndex: 200,
    // height: 72,
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 72,
    alignItems: 'center',
    justifyContent: 'space-between',
    // position: 'fixed',
    // backgroundColor: background,
    // left: 0,
    // right: 0,
    // bottom: 0,
  },
  mainContainer: {
    // height: 100,
  },
  buyButtonInnerContainer: {
    flex: 1,
    alignItems: 'center'
  }

})
