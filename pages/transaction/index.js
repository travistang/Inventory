import React from "react"
import PropTypes from "prop-types"

import { withNavigation } from "react-navigation"

import TransactionModel from "models/transaction"
import { exportDB } from "models"
import { ToastAndroid } from "react-native"

import moment from "moment"
import axios from "axios"
import Component, { navigationOptions } from "./component"

class TransactionPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const setState = navigation.getParam("setState")

    if (!setState) return {} // no setState function, header is not ready
    return navigationOptions({ navigation, setState })
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
      isImportDialogOpen: false,

      monthSelected: moment(),
      daySelected: null,
      availableSnapshots: [],

      serverURL: ""
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
    this.setState({ isExportDialogOpen: false })
  }
  onImportRecordOverlayClose() {
    this.setState({ isImportDialogOpen: false })
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
    const finalMonth = month
      ? moment(month)
          .startOf("month")
          .add(-1, "months")
      : moment()

    this.setState({
      monthSelected: finalMonth,
      daySelected: null
    })

    const transactions = await TransactionModel.getTransactionOfMonthOfDate(
      finalMonth
    )
    this.setState({
      transactions
    })
  }

  transactionListTitle() {
    const { daySelected } = this.state
    const dateString = moment(daySelected).format("YYYY-MM-DD")
    return `Transaction on ${dateString}`.toUpperCase()
  }

  getSelectedTransactions() {
    const { transactions, daySelected } = this.state
    if (!daySelected) return transactions
    return transactions.filter(({ date }) =>
      moment(date).isSame(moment(daySelected), "day")
    )
  }

  async fetchAvailableListOfRecords(url) {
    try {
      const {
        data: { files: availableSnapshots }
      } = await axios.get(`${url}/import`)

      this.setState({ availableSnapshots })
    } catch (err) {
      // this is likely because of network problem etc.
      ToastAndroid.show(
        "Unable to fetch list of snapshots.",
        ToastAndroid.SHORT
      )

      this.setState({
        availableSnapshots: []
      })
    }
  }

  async onSnapshotSelected(snapshot) {
    const { data } = await axios.get(`${url}`)
    alert(JSON.stringify(data))
  }

  onServerURLChange(url) {
    this.setState({ serverURL: url })
  }

  render() {
    const transactionsOfDay = this.getSelectedTransactions()
    const transactionListTitle = this.transactionListTitle()

    return (
      <Component
        {...this.state}
        transactionListTitle={transactionListTitle}
        transactionsOfDay={transactionsOfDay}
        fetchAvailableListOfRecords={this.fetchAvailableListOfRecords.bind(
          this
        )}
        fetchTransactionOfMonth={this.fetchTransactionOfMonth.bind(this)}
        onDaySelected={this.onDaySelected.bind(this)}
        onSnapshotSelected={this.onSnapshotSelected.bind(this)}
        onExportRecordOverlayClose={this.onExportRecordOverlayClose.bind(this)}
        onImportRecordOverlayClose={this.onImportRecordOverlayClose.bind(this)}
        onServerURLChange={this.onServerURLChange.bind(this)}
      />
    )
  }
}

export default withNavigation(TransactionPage)
