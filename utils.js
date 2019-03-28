import React from 'react'
import PropTypes from 'prop-types'
import { colors } from './theme'
import HeaderComponent from './components/HeaderComponent'
const {
  background,
  textSecondary
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
  return `${amount.toFixed(2)} ${unit}`
}

export const CommonHeaderStyle = {
  backgroundColor: background,
  elevation: 0,
  shadowColor: 'transparent'
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

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export const addOpacity = (color, opacity = 1) => {
  const rgb = hexToRgb(color)
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})`
}

export const AccountHeaderConfig = ({title, icon}) => ({
  headerStyle: CommonHeaderStyle,
  headerTintColor: textSecondary,
  headerTitle: (
    <HeaderComponent
      title={title}
      icon={icon}
    />
  )
})
