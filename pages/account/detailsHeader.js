import React from 'react'
import {
  View, Text, StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import { AccountPropTypes, FormatCurrency } from '../../utils'
import { colors } from '../../theme'
const {
  white, secondary
} = colors

export default class DetailsHeader extends React.Component {
  static propTypes = {
    account: AccountPropTypes
  }
  getNameRow() {
    const { name } = this.props.account
    return (
      <View style={style.nameRow}>
        <Text style={{...style.text, ...style.name}}>
          {name}
        </Text>
      </View>
    )
  }
  getSurplusRow() {
    const { amount, currency } = this.props.account
    return (
      <View style={style.surplusRow}>
        <Text style={{...style.text, ...style.surplus}}>
          {FormatCurrency(amount, currency)}
        </Text>
      </View>
    )
  }
  render() {
    return (
      <View style={style.container}>
        { this.getNameRow() }
        { this.getSurplusRow() }
        <View>
        </View>
      </View>
    )
  }
}
const themeColor = secondary
const textColor = white
const style = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: themeColor
  },
  nameRow: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  surplusRow: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  surplus: {
    fontSize: 36
  },
  name: {
  },
  text: {
    color: textColor
  }
})
