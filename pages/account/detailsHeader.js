import React from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'
import { AccountPropTypes, FormatCurrency } from '../../utils'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import { colors } from '../../theme'
const {
  white, secondary
} = colors

export default class DetailsHeader extends React.Component {
  static propTypes = {
    account: AccountPropTypes,
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        onPress: PropTypes.func.isRequired
      })
    ).isRequired
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
  actionButton({icon, title, onPress}) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={style.actionButtonContainer}>
        <View style={style.nameRow}>
          <Icon name={icon} color={white} size={22} />
        </View>
        <View style={style.nameRow}>
          <Text style={style.actionButtonText}>
            {title.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
  render() {
    return (
      <View style={style.container}>
        { this.getNameRow() }
        { this.getSurplusRow() }
        <View style={style.actionButtonIconContainer}>
          {
            this.props.actions.map(
              this.actionButton.bind(this)
            )
          }
        </View>
      </View>
    )
  }
}
const themeColor = secondary
const textColor = white
const style = StyleSheet.create({
  actionButtonContainer: {
    backgroundColor: themeColor,
    flex: 1,
  },
  actionButtonIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  actionButtonText: {
    color: textColor
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: themeColor,
    height: 160,
  },
  nameRow: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  surplusRow: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
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
