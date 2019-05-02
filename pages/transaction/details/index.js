import React from "react"
import DetailsHeaderSection from "./detailsHeader"
import PropTypes from "prop-types"
import { View, StyleSheet, Text, TouchableOpacity } from "react-native"

import {
  TransactionPropTypes,
  CommonHeaderStyle,
  FormatItemAmount
} from "utils"
import {
  HeaderComponent,
  ItemCard,
  Background,
  ContentCard,
  AccountCard,
  LocationPreviewCard,
  Icon
} from "components"

import AccountModel from "models/account"
import {
  Transactions,
  Transaction as TransactionModel
} from "models/transaction"
// import TransactionModel from '../../models/transaction'
import ItemModel from "models/items"
import { withNavigation } from "react-navigation"
import Component from "./component"

class TransactionDetailsPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    // get transaction from previous page
    const transaction = navigation.getParam("transaction")
    if (!transaction) return {}
    const { name } = transaction
    return {
      headerTintColor: white,
      headerStyle: {
        ...CommonHeaderStyle,
        backgroundColor: Transactions.colorForType(transaction.transactionType)
      }
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      transaction: null
    }
  }

  componentDidMount() {
    const transaction = this.props.navigation.getParam("transaction")
    this.setState({ transaction })
  }

  render() {
    const { transaction } = this.state
    if (!transaction) return null
    return <Component transaction={transaction} />
  }
}

export default withNavigation(TransactionDetailsPage)
