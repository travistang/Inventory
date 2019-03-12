import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'
// import {
//   Text
// } from 'react-native-elements'
import { colors, colorForType } from '../../theme'
import { TransactionPropTypes, FormatCurrency } from '../../utils'
import { Transactions } from '../../models/transaction'
import AccountModel from '../../models/account'
import { withNavigation } from 'react-navigation'

class DetailsHeaderSection extends React.Component {
  static propTypes = {
    transaction: TransactionPropTypes,
  }

  constructor(props) {
    super(props)

    this.state = {
      fromAccount: null,
      toAccount: null
    }
  }

  componentDidMount() {
    const { from, to } = this.props.transaction
    if (from) {
      AccountModel.getAccountById(from)
        .then(fromAccount => this.setState({
          fromAccount
        }))
    }
    if (to) {
      AccountModel.getAccountById(to)
        .then(toAccount => this.setState({
          toAccount
        }))
    }
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
      items =  []
    } = this.props.transaction
    const numItems = items.length || 0
    const {
      BUY, TRANSFER, SELL, CRAFT, CONSUME, SPEND
    } = Transactions.TransactionTypes
    const {
      fromAccount, toAccount
    } = this.state

    switch(transactionType) {
      case BUY:
      case SPEND:
        if(!fromAccount) return null
        return (
          <Text
            adjustsFontSizeToFit={true}
            numberOfLines={1}
            minimumFontScale={0.01}
            style={style.quantity}>
            {FormatCurrency(consumedAmount, fromAccount.currency)}
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
  // get a mini view of the info of an account
  getAccountView(account) {
    const { name, amount, currency } = account
    return (
      <TouchableOpacity
        onPress={() => this.toAccount(account)}
        style={style.accountInfo}>
        <Text style={style.accountName}>
          {name}
        </Text>
        <Text style={style.accountAmount}>
          {FormatCurrency(amount, currency)}
        </Text>
      </TouchableOpacity>
    )
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
      consumedAmount,
      obtainedAmount
    } = this.props.transaction

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
          backgroundColor: colorForType(type)}}>
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
    fontSize: 64,
    textAlign: 'center',
  },
  bigNumberSmallText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bigNumber: {
    fontSize: 64,
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
  }
})
