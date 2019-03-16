import React from 'react'
import TagCard from './TagCard'
import PropTypes from 'prop-types'
import {
  View, Text, StyleSheet,
  TouchableOpacity,
  Picker
} from 'react-native'
import { FormatCurrency } from '../utils'
import { withNavigation } from 'react-navigation'
import { colors } from '../theme'
import AccountTrendLine from './AccountTrendLine'
const {
  white, textPrimary, textSecondary, secondary, primary
} = colors

/*
  Component that serve as an overview of an account,
  or an input of choosing account
*/
class AccountCard extends React.Component {
  static defaultProps = {
    isInput: false,
    amountChange: 0,
  }
  static propTypes = {
    account: PropTypes.object.isRequired,
    accountList: PropTypes.arrayOf(PropTypes.object),
    amountChange: PropTypes.number,
    isInput: PropTypes.bool.isRequired,
    config: PropTypes.object
  }
  getMainComponent() {
    const { amountChange } = this.props

    return (
      <AccountTrendLine
        color={white}
        appendData={amountChange?[amountChange]:[]}
        backgroundColor={themeColor}
        account={this.props.account}
      />
    )
  }
  getAmountChangeStyle() {
    const { amountChange } = this.props
    if(!amountChange) return {}
    const color = (amountChange < 0)?primary:secondary
    return {
      color
    }
  }
  getTagComponent() {
    const { currency, amount } = this.props.account
    const { amountChange } = this.props
    return (
      <View style={style.tagElement}>
        <Text style={{
            ...style.tagElementText,
            ...this.getAmountChangeStyle()
        }}>
          {FormatCurrency(amount + (amountChange || 0), currency)}
        </Text>
      </View>
    )
  }

  getTagLeftComponent() {
    return (
        <Text style={style.tagLeftContainerText}>
          {this.props.account.name}
        </Text>
    )
  }
  toAccountDetails() {
    const { navigation, account, accountList } = this.props
    navigation.push('AccountDetails', { account, accountList })

  }
  render() {
    const { isInput, account, style: containerStyle, config } = this.props
    if(!account) return null
    const MainComponent = isInput?View:TouchableOpacity
    return (
      <MainComponent
        style={{...style.container, ...containerStyle}}
        onPress={!isInput && this.toAccountDetails.bind(this)}
      >
        <TagCard
          config={config}
          mainElement={this.getMainComponent()}
          tagElement={this.getTagComponent()}
          leftTagElement={this.getTagLeftComponent()}
          containerStyle={style.mainContainer}
          bottomVirtualContainerStyle={style.tagLeftContainer}
        />
      </MainComponent>

    )
  }
}
export default withNavigation(AccountCard)
const cardHeight = 128
const themeColor = secondary
const style = StyleSheet.create({
  mainContainer: {
    backgroundColor: themeColor
  },
  accountPicker: {
    backgroundColor: primary
  },
  tagLeftContainer: {
    // backgroundColor: white,
    width: '100%',
    borderBottomLeftRadius: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 2,
    paddingLeft: 8,
    paddingBottom: 8,
    transform: [
      { translateY: -cardHeight / 2 }
    ],
  },
  tagLeftContainerText: {
    color: white,
    fontSize: 16
  },
  container: {
    margin: 16
  },
  tagElement: {
    padding: 4,
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tagElementText: {
     fontSize: 22,
     textAlign: 'center'
   }
})
