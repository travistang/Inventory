import React from 'react'
import TransactionModel from '../../models/transaction'
import {
  View, StyleSheet
} from 'react-native'
import {
  Text,
  ListView,
} from 'react-native-elements'
import Icon from 'react-native-vector-icons/dist/FontAwesome'

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

  render() {
    const { account } = this.state
    // TODO: differentiate between buy with specific account and buy with non-specific account
    if(!account) return null
    return (
      <View style={style.container}>
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    margin: 16
  }
})
