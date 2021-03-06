import React from 'react'
import ContentCard from './ContentCard'
import {
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import TransactionOverviewCard from './TransactionOverviewCard'
import { withNavigation } from 'react-navigation'
import PropTypes from 'prop-types'
import { TransactionPropTypes } from '../utils'
import moment from 'moment'
/*
  Return a component that renders the transaction list
*/
class TransactionList extends React.Component {
  static defaultProps = {
    transactions: [],
    title: "",
    icon: ""
  }

  static propTypes = {
    transactions: PropTypes.arrayOf(TransactionPropTypes),
    selectedDay: PropTypes.instanceOf(Date),
    title: PropTypes.string,
    icon: PropTypes.string,
  }

  gotoDetails(transaction) {
    this.props.navigation.navigate('TransactionDetailsPage', {
      transaction
    })
  }
  render() {
    const { transactions, ...props } = this.props
    return (
      <ContentCard
        {...props}
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
      </ContentCard>
    )
  }
}

export default withNavigation(TransactionList)

const style = StyleSheet.create({
  container: {
    margin: 16,
  }
})
