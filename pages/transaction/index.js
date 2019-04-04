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
  TransactionList
} from '../../components'

import { withNavigation } from 'react-navigation'
import ExportRecordOverlay from './exportRecordOverlay'

import TransactionModel from '../../models/transaction'
import { exportDB } from '../../models'

import moment from 'moment'

import {
  CommonHeaderStyle
} from '../../utils'

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
      month?moment(month).add(-1, 'months'):moment()

    this.setState({
      monthSelected: finalMonth,
      daySelected: null
    })

    const transactions = await TransactionModel.getTransactionOfMonthOfDate(finalMonth)
    this.setState({
      transactions
    })

  }
  render() {
    const { transactions, isExportDialogOpen } = this.state
    return (
      <Background>
        <ExportRecordOverlay
          isOpen={isExportDialogOpen}
          onClose={this.onExportRecordOverlayClose.bind(this)}
        />

        <TransactionCalendarView
          transactionsOfMonth={transactions}
          onDaySelected={this.onDaySelected.bind(this)}
          onMonthChanged={this.fetchTransactionOfMonth.bind(this)}
        />

        <TransactionList
          style={style.transactionList}
          transactions={transactions}
        />
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
