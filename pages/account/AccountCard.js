import React from 'react'
import {
  Card,
  Text
} from 'react-native-elements'
import {
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { withNavigation } from 'react-navigation'
import PropTypes from 'prop-types'
// import { FormattedCurrency } from 'react-native-globalize'
import { FormatCurrency } from '../../utils'

class AccountCard extends React.Component {
  static defaultProps = {
    inDetailPage: false
  }
  static propTypes = {
    key: PropTypes.string,
    navigation: PropTypes.object.isRequired,
    inDetailPage: PropTypes.bool.isRequired,
    account: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      currency: PropTypes.string.isRequired
    }).isRequired

  }

  toDetails() {
    const { navigation, account, inDetailPage } = this.props
    if(inDetailPage) return // do not push to detail page if we are already in it
    navigation.navigate('AccountDetails', { account })
  }
  render() {
    const { name, amount, currency } = this.props.account
    return (
      <TouchableOpacity
        onPress={this.toDetails.bind(this)}>
        <Card
          title={name.toUpperCase()}>
          <View style={style.cardContainer}>
            <Text style={style.surplus}>
              {FormatCurrency(amount, currency)}
            </Text>
          </View>
        </Card>
    </TouchableOpacity>
    )
  }
}

const style = StyleSheet.create({
  cardContainer: {
    textAlign: 'right'
  },
  surplus: {
    color: 'green',
    fontSize: 32
  }
})

export default withNavigation(AccountCard)
