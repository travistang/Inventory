import Datastore from 'react-native-local-mongodb'
import axios from 'axios'
import * as Crypto from 'aes-js'
import { serverURL } from '../constants'

export const DB = new Datastore({
   filename: 'asyncStorageKey',
   autoload: true
})

// TODO: encrypt the payload before saving to database
export const exportDB = (address = serverURL) => {
  return DB.findAsync({}).then(db =>
    axios.post(address, db)
  )
}

/*
  A dictionary that contains valid options of intepreting a quantity of buying / consuming an item.
  Each options consists of two things: "name" and "realValue",
  name is self-explantory.
  conversionFunction is a function that gives the intepreted DIFFERENCES in amount of item under that mode given a quantity,
    therefore it is supposed to be a function, that takes a number.
*/
export const quantityOptions = {
  buy: [
    {
      name: "literally",
      conversionFunction: (originalValue, quantity) => quantity
    },
    {
      name: "% increased",
      conversionFunction: (originalValue, quantity) => originalValue * quantity / 100
    },
    {
      name: "times",
      conversionFunction: (originalValue, quantity) => quantity * originalValue
    }
  ],
  consume: [
    {
      name: "literally",
      conversionFunction: (originalValue, quantity) => -quantity
    },
    {
      name: "remaining",
      conversionFunction: (originalValue, quantity) => -(originalValue - quantity)
    },
    {
      name: "% left",
      // say you say 90% left, then quantity is 90, and differences would be 0.1 * originalValue
      conversionFunction: (originalValue, quantity) => -(1 - quantity / 100) * originalValue
    },
    {
      name: "% of",
      // save you say you used 90% of the original value, then of course the differences would be 0.9 * originalValue
      conversionFunction: (originalValue, quantity) => -quantity / 100 * originalValue
    },
    {
      name: "all",
      conversionFunction: (originalValue, quantity) => -originalValue
    }
  ]
}

export const flagOfCurrency =
  cur => `https://raw.githubusercontent.com/transferwise/currency-flags/master/src/flags/${cur.toLowerCase()}.png`
