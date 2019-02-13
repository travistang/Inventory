import { DB } from './'
import axios from 'axios'

import * as Yup from 'yup'
import TransactionModel from './transaction'

class Account {
  static get type() {
    return "ACCOUNT"
  }
  static get initialAccountValues() {
    return {
      name: '',
      amount: 0,
      currency: 'EUR',

    }
  }
  validationSchema() {
    return Yup.object().shape({
      name: Yup.string()
        .required('Name required'),
      amount: Yup.number()
        .min(0)
        .required('Amount required'),
      currency: Yup.string()
        // .oneOf(Account.recognizedCurrency)
        .required('Currency required')
    })
  }
  constructor(DB) {
    this.DB = DB
    this.recognizedCurrency = []
    this.exchangeRate = {}
    // obtain list of currencies
    axios.get('https://api.exchangeratesapi.io/latest')
      .then(({ data }) => {
        const { base = null, rates = {} } = data

        this.recognizedCurrency = [base]
          .concat(Object.keys(rates))
          .sort()
        // store the exchange rate
        this.exchangeRate = {
          ...rates,
          [base]: 1.0
        }
      })
  }

  // TODO: account filtering function here
  async getAccounts() {
    const accounts = await this.DB.findAsync({
        type: Account.type
    })
    return accounts
  }
  async getAccountById(accountId) {
    return await this.DB.findOneAsync({
      type: Account.type,
      _id: accountId
    })
  }
  /*
    Create an account
  */
  async addAccount({ name, amount = 0, currency = 'EUR' }) {
    const payload = {
      name,
      amount,
      currency,
      type: Account.type
    }
    const newAccount = await this.DB.insert(payload)
    return newAccount
  }
  /*
    Util functions for getting exchange rates
    Since this only matters to the account, it is put here.
  */
  getExchangeRate({from, to = 'EUR'}) {
    const {
      [to]: toRate,
      [from]: fromRate
    } = this.exchangeRate
    if(!toRate || !fromRate) return 1.0
    return toRate / fromRate
  }
  /*
    Add an amount to a given account ID
  */
  async addIncome({ accountId, amount}) {
    const account = await this.getAccountById(accountId)
    if(!account) return null
    const newBalance = account.amount + amount
    if(newBalance < 0) return null
    const result = await this.DB.updateAsync({
      type: Account.type,
      _id: accountId
    }, { $set: {amount: newBalance} })
    return {...account, amount: newBalance}
  }

  async removeAllAccounts() {
    return new Promise(
      (resolve, reject) => this.DB.remove(
        {}, { multi: true }, (err, _) => {

        if(err) reject(err)
        else resolve()
      })
    )
  }
}
const AccountModel = new Account(DB)
export default AccountModel
