import React from 'react'
import DetailsHeaderSection from './detailsHeader'
import PropTypes from 'prop-types'
import {
  View, StyleSheet, Text, TouchableOpacity
} from 'react-native'

import {
  TransactionPropTypes,
  CommonHeaderStyle,
  FormatItemAmount
} from 'utils'
import {
  HeaderComponent,
  ItemCard,
  Background,
  ContentCard,
  AccountCard,
  LocationPreviewCard,
  Icon
} from 'components'

import AccountModel from 'models/account'
import {
  Transactions,
  Transaction as TransactionModel
} from 'models/transaction'
// import TransactionModel from '../../models/transaction'
import ItemModel from 'models/items'
import { withNavigation } from 'react-navigation'
import { colors } from 'theme'


const {
  CONSUME, SELL, BUY, SPEND
} = Transactions.TransactionTypes

class TransactionDetailsPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    // get transaction from previous page
    const transaction = navigation.getParam('transaction')
    if(!transaction) return {}
    const { name } = transaction
    return {
      headerTintColor: white,
      headerStyle: {
        ...CommonHeaderStyle,
        backgroundColor: Transactions.colorForType(transaction.transactionType)
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
    const { name, items, transactionType} = transaction
    const { fromAccount, toAccount } = this.state.transaction
    switch(transactionType) {
      case BUY:
      case CONSUME:
        return (
          <ContentCard
            title="items"
            icon="gift"
            style={style.consumeItemListContainer}>
            {
              items.map((item) => (
                <ItemCard
                  tagColor={(transactionType == CONSUME)?secondary:primary}
                  key={item.name} item={item} />
              ))
            }
          </ContentCard>
        )
      case SPEND:
        if(!fromAccount && !toAccount) return null
        return (
            <ContentCard
              style={style.fromAccountContentCard}
              title="From account"
              icon="bank"
            >
              <AccountCard account={fromAccount || toAccount }
              />
            </ContentCard>
        )


      default:
        return null
    }
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
      <View style={style.mainContainer}>
        <LocationPreviewCard
          location={transaction.location}
        />
          {this.getMainContent(transaction)}
      </View>
      </Background>
    )
  }
}

export default withNavigation(TransactionDetailsPage)
const { primary, secondary,
  danger, white, background, textSecondary } = colors
const style = StyleSheet.create({
  headerText: {
    color: white,
  },
  subSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 16
  },
  mainContainer: {
    marginHorizontal: 16,
  },

  subSectionHeaderText: {
    // fontSize: 26,
    textAlign: 'center'
    // paddingLeft: 8
  },
  consumeItemListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start'

  },
  fromAccountContentCard: {
    paddingHorizontal: 0,
    backgroundColor: 'transparent'
  }
})
