import React from 'react'
import {
  StyleSheet,
  View,
  ToastAndroid
} from 'react-native'
import TransferForm from '../../forms/transfer'
import AccountModel from '../../models/account'
import TransactionModel from '../../models/transaction'
import Background from '../../components/Background'
import { AccountHeaderConfig } from '../../utils'

export default class TransferPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const account = navigation.getParam('account')
    const title = account? `Transfer from ${account.name}`: 'Transfer'
    return AccountHeaderConfig({ title })
  }
  constructor(props) {
    super(props)
    this.state = {
      accountList : [],
      fromAccount: null
    }
  }
  componentDidMount() {
    this.fetchAccountList()
    this.setState({
      fromAccount: this.props.navigation.getParam('account')
    })
  }
  fetchAccountList() {
    return AccountModel.getAccounts()
      .then(accountList => {
        if(accountList.length < 0) {
          ToastAndroid.show(
            "Cannot transfer with just one account.",
            ToastAndroid.SHORT
          )
          this.props.navigation.pop()
        }
        this.setState({ accountList })
      })
  }
  async transfer(form) {
    const {
      name, exchangeRate,
      from: fromAccountId,
      to: toAccountId,
      amount,
    } = form
    const result = await TransactionModel.transfer({
      name,
      exchangeRate, amount,
      fromAccountId, toAccountId
    }) //.....
    if (result) {
      ToastAndroid.show("Transfer success",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM)
      this.props.navigation.pop() // return to previous page
    } else {
      ToastAndroid.show("Transfer failed",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM)
    }
  }
  render() {
    const {
      fromAccount
    } = this.state

    if(!fromAccount) return null

    return (
      <Background style={style.container}>
        <TransferForm
          {...this.state}
          onSubmit={this.transfer.bind(this)}
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
