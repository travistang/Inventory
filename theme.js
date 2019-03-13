import { setCustomText } from 'react-native-global-props'
import { Transactions } from './models/transaction'

export const configureGlobalProps = () => {
  setCustomText({
    style: {
      fontFamily: "Raleway"
    }
  })
}
export default theme = {
  Text: {
    h2Style: {
      fontWeight: 'regular'
    },
    h3Style: {
      fontWeight: 'regular'
    }
  },
  Button: {
    raised: true
  }
}
export const rgbToHex = (r,g,b) => {
  const decToHex = dec => Number(dec).toString(16)
  return `#${decToHex(r)}${decToHex(g)}${decToHex(b)}`
}
export const colors = {
  background: rgbToHex(248,249,250),
  white: rgbToHex(255,255,255),
  black: rgbToHex(0,0,0),
  // text colors
  textPrimary: rgbToHex(0,0,0),
  textSecondary: rgbToHex(168,168,168),
  // background / solid colors
  primary: rgbToHex(255,41,17),
  secondary: rgbToHex(57,104,255),
  danger: rgbToHex(255,89,63),
  info: rgbToHex(126,117,140),
}

export const shadow = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
}

export const colorForType = (type) => {
  const {
    BUY, TRANSFER, CRAFT,
    SELL, INCOME, CONSUME, SPEND
  } = Transactions.TransactionTypes
  const {
    textPrimary, textSecondary,
    primary, secondary, danger, info, white, background
  } = colors
  switch(type) {
    case BUY:
    case SPEND:
      return danger
    case TRANSFER:
      return info
    case INCOME:
      return secondary
    default:
      return textSecondary
  }
}
