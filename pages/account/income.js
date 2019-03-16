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
import Background from '../../components/Background'
import {
  AccountHeaderConfig
} from '../../utils'
/*
  Although it is named as "Add Income page",
  this page also records expenditure!
*/
export default class AddIncomePage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const account = navigation.getParam('account')
    const isIncome = navigation.getParam('income')
    if(!account) return { }
    return AccountHeaderConfig({
      title: isIncome?"income":"expenditure"
    })
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
    const isIncome = this.props.navigation.getParam('income')
    return (
      <Background style={style.container}>
        <AddIncomeForm
          isIncome={isIncome}
          accountList={accountList}
          accountId={this.getGivenAccountId()}
          onSubmit={this.onAddIncome.bind(this)}
        />
      </Background>
    )
  }
}
const style = StyleSheet.create({
  container: {
    padding: 16
  }
})
