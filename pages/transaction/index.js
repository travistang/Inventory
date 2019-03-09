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
import { withNavigation } from 'react-navigation'

import Card from '../../components/Card'
import Background from '../../components/Background'
import HeaderComponent from '../../components/HeaderComponent'
import TransactionModel from '../../models/transaction'
import TransactionOverviewCard from './TransactionOverviewCard'
import { exportDB } from '../../models'
import {
  CommonHeaderStyle
} from '../../utils'
import { colors } from '../../theme'
const { background } = colors

class TransactionPage extends React.Component {
  static navigationOptions = ({navigation}) => {
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
          onPress={() => exportDB("example.com")}
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
      // current page being loaded
      page: -1,
      // total page possible for transactions given numRecords
      totalPage: 0,
      // the transaction records loaded
      transactions: [],

      // flag for refreshing
      refreshing: false
    }
  }
  // reload all transaction records.
  reloadTransactionRecords() {
    this.setState({
      page: -1,
      totalPage: 0,
      transactions:[],
      refreshing: true
    },
    () => this.loadRecentTransactionRecords())
  }
  // load the NEXT page of transaction
  // also INCREMENT the page of transaction
  loadRecentTransactionRecords() {
    const page = this.state.page + 1
    TransactionModel.getTotalNumberOfTransactions()
      .then(numTransactions => Math.floor(numTransactions / this.numRecords))
      .then(totalPage => {
        this.setState({
          totalPage
        })
      })
      .then(() => TransactionModel.getRecentTransactions({
            numRecords: this.numRecords,
            page
      }))
      .then(trans => {
        this.setState({
          page,
          transactions: this.state.transactions.concat(trans)
        })
      })
      .then(() => {
        this.setState({
          refreshing: false
        })
      })
  }

  componentDidMount() {
    this.loadRecentTransactionRecords()
  }
  gotoDetails(transaction) {
    this.props.navigation.navigate('TransactionDetailsPage', {
      transaction
    })
  }
  render() {
    const { transactions } = this.state
    return (
      <Background
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.reloadTransactionRecords.bind(this)}
          />
        }
      >
        {
          transactions.map((trans, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => this.gotoDetails(trans)}>
                <TransactionOverviewCard
                   transaction={trans}
                />
            </TouchableOpacity>

          ))
        }
      </Background>
    )
  }
}

export default withNavigation(TransactionPage)
// const style = StyleSheet.create({
//   container: {
//     display: 'flex',
//     margin: 16
//   }
// })
