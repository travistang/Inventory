import React from 'react'
import {
  Text
} from 'react-native-elements'
import {
  View,
  StyleSheet,
  ToastAndroid
} from 'react-native'
import AddIncomeForm from '../../forms/addIncome'
import AccountModel from '../../models/account'
import TransactionModel from '../../models/transaction'
/*
  Although it is named as "Add Income page",
  this page also records expenditure!
*/
export default class AddIncomePage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const account = navigation.getParam('account')
    const isIncome = navigation.getParam('income')
    if(!account) return { }
    return {
      title: `Add ${isIncome?"income":"expenditure"} to ${account.name}`
    }
  }
  constructor(props) {
    super(props)

    this.state = {
      accountList: [],
      accountId: null
    }

    AccountModel.getAccounts()
      .then(accountList => {
        this.setState({accountList})
      })
  }
  getGivenAccountId() {
    let accountId = null
    const account = this.props.navigation.getParam('account')
    if(account) {
      accountId = account._id
    }
    return accountId
  }
  async onAddIncome(form) {
    const {
      name,
      to: accountId,
      obtainedAmount: amount
    } = form
    const isIncome = this.props.navigation.getParam('income')
    const finalAmount = isIncome?amount:-amount
    const result = await TransactionModel.income({
      name, accountId, amount: finalAmount
    })
    let message = result?
      "Change saved":
      "Failed to save changes."
    ToastAndroid.show(
      message,
      ToastAndroid.SHORT
    )
    this.props.navigation.pop()
  }

  render() {
    const {
      accountList
    } = this.state
    return (
      <View style={style.container}>
        <AddIncomeForm
          accountList={accountList}
          accountId={this.getGivenAccountId()}
          onSubmit={this.onAddIncome.bind(this)}
        />
      </View>
    )
  }
}
const style = StyleSheet.create({
  container: {
    margin: 16
  }
})
