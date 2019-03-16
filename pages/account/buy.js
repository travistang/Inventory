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
import {
  CommonHeaderStyle
} from '../../utils'
import HeaderComponent from '../../components/HeaderComponent'
import Background from '../../components/Background'

export default class BuyPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const account = navigation.getParam('account')
    const title = account?`buy from account ${account.name}`:"buy items"
    return {
      headerStyle: CommonHeaderStyle,
      headerTitle: (
        <HeaderComponent
          title={title}
          icon="shopping-cart"
        />
      )
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
      <Background style={style.container}>
        <BuyForm
          onBuy={this.onBuy.bind(this)}
          account={account}
        />
      </Background>
    )
  }
}

const style = StyleSheet.create({
  container: {
    padding: 16
  }
})
