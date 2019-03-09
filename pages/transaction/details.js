import React from 'react'
import Background from '../../components/Background'
import DetailsHeaderSection from './detailsHeader'
import PropTypes from 'prop-types'
import {
  View, StyleSheet, Text
} from 'react-native'

import {
  TransactionPropTypes,
  CommonHeaderStyle,
} from '../../utils'
import { withNavigation } from 'react-navigation'
import HeaderComponent from '../../components/HeaderComponent'
import { colors } from '../../theme'
class TransactionDetailsPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    // get transaction from previous page
    const transaction = navigation.getParam('transaction')
    if(!transaction) return {}
    const { name } = transaction
    return {
      headerTintColor: textPrimary,
      headerStyle: {
        ...CommonHeaderStyle,
        ...style.header
      },
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      transaction: null
    }
  }
  getMainContent(transaction) {
    const { name, items, from, to } = transaction
    return null
  }
  componentDidMount() {
    const transaction = this.props.navigation.getParam(
      'transaction'
    )
    this.setState({ transaction })
  }
  render() {
    const { transaction } = this.state
    if(!transaction) return null
    return (
      <Background>
        <DetailsHeaderSection
          transaction={transaction}
        />
        {this.getMainContent(transaction)}
      </Background>
    )
  }
}

export default withNavigation(TransactionDetailsPage)
const { primary, danger, white, background } = colors
const style = StyleSheet.create({
  headerText: {
    color: white,
  },
  header: {
    backgroundColor: background,
  },
})
