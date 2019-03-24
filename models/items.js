import { DB } from './'

import * as Yup from 'yup'
import * as Qty from 'js-quantities'
import { recognizedUnits } from '../constants'
class Item {
  static get type() {
    return "ITEM"
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
}
export default new Item(DB)
