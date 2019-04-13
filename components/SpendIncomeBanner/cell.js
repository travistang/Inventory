import React from 'react'
import { Meter } from 'components'
import { FormatCurrency } from 'utils'

export default function({
  values, currency,
  ...props
}) {
  const figure = values?FormatCurrency(values, currency):'--'
  return (<Meter value={figure} {...props} />)
}
