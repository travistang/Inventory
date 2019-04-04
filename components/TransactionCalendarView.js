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

export default class TransactionCalendarView extends React.Component {
  static defaultProps = {
    transactionsOfMonth: [],
    themeColor: primary
  }
  static propTypes = {
    onDaySelected: PropTypes.func.isRequired,
    onMonthChanged: PropTypes.func.isRequired,
    transactionsOfMonth: PropTypes.arrayOf(
      TransactionPropTypes
    ).isRequired,
    themeColor: PropTypes.string
  }
  getMarkedDates() {
    const { transactionsOfMonth, themeColor } = this.props
    // prepare a "YYYY-mm-dd: { marked: true}" pair
    const markedDates = transactionsOfMonth.map(trans => ({
      [moment(trans.date).format('YYYY-MM-DD')]:
        { marked: true, selectedColor: themeColor }
    })).reduce(
      (markedDates, date) => ({...markedDates, ...date}),
    {})
    return markedDates
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
  render() {
    const { onDaySelected, onMonthChanged } = this.props
    return (
      <Calendar
        hideExtraDays={true}
        maxDate={new Date()}
        onDayPressed={onDaySelected}
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
