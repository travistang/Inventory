/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */
import React from 'react'

import AccountPage from './pages/account'
import AccountDetailsPage from './pages/account/details'
import AddIncomePage from './pages/account/income'
import TransferPage from './pages/account/transfer'
import BuyPage from './pages/account/buy'
import theme from './theme'
import ItemPage from './pages/item'
import ItemDetailsPage from './pages/item/details'
import CreateItemPage from './pages/item/createItemPage'
import ConsumePage from './pages/consume'
import TransactionPage from './pages/transaction'

import { FormattedProvider } from 'react-native-globalize'
import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator,
} from "react-navigation"
import { View, Text } from 'react-native'
import { ThemeProvider } from 'react-native-elements'
import Icon from 'react-native-vector-icons/dist/FontAwesome'


// App navigation structure
const RootNavigator = createBottomTabNavigator({
  Account: createStackNavigator({
    Account: { screen: AccountPage },
    AccountDetails: { screen: AccountDetailsPage },
    AddIncomePage: { screen: AddIncomePage },
    TransferPage: { screen: TransferPage },
    BuyPage: { screen: BuyPage }
  }),
  Buy: createStackNavigator({
    GeneralBuyPage: { screen: BuyPage },
  }),
  Items: createStackNavigator({
    Items: { screen: ItemPage },
    ItemDetailsPage: { screen: ItemDetailsPage },
    CreateItemPage: { screen: CreateItemPage },
  }),
  Consume: createStackNavigator({
    Consume: { screen: ConsumePage }
  }),
  Transactions: createStackNavigator({
    Transactions: { screen: TransactionPage }
  })

}, {
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state
      const iconName = {
        Account: "bank",
        Items: "gift",
        Buy: "shopping-cart",
        Consume: "fire",
        Transactions: "exchange"
      }
      return (<Icon
        name={iconName[routeName]}
        size={24} color={tintColor} />)
    }
  })
})

const AppContainer = createAppContainer(RootNavigator)
export default class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <FormattedProvider>
          <AppContainer />
        </FormattedProvider>
      </ThemeProvider>
    )
  }
}
