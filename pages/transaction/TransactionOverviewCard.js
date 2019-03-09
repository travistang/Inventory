import React from 'react'
import PropTypes from 'prop-types'
import TransactionModel from '../../models/transaction'
import { Transactions } from '../../models/transaction'
import AccountModel from '../../models/account'
import Card from '../../components/Card'
import {
  View, StyleSheet
} from 'react-native'
import { colors } from '../../theme'
import {
  Badge, Text
} from 'react-native-elements'
import moment from 'moment'
import { FormatCurrency } from '../../utils'
import Icon from 'react-native-vector-icons/dist/FontAwesome'

/*
  Display an overview given a transaction.
  Info displayed for each type of transactions are listed below:
  Buy:
    - money spent.
  Transfer:
    - from account.
    - to account.
    - amount.
  Craft:
    - from types of items
    - to types of items
  Sell:
    - name of items sold.
    - amount of items sold.
    - dollar obtained.
  Income:
    - amount of income.
  Consume:
    - number of types of food.
  spend
    - from account.
    - amount.

  For all of the types, name of transactions and the date are also displayed
*/
export default class TransactionCard extends React.Component {
  static propTypes = {
    // expect transaction to have the following structure:
    transaction: PropTypes.shape({
        name: PropTypes.string.isRequired,
        date: PropTypes.instanceOf(Date),
        from: PropTypes.string,
        to: PropTypes.string,
        consumedAmount: PropTypes.number,
        obtainedAmount: PropTypes.number,
        type: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
            cost: PropTypes.number
          })
        )
      }).isRequired,
    containerStyle: PropTypes.object
  }
  getLeftContainer({ name, date, type }) {
    return (
      <View style={style.subContainer}>
        <View style={style.subsubContainer}>
          <Text style={style.name}>
            {name}
          </Text>
        </View>
        <View style={style.subsubContainer}>
          <Text style={style.date}>
            {moment(date).format("DD/MM/YYYY HH:mm")}
          </Text>
        </View>
      </View>
    )
  }
  /*
    The right part of a transaction card.
    This depends on the type of the transaction
  */
  getRightContainer({
    from, to, items, type,
    consumedAmount, obtainedAmount,
  }) {
    const {
      BUY, TRANSFER, CRAFT,
      SELL, INCOME, CONSUME, SPEND
    } = Transactions.TransactionTypes
    let content
    // get currency info of the accounts involved in this transaction
    const {
      fromAccount, toAccount
    } = this.state
    const fromCurrency = fromAccount && fromAccount.currency || ""
    const toCurrency = toAccount && toAccount.currency || ""
    const numItems = items && items.length || 0
    switch(type) {
      case BUY:
        content = (
          <Text style={{...style.buy, ...style.amountString}}>
            -{FormatCurrency(consumedAmount,fromCurrency)}
          </Text>
        )
        break
      case CONSUME:
        content = (
          <Text style={style.amountString}>
            {`${numItems} item(s)`}
          </Text>
        )
        break
      case TRANSFER:
        content = (
          <View style={style.transferContainer}>
            <Text style={style.amountString}>
              {FormatCurrency(obtainedAmount, toCurrency)}
            </Text>
          </View>
        )
        break
      default:
        break
    }
    return (
      <View style={{...style.subContainer}}>
        <View style={{...style.subsubContainer, ...style.rightContainer}}>
          <Badge value={type} />
        </View>
        <View style={{...style.subsubContainer, ...style.rightContainer}}>
          {content}
        </View>
      </View>
    )
  }
  loadAccountInfo() {
    const { from, to } = this.props.transaction
    if(from) {
      AccountModel.getAccountById(from).then(ac => {
        this.setState({ fromAccount: ac })
      })
    }
    if(to) {
      AccountModel.getAccountById(to).then(ac => {
        this.setState({ toAccount: ac })
      })
    }
  }
  constructor(props) {
    super(props)

    this.state = {
      fromAccount: null,
      toAccount: null,
    }
  }
  // load the account info and put it to
  componentDidMount() {
    this.loadAccountInfo()
  }
  render() {
    const {
      name, date,
      from, to,
      consumedAmount, obtainedAmount,
      transactionType: type,
      items
    } = this.props.transaction
    // determine
    return (
      <Card style={style.card}>
        <View style={style.container}>
          {this.getLeftContainer({
            name, date, type
          })}
          {
            this.getRightContainer({
              type,
              from, to, items, consumedAmount, obtainedAmount
            })
          }
        </View>
      </Card>
    )
  }
}
const {
  textPrimary, textSecondary,
  primary, danger,
  white } = colors
const style = StyleSheet.create({
  card: {
    margin: 16,
  },
  container: {
    margin: 8,
    padding: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  subContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  subsubContainer: {
    flex: 1,
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  transferContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  name: {
    color: textPrimary,
    fontWeight: 'bold'
  },
  date: {
    color: textSecondary,
    fontWeight: 'bold'
  },
  amountString: {
    color: textPrimary,
    fontWeight: 'bold'
  },
  buy: {
    color: 'red',
  }
})
