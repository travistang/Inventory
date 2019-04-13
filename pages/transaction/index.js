import React from 'react'
import PropTypes from 'prop-types'

import {
  StyleSheet, View, ScrollView,
  RefreshControl,
  TouchableOpacity
} from 'react-native'
import {
  Text,
  Button
} from 'react-native-elements'

import {
  Background,
  Card,
  HeaderComponent,
  TransactionCalendarView,
  TransactionList,
  SpendIncomeBanner
} from '../../components'

import { withNavigation } from 'react-navigation'
import ExportRecordOverlay from './exportRecordOverlay'

import TransactionModel from '../../models/transaction'
import { exportDB } from '../../models'

import moment from 'moment'

import {
  CommonHeaderStyle
} from 'utils'

class TransactionPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const setState = navigation.getParam("setState")

    if(!setState) return {} // no setState function, header is not ready

    return {
        headerStyle: CommonHeaderStyle,
        headerTitle: (
          <HeaderComponent
            title="transactions"
            icon="exchange"
          />
      ),
      headerRight: (
        <Button
          type="clear"
          onPress={() => setState({ isExportDialogOpen: true })}
          icon={{name: "share"}}
        />
      )
    }
  }
  constructor(props) {
    super(props)

    // number of records to show
    this.numRecords = 10

    this.state = {
      // transaction of the MONTH
      transactions: [],

      // flag for toggling export dialog
      isExportDialogOpen: false,

      monthSelected: moment(),
      daySelected: null,
    }
  }

  componentDidMount() {
    // deliver the "setState" function to the header
    this.props.navigation.setParams({
      setState: this.setState.bind(this)
    })

    this.fetchTransactionOfMonth(null)
  }

  onExportRecordOverlayClose() {
    this.setState({isExportDialogOpen: false})
  }

  onDaySelected(daySelected) {
    this.setState({
      daySelected
    })
  }
  // when months are fetched, reset the selected day
  async fetchTransactionOfMonth(month = moment()) {
    // since the month given by the calendar component is one month behind,
    // subtract the differences if months are provided (which must be from the calendar)
    const finalMonth =
      month?moment(month)
        .startOf('month').add(-1, 'months'):moment()

    this.setState({
      monthSelected: finalMonth,
      daySelected: null
    })

    const transactions = await TransactionModel.getTransactionOfMonthOfDate(finalMonth)
    this.setState({
      transactions
    })

  }
  transactionListTitle() {
    const { daySelected } = this.state
    const dateString = moment(daySelected).format('YYYY-MM-DD')
    return `Transaction on ${dateString}`.toUpperCase()
  }
  getSelectedTransactions() {
    const { transactions, daySelected } = this.state
    if(!daySelected) return transactions
    return transactions.filter(({date}) =>
      moment(date).isSame(moment(daySelected), 'day'))
  }
  render() {
    const {
      transactions,
      isExportDialogOpen,
      daySelected
    } = this.state
    const transactionsOfDay = this.getSelectedTransactions()
    return (
      <Background>
        <ExportRecordOverlay
          isOpen={isExportDialogOpen}
          onClose={this.onExportRecordOverlayClose.bind(this)}
        />
        <SpendIncomeBanner
          transactions={transactionsOfDay}
        />
        <TransactionCalendarView
          transactionsOfMonth={transactions}
          onDaySelected={this.onDaySelected.bind(this)}
          selectedDays={[daySelected]}
          onMonthChanged={this.fetchTransactionOfMonth.bind(this)}
        />
        {
          daySelected && (
            <TransactionList
              title={this.transactionListTitle()}
              icon="exchange"
              style={style.transactionList}
              transactions={transactionsOfDay}
            />
          )
        }


      </Background>
    )
  }
}

export default withNavigation(TransactionPage)

const style = StyleSheet.create({
  transactionList: {
    marginHorizontal: 16,
  }
})
