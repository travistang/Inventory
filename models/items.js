import { DB } from './'

import * as Yup from 'yup'
import * as Qty from 'js-quantities'
import PropTypes from 'prop-types'
import { Transactions } from './transaction'
import { recognizedUnits } from '../constants'
export class Item {
  static get type() {
    return "ITEM"
  }
  static get propTypes() {
    return PropTypes.shape({
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired,
    })
  }
  static get initialItemValues() {
    return {
      name: '',
      amount: 0,
      unit: recognizedUnits[0],
      // craftable: true,
    }
  }

  validationSchema() {
    return Yup.object().shape({
      name: Yup.string()
        .required('Name required'),
      amount: Yup.number()
        .min(0)
        .required('Amount required'),
      unit: Yup.string()
        .oneOf(recognizedUnits)
        .required('unit required'),
    })
  }

  constructor(DB) {
    this.DB = DB
  }
  // analogy to "addIncome" in account method
  async add({
    name,
    amount
  }) {
    const item = await this.getItemByName(name)
    if(!item) return null
    const newAmount = item.amount + amount
    if(newAmount < 0) return null
    const result = await this.DB.updateAsync({
      type: Item.type,
      _id: item._id,
    }, { $set: {amount: newAmount}})
    return { ...item, amount: newAmount}
  }
  async createItem({
    name,
    amount, unit
  }) {
    return await this.DB.insert({
      // name without double spaces, or spaces before or after
      name: name.replace(/\ +/g, ' ').trim(),
      amount,
      unit,
      type: Item.type
    })
  }

  async getItems() {
    return await this.DB.findAsync({ type: Item.type })
  }
  // perform case insensitive search
  async getItemByName(name) {
    return await this.DB.findOneAsync({
      name: { $regex: new RegExp(`${name}`, 'i')},
      type: Item.type,
    })
  }
  /*
    get transactions involving the given items,
    sorted from closest dates to earliest
  */
  async getTransactionsOfItems({ name }, numItems = null) {
    let query = this.DB.find({
      type: Transactions.type,
      items: {
        // if in this transaction, one of the items has the same name with the given item
        $elemMatch: { name }
      }
    }).sort({ date: -1 })
    if(numItems) {
      query = query.limit(numItems)
    }
    return await new Promise((resolve, reject) => {
      query.exec((err, docs) => {
        if(err) reject(err)
        else resolve(docs)
      })
    })
  }
}
export default new Item(DB)
