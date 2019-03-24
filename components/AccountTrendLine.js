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
    numData: 100,
    color: primary,
    appendData: []
  }

  static propTypes = {
    account: PropTypes.shape({
      _id: PropTypes.string.isRequired
    }).isRequired,
    numData: PropTypes.number,
    onPress: PropTypes.func,
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
    // a little hack here, but well..., just a little.
    onSurplusRangeCalculated: PropTypes.func,
    appendData: PropTypes.arrayOf(PropTypes.number)
  }

  constructor(props) {
    super(props)

    this.state = {
      data: []
    }


  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.props.account._id != prevProps.account._id) {
      this.fetchData()
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

    // report the minimum and maximum amount of the surplus, if a callback is given
    const { onSurplusRangeCalculated } = this.props
    if(onSurplusRangeCalculated) {
      const min = Math.min(...data)
      const max = Math.max(...data)
      onSurplusRangeCalculated({
        min, max
      })
    }

  }
  render() {
    let { data } = this.state
    const { onPress,
      color = primary ,
      appendData = [],
      backgroundColor = white,
    } = this.props
    // append data for preview if there are any
    appendData.forEach(diff => {
      const lastData = data[data.length - 1]
      data = data.concat(lastData + diff)
    })
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
    return min
    // return Math.max(min - (max - min), 0)
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
