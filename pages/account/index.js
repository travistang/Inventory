import React from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  RefreshControl,
  Text
} from 'react-native'
import {
  CommonHeaderStyle
} from 'utils'
import AddAccountOverlay from './addAccountOverlay'
import {
  Button
} from 'react-native-elements'

import {
  HeaderComponent,
  Background,
  AccountCard,
  Icon
} from 'components'
import AccountModel from 'models/account'

import { StackActions } from 'react-navigation'

import { colors } from 'theme'
const { textSecondary } = colors

export default class AccountPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state
    return {
          headerStyle: CommonHeaderStyle,
          headerTintColor: textSecondary,
          headerTitle: (
            <TouchableOpacity
              onPress={
                AccountModel.removeAllAccounts.bind(AccountModel)
              }
            >
              <HeaderComponent
                title="Accounts"
                icon="exchange"
              />
            </TouchableOpacity>
          ),
          headerRight: (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center'}}
                onPress={() => navigation.navigate('Transactions')}
              >
                <Icon name="exchange" size={16}/>
              </TouchableOpacity>

              <Button
                type="clear"
                onPress={params.openAddAccountView}
                icon={{name: "add"}}
              />
            </View>

          )
      }
    }


  loadAccountList() {
    this.setState({
      refreshing: true
    },
    () => AccountModel.getAccounts()
      .then(accounts => {
        this.setState({accounts, refreshing: false})
      })
    )
  }
  constructor(props) {
    super(props)
    this.state = {
      accountViewOpened: false,
      accounts: [],
      refreshing: false
    }
    props.navigation.addListener('didFocus',
      this.componentDidFocus.bind(this)
    )
  }
  removeAllAccounts() {
    AccountModel.removeAllAccounts()
    .then(this.loadAccountList.bind(this))
  }
  componentDidFocus() {
    this.loadAccountList()
  }
  componentDidMount() {
    // arm the navigation params with callbacks
    this.props.navigation.setParams({
      openAddAccountView: this.openAddAccountView.bind(this)
    })
    this.loadAccountList()
  }

  openAddAccountView() {
    this.setState({
      accountViewOpened: true
    })
  }

  closeAddAccountView() {
    this.setState({
      accountViewOpened: false
    })
    this.loadAccountList()
  }

  render() {
    return (
      <Background
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.loadAccountList.bind(this)}
          />
        }
        style={style.container}>
          <AddAccountOverlay
            onCreate={() => {}}
            isOpen={this.state.accountViewOpened}
            onClose={this.closeAddAccountView.bind(this)}
          />
        {
          this.state.accounts.map(account => (
            <AccountCard
              key={account.name}
              account={account}
              accountList={this.state.accounts}
            />
          ))
        }
      </Background>
    )
  }
}
const style = StyleSheet.create({
  headerTitle: {
    textAlign: 'center'
  },
  container: {
    flex: 1,
    // backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
