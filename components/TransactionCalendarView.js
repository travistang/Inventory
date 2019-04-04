import React from 'react'
import { Calendar } from 'react-native-calendars'
import {
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import { TransactionPropTypes } from '../utils'
import { colors } from '../theme'
import moment from 'moment'
const {
  primary, secondary, background, white,
  textSecondary
 } = colors

import * as _ from 'lodash'

export default class TransactionCalendarView extends React.Component {
  static defaultProps = {
    transactionsOfMonth: [],
    themeColor: primary,
    selectedDays: []
  }
  static propTypes = {
    onDaySelected: PropTypes.func.isRequired,
    onMonthChanged: PropTypes.func.isRequired,
    transactionsOfMonth: PropTypes.arrayOf(
      TransactionPropTypes
    ).isRequired,
    selectedDays: PropTypes.arrayOf(PropTypes.object),
    themeColor: PropTypes.string
  }
  getMarkedDates() {
    const {
      transactionsOfMonth,
      themeColor,
      selectedDays } = this.props
    // prepare a "YYYY-mm-dd: { marked: true}" pair
    const markedDates = transactionsOfMonth.map(trans => ({
      [moment(trans.date).format('YYYY-MM-DD')]:
        { marked: true, selectedColor: themeColor }
    })).reduce(
      (markedDates, date) => ({...markedDates, ...date}),
    {})
    const selectedDates = selectedDays.map(date => ({
      [moment(date).format('YYYY-MM-DD')]:
        {selected: true}
    })).reduce(
      (markedDates, date) => ({...markedDates, ...date}),
    {})

    const res = _.merge(markedDates, selectedDates)
    return res
  }
  getTheme() {
    const { themeColor } = this.props
    return {
      ...theme,
      selectedDayBackgroundColor: themeColor,
      selectedDayTextColor: white,
      dayTextColor: textSecondary,
      arrowColor: themeColor,
      monthTextColor: textSecondary,
      selectedDotColor: white,
      dotColor: themeColor
    }
  }
  onDayPress(day) {
    const { onDaySelected } = this.props
    let correctedDay = moment(day).clone().subtract(1, 'months')
    if(!correctedDay.isValid()) {
      correctedDay = moment(day).clone().startOf('month').subtract(1, 'days')
    }
    onDaySelected(correctedDay)
  }
  render() {
    const { onDaySelected, onMonthChanged } = this.props
    return (
      <Calendar
        hideExtraDays={true}
        maxDate={new Date()}
        onDayPress={this.onDayPress.bind(this)}
        markedDates={this.getMarkedDates()}
        onMonthChange={onMonthChanged}
        style={style.container}
        theme={this.getTheme()}
      />
    )
  }
}
const fontFamily = "Railway"
const theme = {
  calendarBackground: background,
  textDayFontFamily: fontFamily,
  textMonthFontFamily: fontFamily,
  textDayHeaderFontFamily: fontFamily,
  textTodayFontFamily: fontFamily,

}

const style = StyleSheet.create({
  container: {
    backgroundColor: background,
    marginTop: 16,
  }
})
