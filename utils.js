import React from 'react'
import PropTypes from 'prop-types'
import { colors } from './theme'
const {
  background
} = colors
export const FormatCurrency = (amount, currency) => {
  const value = parseFloat(amount).toFixed(2)
  const negativeSign = (amount < 0)?"-":""
  switch(currency) {
    case "HKD":
      return `${negativeSign}\$${value} HKD`
    case "USD":
      return `${negativeSign}\$${value} USD`
    case "EUR":
      return `${negativeSign}${value}€`
    case "PLN":
      return `${negativeSign}${value}zł`
    default:
      return `${negativeSign}${value}${currency}`
  }
}

export const FormatItemAmount = (amount, item) => {
  const { unit } = item
  return `${amount} ${unit}`
}

export const CommonHeaderStyle = {
  backgroundColor: background,
  elevation: 0
}

export const TransactionPropTypes = PropTypes.shape({
  name: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date),
  from: PropTypes.string,
  to: PropTypes.string,
  consumedAmount: PropTypes.number,
  obtainedAmount: PropTypes.number,
  type: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      cost: PropTypes.number
    })
  )
}).isRequired

export const AccountPropTypes = PropTypes.shape({

}).isRequired
