import React from 'react'
import {
  View, StyleSheet,
  TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'
import { TransactionPropTypes, FormatCurrency } from '../utils'
import { Transactions } from '../models/transaction'
import { colors } from '../theme'
import AccountModel from '../models/account'

const { background, primary, secondary } = colors
const { BUY, SPEND, INCOME } = Transactions.TransactionTypes

import * as _ from 'lodash'

export default class SpendIncomeBanner extends React.Component {
  static defaultProps = {
    transactions: []
  }
  static propTypes = {
    transactions: PropTypes.arrayOf(TransactionPropTypes)
  }
  constructor(props) {
    super(props)
    this.state = {
      currencyIndex: 0,
      currencies: []
    }
  }
  componentDidMount() {
    const currencies = this.getSetOfCurrencies()
    this.setState({ currencies })
  }

  /*
    Get set of currencies exists in the given transaction list
  */
  getSetOfCurrencies() {
    const curList = this.props.transactions.map(({
      from: {currency: fromCurrency},
      to: { currency: toCurrency }
    }) => ([fromCurrency, toCurrency])) // extract currency from each transactions
    .reduce((curs, diffCur) => ([...curs, ...diffCur]), []) // concat list
    .filter(cur => !!cur) // remove null
    return _.uniq(curList)
  }

  getTotalExpenditures() {
     const expenditureTypes = [BUY, SPEND]
     const { currencies, currencyIndex: index } = this.state
     if(currencies.length == 0) return 0

     const targetCurrency = currencies[index]
     const exchangeRate = AccountModel.exchangeRate[targetCurrency]

     const totalInBaseCurrency = this.props.transactions.filter(
       ({transactionType: type}) => type in expenditureTypes)
       .reduce((sum, ({consumedAmount, currency})) => (
         sum + consumedAmount / (AccountModel.exchangeRate[currency] || 1)
       ), 0)

     return totalInBaseCurrency * targetCurrency
  }
  toNextCurrency() {
    const { currencyIndex: i, currencies} = this.state
    const numCurrencies = currencies.length
    this.setState({
      // cyclic display of currencies
      currencyIndex: ((i + 1) % numCurrencies) || 0
    })
  }
  cell({icon, title, color, figure }) {
    const style = StyleSheet.create({
      cell: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      },
      figure: {
        color,
        fontSize: 22,
        flex: 1,
      },
      iconText: {
        flexDirection: 'row'
      },
      title: {
        color,
        fontSize: 14,
      },
      icon: {
        color,
        fontSize: 14
      }
    })
    return (
      <View style={style.cell}>
        <Text style={style.figure}>
          {figure}
        </Text>
        <View stryle={style.iconText}>
          <Icon name={icon} style={style.icon} />
          <Text style={style.title}>
            {title.toUpperCase()}
          </Text>
        </View>
      </View>
    )
  }
  render() {
    const expenditure = this.getTotalExpenditures()
    const {currencyIndex, currencies} = this.state
    const currency = currencies[currencyIndex]
    return (
      <TouchableOpacity
        onPress={this.toNextCurrency.bind(this)}
        style={style.container}>

        {this.cell({
          icon: 'burn',
          title: "expenditure",
          color: primary,
          figure: FormatCurrency(expenditure, currency)
        })}

        {
          this.cell({
            icon: 'money',
            title: "income",
            color: secondary,
            figure: FormatCurrency(expenditure, currency)
          })
        }
      </TouchableOpacity>
    )
  }
}

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  }
})
