import React from 'react'
import TransactionModel from '../../models/transaction'
import {
  View, StyleSheet,
  ToastAndroid
} from 'react-native'
import {
  Text,
  ListView,
} from 'react-native-elements'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import BuyForm from '../../forms/buy'

export default class BuyPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const account = navigation.getParam('account')
    if(!account) {
        return {
          title: "Buy",
          headerTitle: (
            <View style={{
                marginLeft: 16,
                flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="shopping-cart" size={22} />
              <Text> {' '} </Text>
              <View>
                <Text>
                  BUY
                </Text>
              </View>
            </View>
          )
        }
    }
    else {
      return {
        title: `Buy from account ${account.name}`
      }
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: null
    }
  }

  componentDidMount() {
    this.setState({
      account: this.props.navigation.getParam('account')
    })
  }
  async onBuy({ name, date, items, fromAccount}) {
    try {
      const buyResult = await TransactionModel.buy({
        fromAccount,
        items, name, date
      })

      ToastAndroid.show(`${items.length} items bought`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM)

      return buyResult

    } catch(err) {
      ToastAndroid.show(`error: ${err.message}`,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM)
      return false
    }

  }
  render() {
    const { account } = this.state
    return (
      <View style={style.container}>
        <BuyForm
          onBuy={this.onBuy.bind(this)}
          account={account}
        />
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    margin: 16
  }
})
