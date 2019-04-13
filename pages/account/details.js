import React from 'react'
import {
  ListItem,
  Overlay,
} from 'react-native-elements'
import {
  CommonHeaderStyle,
  addOpacity,
  FormatCurrency
} from 'utils'
import {
  HeaderComponent,
  Background,
  ActionBox,
  AccountTrendLine,
  CenterNotice,
  ContentCard
} from 'components'

import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  View, TouchableOpacity,
  Dimensions, Text
} from 'react-native'
import * as _ from 'lodash'
import PropTypes from 'prop-types'
import AccountCard from './AccountCard'
import AccountModel from 'models/account'
import TransactionModel from 'models/transaction'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import DetailsHeader from './detailsHeader'
import { Transactions } from 'models/transaction'
import { colors, shadow } from 'theme'
import { ContributionGraph } from 'react-native-chart-kit'

import moment from 'moment'

const { textSecondary, secondary, white } = colors
const themeColor = secondary

export default class AccountDetailsPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const account = navigation.getParam('account')
    if(!account) return {}
    return {
          headerStyle: {
            ...CommonHeaderStyle,
            backgroundColor: themeColor
          },
          headerTintColor: white,
          headerRight: (
            <TouchableOpacity
              style={style.headerRight}
              onPress={() => navigation.navigate('', { account })}
            >
              <Icon name="exchange" size={22} color={white}/>
            </TouchableOpacity>
          )
      }
  }
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      transactions: [],
      account: null,
      graphWidth: Dimensions.get('window').width,
      // referring to surplus of the account
      min: 0,
      max: 0
    }
    props.navigation.addListener('didFocus',
      this.componentDidFocus.bind(this)
    )
  }
  onSurplusRangeCalculated({min, max}) {
    this.setState({ min, max })
  }
  componentDidFocus() {
    this.reloadAccountInfo()
  }

  reloadAccountInfo() {
    const { account } = this.state
    if(!account) return
    AccountModel.getAccountById(account._id)
      .then(acc => {
        this.setState({account: acc})
      })
  }
  componentDidMount() {
    const account = this.props.navigation.getParam('account')
    this.setState({
      account
    },() => {
      this.fetchAccountTransactions()
    })
  }
  fetchAccountTransactions() {
    const { account } = this.state
    if(!account) return

    TransactionModel.getTransactionsOfAccount(account)
      .then(transactions => {
        this.setState({ transactions })
      })
  }
  // push to next pages
  addIncome() {
    this.props.navigation.push("AddIncomePage", {
      account: this.state.account,
      income: true
    })
  }
  addSpend() {
    this.props.navigation.push("AddIncomePage", {
      account: this.state.account,
      income: false
    })
  }

  addTransfer() {
    this.props.navigation.push("TransferPage", {
      account: this.state.account,
    })
  }
  buy() {
    this.props.navigation.push("BuyPage", {
      account: this.state.account
    })
  }
  getAccountActions() {
    return [
      {
        icon: 'money',
        title: 'Income',
        onPress: this.addIncome.bind(this)
      },
      {
        icon: 'exchange',
        title: 'Transfer',
        disabled: this.props.accountList && this.props.accountList.length,
        onPress: this.addTransfer.bind(this)
      },
      {
        icon: 'fire',
        title: 'Spend',
        onPress: this.addSpend.bind(this)
      },
      {
        icon: 'shopping-cart',
        title: 'Buy',
        onPress: this.buy.bind(this)
      },
    ]
  }

  getCurrencyStyle(amount) {
    let color = 'gray'
    if(amount < 0) color = 'red'
    if(amount > 0) color = 'green'
    return {
      color
    }
  }
  getAccountTransactionsList() {
    const { transactions } = this.state
    if(_.isEmpty(transactions)) {
      return (
        <CenterNotice
          title="There are no transactions from this account"
        />
      )
    } else {
      return transactions.map((tran, i) => {
        const { name, currency, amount } = tran
        return (
          <ListItem key={i} title={name}
            subtitle={FormatCurrency(amount, currency)}
            subTitleStyle={this.getCurrencyStyle(amount)}
          />
        )
      })
    }
  }

  surplusTrendCard() {
    const { min, max,
      account: { currency }
    } = this.state
    return (
      <ContentCard
        title="surplus trend"
        icon="arrow-up"
      >
        <AccountTrendLine
          width="100%"
          color={secondary}
          account={this.state.account}
          onSurplusRangeCalculated={
            this.onSurplusRangeCalculated.bind(this)
          }
        />
        <View style={style.trendBottom}>
          <View style={style.trendBottomText}>
            <Text>MIN</Text>
            <Text style={style.trendBottomAmount}>
              {FormatCurrency(min, currency)}
            </Text>
          </View>
          <View style={style.trendBottomText}>
            <Text>MAX</Text>
            <Text style={style.trendBottomAmount}>
              {FormatCurrency(max, currency)}
            </Text>
          </View>
        </View>
      </ContentCard>
    )
  }

  transactionHeatmapCard() {
    // convert transactions involving this account to list of date string
    const count = this.state.transactions.map(
      trans => moment(trans.date).format('YYYY-MM-DD')
    )
    // reduce date string to an array of {dateString: frequencies}
    .reduce((data, dateString) =>
      ({
        ...data,
        [dateString]: (data.dateString || 0) + 1
      }), {})
    const data = Object.keys(count).map(dateString => ({
      date: dateString,
      count: count[dateString]
    }))
    const reportInnerWidth = ({ nativeEvent: { layout: { width }}}) => {
      this.setState({
        graphWidth: width // compensate padding
      })
    }

    return (
      <ContentCard
        title="Transaction frequencies"
        icon="exchange"
        onLayout={reportInnerWidth.bind(this)}
      >
        <ContributionGraph
          values={data}
          endDate={new Date()}
          numDays={90}
          width={this.state.graphWidth}
          height={196}
          style={{transform: [{translateX: -16}]}}
          chartConfig={{
            backgroundColor: white,
            backgroundGradientFrom: white,
            backgroundGradientTo: white,
            color: (opacity = 1) => addOpacity(secondary, opacity)
          }}
        />
    </ContentCard>
    )
  }
  render() {
    const {
      transactions,
      account,
    } = this.state

    if(!account) return null

    const { amount, currency } = account

    return (
      <Background>
        <DetailsHeader
          actions={this.getAccountActions()}
          account={account} />
        <View style={style.mainContainer}>
          {this.surplusTrendCard()}
          {this.transactionHeatmapCard()}
        </View>
      </Background>
    )
  }
}

const style = StyleSheet.create({
  headerRight: {
    marginRight: 16
  },


  mainContainer: {
    margin: 16,
  },
  header: {
    backgroundColor: secondary
  },

  buttonGroup: {
    flexDirection: 'row',
    marginVertical: 8,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },
  buttonGroupItem: {
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8
  },
  actionButton: {
    margin: 8,
    flex: 1
  },
  transactionListContainer: {
    margin: 16,
  },
  summary: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  monetary: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  monetaryText: {
    fontWeight: 'bold'
  },
  trendBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  trendBottomText: {
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  trendBottomAmount: {
    fontWeight: '900'
  },
  trendContainer: {
    flex: 2
  }
})
