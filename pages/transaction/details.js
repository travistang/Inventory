import React from 'react'
import Background from '../../components/Background'
import DetailsHeaderSection from './detailsHeader'
import PropTypes from 'prop-types'
import {
  View, StyleSheet, Text, TouchableOpacity
} from 'react-native'

import {
  TransactionPropTypes,
  CommonHeaderStyle,
  FormatItemAmount
} from '../../utils'
import { Transactions } from '../../models/transaction'
import ItemModel from '../../models/items'
import { withNavigation } from 'react-navigation'
import HeaderComponent from '../../components/HeaderComponent'
import { colors , colorForType } from '../../theme'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import TagCard from '../../components/TagCard'
const {
  CONSUME, SELL, BUY
} = Transactions.TransactionTypes

class TransactionDetailsPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    // get transaction from previous page
    const transaction = navigation.getParam('transaction')
    if(!transaction) return {}
    const { name } = transaction
    return {
      headerTintColor: white,
      headerStyle: {
        ...CommonHeaderStyle,
        backgroundColor: colorForType(transaction.transactionType)
      },
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      transaction: null
    }
  }
  getSubSectionComponent({
    title, icon
  }) {
    return (
      <View style={style.subSectionHeader}>
        { icon && (<Icon name={icon} size={26} />) }
        <Text style={style.subSectionHeaderText}>{title}</Text>
      </View>
    )
  }
  getMainContent(transaction) {
    const { name, items, from, to, transactionType } = transaction
    switch(transactionType) {
      case CONSUME:
        return (
          <View style={style.consumeItemListContainer}>
            {
              items.map((item) => {
                const {name: itemName, amount} = item
                return (
                  <TouchableOpacity
                    key={itemName}
                    style={style.consumeItemContainer}
                  >
                    <TagCard
                      config={{containerHeight: 72}}
                      virtualContainerStyle={style.consumeTagCardVirtualElement}
                      mainElement={(
                        <View style={style.consumeTagCardMainElement}>
                          <Text
                            style={style.consumeMainCardText}>
                            {itemName}
                          </Text>
                        </View>

                      )}
                    tagElement={(
                      <View style={style.consumeTagCardTagElement}>
                        <Text style={style.consumeTagCardText}>
                          {FormatItemAmount(amount, item)}
                        </Text>
                      </View>
                    )}
                    />
                  </TouchableOpacity>

                )
              })
            }
          </View>
        )


      default:
        return null
    }
  }
  componentDidMount() {
    const transaction = this.props.navigation.getParam(
      'transaction'
    )
    this.setState({ transaction: {...transaction, items: []} }, () => {
      transaction.items.forEach(
        item => {
          // obtain the units and original info of such item,
          // then append it to the state
          ItemModel.getItemByName(item.name)
            .then(originalItem => {
              this.setState({
                transaction: {
                  ...this.state.transaction,
                  items: (this.state.transaction.items || []).concat({
                    ...originalItem,
                    ...item,
                  })
                }
              })
            })
      })
    })
  }
  getSubTitle({ transactionType }) {
    let subtitleParams = {
      title: "",
      icon: null
    }


    switch(transactionType) {
      case CONSUME:
      case SELL:
      case BUY:
        subtitleParams.title = "ITEMS"
        subtitleParams.icon = "gift"
        break

      default:
        return null
    }
    return this.getSubSectionComponent(subtitleParams)
  }
  render() {
    const { transaction } = this.state
    if(!transaction) return null
    return (
      <Background>
        <DetailsHeaderSection
          transaction={transaction}
        />
        {this.getSubTitle(transaction)}
        <View style={style.mainContainer}>
          {this.getMainContent(transaction)}
        </View>
      </Background>
    )
  }
}

export default withNavigation(TransactionDetailsPage)
const { primary, secondary,
  danger, white, background, textSecondary } = colors
const style = StyleSheet.create({
  headerText: {
    color: white,
  },
  subSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 16
  },
  mainContainer: {
    marginHorizontal: 16,
  },
  consumeItemContainer: {
    width: '45%'
  },
  consumeTagCardMainElement: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  consumeTagCardVirtualElement: {
    marginHorizontal: 4
  },
  consumeTagCardTagElement: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: primary,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  consumeMainCardText: {
    // fontSize: 24,
    width: '100%'
  },
  consumeTagCardText: {
    // fontSize: 36
    color: white
  },
  subSectionHeaderText: {
    // fontSize: 26,
    textAlign: 'center'
    // paddingLeft: 8
  },
  consumeItemListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start'

  }
})
