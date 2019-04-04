import React from 'react'
import Card from './Card'
import {
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import TransactionOverviewCard from './TransactionOverviewCard'
import { withNavigation } from 'react-navigation'
import PropTypes from 'prop-types'
import { TransactionPropTypes } from '../utils'
/*
  Return a component that renders the transaction list
*/
class TransactionList extends React.Component {
  static defaultProps = {
    transactions: []
  }

  static propTypes = {
    transactions: PropTypes.arrayOf(TransactionPropTypes)
  }

  gotoDetails(transaction) {
    this.props.navigation.navigate('TransactionDetailsPage', {
      transaction
    })
  }
  render() {
    const { transactions } = this.props
    return (
      <Card
        style={style.container}>
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
      </Card>
    )
  }
}

export default withNavigation(TransactionList)

const style = StyleSheet.create({
  container: {

  }
})
