import React from 'react'
import {
  Button,
  Card,
  ListItem,
  Overlay,
  Text
} from 'react-native-elements'

import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  View, TouchableOpacity
} from 'react-native'
import CenterNotice from '../../components/CenterNotice'
import * as _ from 'lodash'
import PropTypes from 'prop-types'
import AccountCard from './AccountCard'
import AccountModel from '../../models/account'
import TransactionModel from '../../models/transaction'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import { FormatCurrency } from '../../utils'
import ActionBox from '../../components/ActionBox'
import AccountTrendLine from '../../components/AccountTrendLine'

import LineChart from 'react-native-responsive-linechart'

export default class AccountDetailsPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const account = navigation.getParam('account')
    if(!account) return {}
    return {
      headerTitle: account.name,
    }
  }
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      transactions: [],
      account: null
    }
    props.navigation.addListener('didFocus',
      this.componentDidFocus.bind(this)
    )
  }
  componentDidFocus() {
    this.reloadAccountInfo()
  }

  reloadAccountInfo() {
    const { account } = this.state
    if(!account) return
    AccountModel.getAccountById(account._id)
      .then(acc => {
        this.setState({account: acc})
      })
  }
  componentDidMount() {
    const account = this.props.navigation.getParam('account')
    this.setState({
      account
    },() => {
      this.fetchAccountTransactions()
    })
  }
  fetchAccountTransactions() {
    const { account } = this.state
    if(!account) return

    TransactionModel.getTransactionsOfAccount(account)
      .then(transactions => {
        this.setState({ transactions })
      })
  }
  // push to next pages
  addIncome() {
    this.props.navigation.push("AddIncomePage", {
      account: this.state.account,
      income: true
    })
  }
  addSpend() {
    this.props.navigation.push("AddIncomePage", {
      account: this.state.account,
      income: false
    })
  }

  addTransfer() {
    this.props.navigation.push("TransferPage", {
      account: this.state.account,
    })
  }
  buy() {
    this.props.navigation.push("BuyPage", {
      account: this.state.account
    })
  }
  buttonGroup() {
    return (
      <View style={style.buttonGroup}>
        <View style={style.buttonGroupItem}>
          <ActionBox
            icon="money"
            text="Income"
            onPress={this.addIncome.bind(this)}
            color="green"
          />
        </View>
        <View style={style.buttonGroupItem}>
          <ActionBox
            icon="exchange"
            text="Transfer"
            onPress={this.addTransfer.bind(this)}
            color="brown"
          />
        </View>
        <View style={style.buttonGroupItem}>
          <ActionBox
            icon="fire"
            text="Spend"
            onPress={this.addSpend.bind(this)}
            color="red"
          />

        </View>
        <View style={style.buttonGroupItem}>
          <ActionBox
            icon="shopping-cart"
            text="Buy"
            onPress={this.buy.bind(this)}
            color="grey"
          />
        </View>
      </View>
    )
  }
  getCurrencyStyle(amount) {
    let color = 'gray'
    if(amount < 0) color = 'red'
    if(amount > 0) color = 'green'
    return {
      color
    }
  }
  getAccountTransactionsList() {
    const { transactions } = this.state
    if(_.isEmpty(transactions)) {
      return (
        <CenterNotice
          title="There are no transactions from this account"
        />
      )
    } else {
      return transactions.map((tran, i) => {
        const { name, currency, amount } = tran
        return (
          <ListItem key={i} title={name}
            subtitle={FormatCurrency(amount, currency)}
            subTitleStyle={this.getCurrencyStyle(amount)}
          />
        )
      })
    }
  }

  render() {
    const {
      transactions,
      account,
    } = this.state

    if(!account) return null

    const { amount, currency } = account

    return (
      <ScrollView>
        {/* Summary component, which is not in a card*/}
        <View style={style.summary}>
          <View style={style.monetary}>
            <Text h3 style={style.monetaryText}>
              {FormatCurrency(amount, currency)}
            </Text>
          </View>
          <View style={style.trendContainer}>
            <AccountTrendLine
              account={account} numData={20}
            />
          </View>
        </View>

        <Card title="Actions">
          {
            this.buttonGroup()
          }
        </Card>

      </ScrollView>
    )
  }
}

const style = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    marginVertical: 8,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },
  buttonGroupItem: {
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8
  },
  actionButton: {
    margin: 8,
    flex: 1
  },
  transactionListContainer: {
    margin: 16,
  },
  summary: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  monetary: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  monetaryText: {
    fontWeight: 'bold'
  },

  trendContainer: {
    flex: 2
  }
})
