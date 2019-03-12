import React from 'react'
import TagCard from './TagCard'
import PropTypes from 'prop-types'
import {
  View, Text, StyleSheet,
  TouchableOpacity
} from 'react-native'
import { FormatCurrency } from '../utils'
import { withNavigation } from 'react-navigation'
import { colors } from '../theme'
import AccountTrendLine from './AccountTrendLine'
const {
  white, textPrimary, textSecondary, secondary
} = colors

class AccountCard extends React.Component {
  static propTypes = {
    account: PropTypes.object.isRequired
  }
  getMainComponent() {
    return (
      <AccountTrendLine
        color={white}
        backgroundColor={themeColor}
        account={this.props.account}
      />
    )
  }

  getTagComponent() {
    const { currency, amount } = this.props.account
    return (
      <View style={style.tagElement}>
        <Text style={style.tagElementText}>
          {FormatCurrency(amount, currency)}
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
    const { navigation, account } = this.props
    navigation.push('AccountDetails', { account })

  }
  render() {
    return (
      <TouchableOpacity
        style={style.container}
        onPress={this.toAccountDetails.bind(this)}
      >
        <TagCard
          mainElement={this.getMainComponent()}
          tagElement={this.getTagComponent()}
          leftTagElement={this.getTagLeftComponent()}
          containerStyle={style.mainContainer}
          bottomVirtualContainerStyle={style.tagLeftContainer}
        />
      </TouchableOpacity>

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
    margin: 4,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  tagElementText: {
     fontSize: 22,
     color: themeColor
   }
})
