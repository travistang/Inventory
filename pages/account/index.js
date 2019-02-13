import React from 'react'
import {
  Platform, StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native'
import AddAccountOverlay from './addAccountOverlay'
import {
  Text,
  Button
} from 'react-native-elements'
import { StackActions } from 'react-navigation'
import AccountCard from './AccountCard'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import AccountModel from '../../models/account'

export default class AccountPage extends React.Component {

  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state
    return {
      // header: {
      headerTitle:(
        <View style={{
            marginLeft: 16,
            flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="bank" />
          <Text> {' '} </Text>
          <TouchableOpacity
            onPress={
              AccountModel.removeAllAccounts.bind(AccountModel)
            }
          >
            <Text>
              ACCOUNT
            </Text>
          </TouchableOpacity>
        </View>
      ),
      // headerStyle: {justifyContent: 'center'},
      headerTitleStyle: {
        // fontWeight: 500,
        alignSelf: 'center',
        textAlign: 'center'
      },
      //onPress={navigation.params.openAddAccountView}
      headerRight: (
        <Button
          type="clear"
          onPress={params.openAddAccountView}
          icon={{name: "add"}}
        />
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
      <ScrollView
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
            />
          ))
        }
      </ScrollView>
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
