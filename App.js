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

import ItemPage from './pages/item'

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
    TransferPage: { screen: TransferPage }
  }),
  Items: createStackNavigator({
    Items: { screen: ItemPage }
  })
}, {
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state
      const iconName = {
        Account: "bank"
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
      <ThemeProvider>
        <FormattedProvider>
          <AppContainer />
        </FormattedProvider>
      </ThemeProvider>
    )
  }
}
