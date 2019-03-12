import React from 'react'
import {
  StyleSheet, View, TouchableOpacity,Text
} from 'react-native'
import PropTypes from 'prop-types'
import TransactionModel from '../models/transaction'
import Sparkline from 'react-native-sparkline'
import {colors} from '../theme'
const { primary, white } = colors

// given an account instance, render a trend line
export default class AccountTrendLine extends React.Component {
  static defaultProps = {
    numData: 5,
    color: primary
  }

  static propTypes = {
    account: PropTypes.shape({
      _id: PropTypes.string.isRequired
    }).isRequired,
    numData: PropTypes.number,
    onPress: PropTypes.func,
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
  }

  constructor(props) {
    super(props)

    this.state = {
      data: []
    }


  }
  async componentDidMount() {
    await this.fetchData()
  }
  async fetchData() {
    // extract account ID
    const { account, numData } = this.props
    const { _id: accountId } = account
    const data =
      await TransactionModel.getAccountRecentBalance({accountId, numData})
    this.setState({ data })
  }
  render() {
    const { data } = this.state
    const { onPress,
      color = primary ,
      backgroundColor = white,
    } = this.props
    if(data.length < 2) {
      return (
        <View style={{
            ...style.container,
            backgroundColor
        }}>
          <Text h5 style={{
              ...style.noDataText,
              color
          }}>
            Not enough data to show trend
          </Text>
        </View>
      )
    }
    return (
      <TouchableOpacity
        disabled={!onPress}
        onPress={onPress}
        style={style.container}>
        <Sparkline
          min={this.getLineMinimum(data)}
          color={color}
          data={data}>
          <Sparkline.Line />
          <Sparkline.Fill />
        </Sparkline>
      </TouchableOpacity>
    )
  }
  /*
    Try to make the line staying above the half of the graph
  */
  getLineMinimum(data) {
    const min = Math.min(...data)
    const max = Math.max(...data)
    return Math.max(min - (max - min), 0)
  }
}

const style = StyleSheet.create({
  chart: {
    flex: 1,
    height: 72,
    width: '100%'
  },
  container: {
    margin: 16,
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  noDataText: {
    textAlign: 'center'
  }
})
