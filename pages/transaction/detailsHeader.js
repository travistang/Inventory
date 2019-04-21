import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'
import { colors } from 'theme'
import { TransactionPropTypes, FormatCurrency } from 'utils'
import { Transactions } from 'models/transaction'
import AccountModel from 'models/account'
import { withNavigation } from 'react-navigation'
import moment from 'moment'
import Icon from 'react-native-vector-icons/dist/FontAwesome'

class DetailsHeaderSection extends React.Component {
  static propTypes = {
    transaction: TransactionPropTypes,
  }

  getQuantityDescription() {
    const { name } = this.props.transaction
    return name
  }
  getQuantityComponent() {
    const {
      transactionType,
      consumedAmount,
      obtainedAmount,
      from: fromAccount,
      to: toAccount,
      items =  []
    } = this.props.transaction
    const numItems = items.length || 0
    const {
      BUY, TRANSFER, SELL, CRAFT, CONSUME, SPEND, INCOME
    } = Transactions.TransactionTypes


    switch(transactionType) {
      case BUY:
      case SPEND:
        const account = fromAccount || toAccount
        const amount = consumedAmount || obtainedAmount || 0
        return (
          <Text
            adjustsFontSizeToFit={true}
            numberOfLines={1}
            minimumFontScale={0.01}
            style={style.quantity}>
            {FormatCurrency(amount, account.currency)}
          </Text>
        )
      case INCOME:
        return (
          <Text>
              {FormatCurrency(obtainedAmount, (fromAccount || toAccount).currency)}
          </Text>
        )
      case TRANSFER:
        return (
          <Text
            adjustsFontSizeToFit={true}
            numberOfLines={1}
            minimumFontScale={0.01}
            style={style.quantity}>
            {`1:${(obtainedAmount / consumedAmount).toFixed(2)}`}
          </Text>
        )
      case CONSUME:
        return this.getBigNumberSmallTextComponent(
          numItems, "items used"
        )

      default:
        return null
    }
  }
  // return a component that has a big number and small 'items' string
  getBigNumberSmallTextComponent(num, text) {
    return (
      <View style={style.bigNumberSmallText}>
        <Text style={style.bigNumber}>
          {num}
        </Text>
        <Text style={{...style.smallText, ...style.text}}>
          {text}
        </Text>
      </View>
    )
  }
  toAccount(account) {
    this.props.navigation.push('AccountDetailsFromTransaction', {
      account
    })
  }

  /*
    Auxillary info of this value
    If no money is involved (consume, craft), nothing is shown here.
    If its a transfer:
      - show amount obtained and amount consumed. as well as exchange rate.
    If it's buy:
      - show total number of items bought
      - show the name of the account
    If it's sell:
      - show total number of items sold.
    If it's spend:
      - show the account the money is spend from
  */
  getAuxillaryInfo() {
    const {
      transactionType,
      date,
      consumedAmount,
      obtainedAmount
    } = this.props.transaction
    return (
      <View style={style.auxillaryInfoContainer}>
        <Icon name="calendar" style={style.calendarIcon}/>
        <Text style={style.auxilaryText}>
          {moment(date).format('DD/MM/YYYY HH:mm')}
        </Text>
      </View>
    )
    const {
      BUY, TRANSFER, SELL, CRAFT, CONSUME, SPEND
    } = Transactions.TransactionTypes
    // no auxillary info here
    if([CONSUME,CRAFT].indexOf(transactionType) > -1)  {
      return null
    }
    let content
    switch(transactionType) {
      case BUY:
        const { fromAccount } = this.state
        if(!fromAccount) return null
        return this.getAccountView(fromAccount)
      case TRANSFER:
      default:
        break
    }
    return content
  }
  render() {
    const { transactionType: type } = this.props.transaction
    return (
      <View style={{
          ...style.container,
          backgroundColor: Transactions.colorForType(type)}}>
        <View style={style.centerRow}>
          <Text style={style.quantityDescription}>
            {this.getQuantityDescription()}
          </Text>
          {this.getQuantityComponent()}
        </View>
        <View style={style.auxRow}>
            {this.getAuxillaryInfo()}
        </View>

      </View>
    )
  }
}

export default withNavigation(DetailsHeaderSection)

const {
  danger, primary, textPrimary,
  textSecondary, white, background,
  secondary
} = colors
const textColor = white
const style = StyleSheet.create({
  container: {
    height: 160,
    display: 'flex',
    color: textColor,
  },
  centerRow: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  auxRow: {
    height: 36,
    paddingHorizontal: 32,
  },
  quantityDescription: {
    color: textColor,
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    color: textColor,
    flex: 1,
    fontSize: 36,
    textAlign: 'center',
  },
  bigNumberSmallText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bigNumber: {
    fontSize: 36,
    color: textColor,
    marginRight: 8
  },
  smallText: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    color: textColor
  },
  text: {
    color: textColor,
  },
  accountInfo: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between'
  },
  accountName: {
    color: textColor,
    fontWeight: 'bold'
  },
  accountAmount: {
    fontWeight: 'bold'
  },
  auxillaryInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  calendarIcon: {
    marginRight: 8
  },
  auxilaryText: {
    color: textColor
  },

})
