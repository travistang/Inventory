import React from 'react'
import PropTypes from 'prop-types'
import { TransactionPropTypes } from 'utils'
import { Transactions } from 'models/transaction'
import AccountModel from 'models/account'
import Component from './SpendIncomeBanner'

const {
  BUY, SPEND, INCOME, TRANSFER
} = Transactions.TransactionTypes

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
      currencies: [],
      // indicate the exchange rate has failed to fetch
      hasError: false
    }

  }
  componentDidUpdate(prevProps, prevState) {
    const currencies = this.getSetOfCurrencies()
    if(!_.isEqual(prevState.currencies, currencies)) {
      this.setState({ currencies })
    }
  }
  /*
    Get set of currencies exists in the given transaction list
  */
  getSetOfCurrencies() {
    const curList = this.props.transactions.map(({
      from, to
    }) => ([from && from.currency, to && to.currency])) // extract currency from each transactions
    .reduce((curs, diffCur) => ([...curs, ...diffCur]), []) // concat list
    .filter(cur => !!cur) // remove null

    return _.uniq(curList)

  }

  getTotalExpenditures(targetCurrency) {
     const expenditureTypes = [BUY, SPEND]
     return this.props.transactions
      .filter(
       ({
         transactionType: type,
         from, to
       }) => (
         _.includes(expenditureTypes, type)
          && targetCurrency == ((from || to || {currency: null}).currency)
       ))
      .reduce((sum, { consumedAmount }) => (
          sum + consumedAmount
        ), 0
      )
  }

  getTotalIncome(targetCurrency) {
    const incomeTypes = [INCOME]

    return this.props.transactions
      .filter(({
        transactionType: type,
        from
      }) => _.includes(incomeTypes, type) && targetCurrency == (from && from.currency))
      .reduce((sum, { consumedAmount }) => sum + consumedAmount, 0.0)
  }
  toNextCurrency() {
    const { currencyIndex: i, currencies} = this.state
    const numCurrencies = currencies.length
    this.setState({
      // cyclic display of currencies
      currencyIndex: ((i + 1) % numCurrencies) || 0
    })
  }
  render() {
    const {currencyIndex, currencies} = this.state
    const currency = currencies[currencyIndex]
    const expenditure = this.getTotalExpenditures(currency)
    const income = this.getTotalIncome(currency)

    return (
      <Component
        expenditure={expenditure}
        income={income}
        currency={currency}
        onPress={this.toNextCurrency.bind(this)}
      />
    )
  }
}
