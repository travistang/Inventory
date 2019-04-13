import React from 'react'
import PropTypes from 'prop-types'
import ItemModel, { Item } from 'models/items'
import { Transactions } from 'models/transaction'
const { BUY, CONSUME } = Transactions.TransactionTypes
import Component, { navigationOptions } from './component'
import moment from 'moment'
/*
  Container for the details page of and Item.
  it takes an Item, derives properties, and forward the results to the component class to render.
*/
export default class ItemDetailsPageContainer extends React.Component {
  static propTypes = PropTypes.shape({
    item: Item.propTypes.isRequired,
  })

  static navigationOptions = navigationOptions

  constructor(props) {
    super(props)
    this.state = {
      item: null,
      trendLineData: [],
      trendLineMin: 0,
      consumptionFrequency: [],
      refillInterval: 0,
      averageCost: 0,
      averageBuyAmount: 0,
      averageConsumeAmount: 0,
    }
  }
  /*
    Given the name of an item,
    return a list of transaction with shape
    [{
      ...transaction,
      item
    }]
  */
  async getRelevantTransactionsForItem(item) {
    const transactions = await ItemModel.getTransactionsOfItems(item, 100)
    return transactions.map(({ items = [], ...trans}) => ({
      ...trans,
      // this cannot be undefined since it is chosen by the database
      item: items.filter(({name}) => name === item.name)[0]
    }))
  }
  getAverageCost(buyTransactions, numTransactions) {
    return buyTransactions
      .map(({ item: { cost }}) => cost) // take out the cost
      // sum over the cost, and divide by total number of transactions
      .reduce((totalCost, cost) => totalCost + (cost || 0), 0) / numTransactions

  }
  getAverageBuyAmount(buyTransactions, numTransactions) {
    const totalBuyAmount = buyTransactions
      .map(({ item: { amount }}) => amount)
      .reduce((totalAmount, amount) => (totalAmount + (amount || 0)), 0)
    // alert(`average buy amount: ${res}`)
    return totalBuyAmount / numTransactions
  }
  getAverageConsumeAmount(consumeTransactions, numTransactions) {
    return this.getAverageBuyAmount(consumeTransactions, numTransactions)
  }
  // definition of refill period: average number of days between two "BUY" events involving this item.
  getRefillPeriod(buyTransactions, numTransactions) {
    const totalDateInterval = buyTransactions
      .map(({date}) => moment(date).startOf('day'))
      .map((curDate, i, dates) => (
        // next thing would be difference between this event and the next one, in days,
        // if this is the last one, then this is the number of days await from today
        (dates[i - 1] || moment()).diff(curDate, 'days')
      ))
      .reduce((totalDates, dateDiff) => totalDates + dateDiff, 0)

    return totalDateInterval / numTransactions
  }
  getTrendLineData(transactionsOfItems, { itemName, currentAmount }) {
    try {
      const amountHistory = transactionsOfItems
        // get the signed differences of the amount of the item in each transaction
        .map(({transactionType: type, item: { amount, originalAmount }}) =>
          // this is to recover the previous amount of such item before this transaction
          // if it is a "buy", then the amount should be less than this before this transaction by "amount"
          // and so on...
          // originalAmount || 0
          (type == BUY)?(-amount):(amount)
        )
        // get the cumulative sum
        .reduce((hist, diff) => ([
          ...hist,
          hist[hist.length - 1] + diff
        ]), [currentAmount])
        .reverse()
      const max = amountHistory.reduce((max, hist) => (hist > max)?hist:max, 0)
      const min = amountHistory.reduce((min, hist) => (hist < min)?hist:min, max)
      return {trendLineData: amountHistory, max, min}

    } catch(err) {
      alert(err.message)
      return {trendLineData: [], min: 0, max: 0}
    }
  }

  getConsumptionFrequency(consumeTransactions) {
    const count = consumeTransactions
      .map(({date}) => moment(date).format('YYYY-MM-DD'))
      .reduce((data, dateString) =>
        ({
          ...data,
          [dateString]: (data.dateString || 0) + 1
        }), {})
    return Object.keys(count).map(dateString => ({
      date: dateString,
      count: count[dateString]
    }))
  }

  getBuyFrequency(buyTransactions) {
    const count = buyTransactions
      .map(({date}) => moment(date).format('YYYY-MM-DD'))
      .reduce((data, dateString) =>
        ({
          ...data,
          [dateString]: (data.dateString || 0) + 1
        }), {})
    return Object.keys(count).map(dateString => ({
      date: dateString,
      count: count[dateString]
    }))
  }

  // acquire item object from navigation, and put it to the state
  async componentDidMount() {
    const item = this.props.navigation.getParam('item')
    const transactionsOfItems = await this.getRelevantTransactionsForItem(item)
    // aggregate data here and pass as props to the UI
    const { min: trendLineMin, trendLineData } =
      await this.getTrendLineData(
        transactionsOfItems,
        { itemName: item.name, currentAmount: item.amount }
      )
    const buyTransactions = transactionsOfItems.filter(({transactionType: type}) => type === BUY)
    const numBuyTransactions = buyTransactions.length || 1 // so that it does not divide by 0

    const consumeTransactions = transactionsOfItems.filter(({transactionType: type}) => type === CONSUME)
    const numConsumeTransactions = consumeTransactions.length || 1

    this.setState({
      item,
      trendLineMin, trendLineData,
      consumptionFrequency: this.getConsumptionFrequency(consumeTransactions),
      buyFrequency: this.getBuyFrequency(buyTransactions),
      averageCost: this.getAverageCost(buyTransactions, numBuyTransactions).toFixed(2),
      refillInterval: this.getRefillPeriod(buyTransactions, numBuyTransactions).toFixed(2),
      averageBuyAmount: this.getAverageBuyAmount(buyTransactions, numBuyTransactions),
      averageConsumeAmount: this.getAverageConsumeAmount(consumeTransactions, numConsumeTransactions),
    })
  }
  render() {
    const { item } = this.state
    // if component is not ready...
    if(!item) return null

    return (
      <Component
        {...this.state}
      />
    )
  }
}
