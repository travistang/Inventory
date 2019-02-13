import React from 'react'

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
