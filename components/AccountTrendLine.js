import React from 'react'
import {
  StyleSheet, View, TouchableOpacity
} from 'react-native'
import { Text } from 'react-native-elements'
import LineChart from "react-native-responsive-linechart"
import PropTypes from 'prop-types'
import TransactionModel from '../models/transaction'

// given an account instance, render a trend line
export default class AccountTrendLine extends React.Component {
  static defaultProps = {
    numData: 5
  }

  static propTypes = {
    account: PropTypes.shape({
      _id: PropTypes.string.isRequired
    }).isRequired,
    numData: PropTypes.number,
    onPress: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = {
      data: []
    }

    this.config = {
      // interpolation: "spline",
      line: {
        strokeWidth: 2 ,
        strokeColor: '#10ac84'
      },
      yAxis: { visible: false },
      xAxis: {visible: false},
      grid: { visible: false },
      area: {
        visible: false,
        // gradientFrom: '#10ac84',
        // gradientFromOpacity: 1,
        // gradientTo: '#10ac84',
        // gradientToOpacity: 0.4,
      },

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
    const { onPress } = this.props
    if(data.length < 2) {
      return (
        <View style={style.container}>
          <Text h5 style={style.noDataText}>
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
        <LineChart
          data={data}
          config={this.config}
          style={style.chart}
        />
      </TouchableOpacity>
    )
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
  },
  noDataText: {
    textAlign: 'center'
  }
})
