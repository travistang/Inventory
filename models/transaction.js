import { DB } from './'
import * as Yup from 'yup'
import AccountModel from './account'
import ItemModel from './items'
import LocationModel from './location'

import moment from 'moment'
import * as _ from 'lodash'
/*
  Transaction is a record the records the CHANGES OF ACCOUNTS' SURPLUS AND ITEMS.
  Possible transtion type are:
    - Income: from nothing to your account.
    - Buy: from account to your item.
    - Transfer: from one account to another.
    - Craft: from Item to Item (e.g. uncooked rice -> cooked rice)
    - Sell: from Item to Account
    - Consume: from Item to Nothing.

  ***
    All transactions has to be called on this class.
    Methods provided from the other classes are just wrapping around common functions on them!
  ***

*/
export class Transactions {
  static get type() {
    return "TRANSACTION"
  }
  static get TransactionTypes() {
    return {
      BUY: "BUY", // Money -> Things
      TRANSFER: "TRANSFER", // Money -> Money
      CRAFT: "CRAFT", // Things -> Things
      SELL: "SELL", // Things -> Money,
      INCOME: "INCOME", // () -> Money,
      CONSUME: "CONSUME", // Things -> (),
      SPEND: "SPEND" // Money -> ()
    }
  }

  // types that involve only items, therefore no money is involved
  static get ItemOnlyTypes() {
    const { CONSUME, CRAFT } = Transactions.TransactionTypes
    return [
      CONSUME, CRAFT
    ]
  }
  /*
    Something like "populate" in Mongoose, that recovers "from" and "to" from an object Id to account info
  */
  static async expandTransactions({
    from,
    to ,
    items,
    ...transaction}) {
    let expandedAccountRecord = transaction
    return await AccountModel.getAccountById(from)
      // get from account
      .then(from => {
        expandedAccountRecord = {
          ...expandedAccountRecord,
          from
        }
      })
      // get to account
      .then(() => AccountModel.getAccountById(to))
      .then(to => {
        expandedAccountRecord = {
          ...expandedAccountRecord,
          to
        }
      })
      // get details of each items
      .then(() => Promise.all(
        items.map(({name, ...item}) =>
          ItemModel.getItemByName(name)
            .then(originalItem => ({
                ...originalItem,
                ...item
              })
            ))
      ))
      // put expanded items to the final result
      .then(items => {
        expandedAccountRecord = {
          ...expandedAccountRecord,
          items
        }
      })
      // finally return the "expanded" record
      .then(() => expandedAccountRecord)
  }
  static get initialTransactionValues() {
    return {
      name: '',
      consumedAmount: 0,
      obtainedAmount: 0,
      from: null,
      to: null,
      tags: [],
      location: {
        coordinate: {
          lat: 0,
          lng: 0
        },
        name: null,
      },
      date: moment().toDate(),
      items: [],
      transactionType:
        Transactions.TransactionTypes.BUY
    }
  }

  constructor(DB) {
    this.DB = DB
  }

  validationSchema() {
    const { TransactionTypes } = Transactions
    return Yup.object().shape({
      name: Yup.string()
        .required('Name required'),
      consumedAmount: Yup.number()
        .min(0),
      obtainedAmount: Yup.number()
        .min(0),
      // ID's of the items
      from: Yup.string(),
      to: Yup.string(),
      tags: Tup.array().of(
        Yup.string()
      ),
      // name can be added additionally or found by reverse geoencoding.
      // coordinates should be discovered by the devices or selected by user
      location: Yup.object().shape({
        coordinate: Yup.object().shape({
          lat: Yup.number().required(),
          lng: Yup.number().required()
        }).required(),
        name: Yup.string(),
      }),
      date: Yup.date().required().min(new Date()),
      items: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required("Item name required"),
          amount: Yup.number().moreThan(0).required("Item amount required"),
          cost: Yup.number().min(0),
          // info that help understanding the changes in amount of this item
          originalAmount: Yup.number().moreThan(0),
          unit: Yup.string()
        })
      ).when("transactionType", {
          is: type => ([
              TransactionTypes.CONSUME,
              TransactionType.BUY,
              TransactionTypes.CRAFT
            ].indexOf(type) > -1),
          then: Yup.array().required()
        }),
      transactionType: Yup.string()
        .required("Transaction type required")
        .oneOf(
          Object.values(TransactionTypes)),
    })
  }
  /*

  */
  async getTransactionOfMonthOfDate(date = moment()) {
    const startOfMonth = moment(date).startOf('month').toDate()
    const endOfMonth = moment(date).endOf('month').toDate()
    const transactionsOfMonth = await this.DB.findAsync({
      type: Transactions.type,
      $and: [
        { date: { $gte: startOfMonth}},
        { date: { $lte: endOfMonth }}
      ]
    })

    return await Promise.all(
      transactionsOfMonth.map(Transactions.expandTransactions)
    )
  }
  /*
    Recover the surplus of the account given a transaction and the surplus after that.
    i.e. if an account as surplus A, went through as transaction T, and has new surplus B,
    then this function is (T, B) -> A

    In other words, given an account and it's currentAmount (more like the "intermediate amount" across the transaction history of this account),
    and a transaction you want to revert,
    it converts
  */
  getPreviousBalanceFromTransaction({
    transaction,
    currentAmount,
    accountId,
  }) {
    const {
      consumedAmount = 0,
      obtainedAmount = 0,
      from, to,
      transactionType } = transaction
    const {
      BUY, SELL, SPEND, INCOME, TRANSFER // all actions involving an "account"
    } = Transactions.TransactionTypes

    switch(transactionType) {
      case BUY:
      case SPEND:
        return currentAmount + consumedAmount
      case SELL:
      case INCOME:
        return currentAmount - obtainedAmount
      case TRANSFER:
        if(accountId == from) {
          // this is the account that gives money
          return currentAmount + consumedAmount
        } else {
          // this is the account that receives money
          return currentAmount - obtainedAmount
        }
      default:
        return currentAmount
    }
  }
  async getAccountRecentBalance({ accountId, numData }) {
    const account = await AccountModel.getAccountById(accountId)
    const { amount: currentAmount } = account
    const allTransactions = await this.DB.findAsync({
      type: Transactions.type
    })
    const recentTransactions = await this.DB.find({
      type: Transactions.type,
      $or: [
        {from: accountId},
        {to: accountId}
      ]
    }) // select date and amount only
    .sort({date: -1})
    .limit(numData)
    .exec()
    // finalize the result
    const results = recentTransactions
      .reduce(
        (amountList, transaction) => amountList.concat(
          this.getPreviousBalanceFromTransaction({
            transaction,
            accountId,
            currentAmount: _.last(amountList)
          })
        ),
        [currentAmount])
      .reverse() // from recent to past, to another way around...

    return results
  }
  async spend({
    name,
    accountId,
    amount
  }) {
    return await this.income({name, accountId, amount: -amount})
  }
  async consume({
    name,
    items
  }) {
    // for each item, record the consumption
    // everything is the same, except the amount takes a negative sign as this is a consumption transaction
    items = await Promise.all(
      items.map(item =>
        ({...item, amount: -item.amount})
      ).map( async (item, i) => {
        const result = await ItemModel.add(item)
        if(!result) return 
        return ({
          ...item,
          // because it is turned to negative, so turn it back to positive again
          amount: -item.amount,
          originalAmount: result.amount - item.amount,
          unit: result.unit
        })
      })
    )
    const { CONSUME } = Transactions.TransactionTypes
    // then add the transaction record
    return await this.addTransactionRecord({
      name, items,
      transactionType: CONSUME
    })
  }

  async income({
    name,
    accountId,
    amount,
  }) {
    const result = await AccountModel.addIncome({
      accountId, amount
    })
    const {
      INCOME, SPEND
    } = Transactions.TransactionTypes
    if(!result) return // something wrong with the data.
    const isIncome = amount > 0
    return await this.addTransactionRecord({
      name,
      from: isIncome?null:accountId,
      to: isIncome?accountId:null,
      obtainedAmount: isIncome?amount:0,
      consumedAmount: isIncome?0:-amount, // because amount would be < 0, so consumedAmount is > 0
      transactionType: isIncome? INCOME : SPEND
    })
  }
  // create a transfer instance
  // ALSO MODIFY THE AFFECTED ACCOUNTS' BALANCES
  async transfer({
    name,
    fromAccountId, toAccountId,
    amount, exchangeRate = null }) {

    if(fromAccountId == toAccountId) return //....
    const toAccount = await AccountModel.getAccountById(toAccountId)
    const fromAccount = await AccountModel.getAccountById(fromAccountId)
    if(!toAccount || !fromAccount) return

    // retrieve info from models
    const {
      currency: toCurrency,
      amount: toAmount,
      _id: toId
    } = toAccount
    const {
      currency: fromCurrency,
      amount: fromAmount,
      _id: fromId
    } = fromAccount

    if(fromAmount < amount) return // sorry but it can't be negative
    // ensure exchange rate is not null
    exchangeRate = exchangeRate || AccountModel.getExchangeRate({
        from: fromCurrency,
        to: toCurrency
      })
    const consumedAmount = amount
    const obtainedAmount = amount * exchangeRate
    await AccountModel.addIncome({
      accountId: fromId, amount: -consumedAmount})
    await AccountModel.addIncome({
      accountId: toId, amount: obtainedAmount})

    // finally insert a transaction record
    return await this.addTransactionRecord({
      type: Transactions.type,
      transactionType:
        Transactions.TransactionTypes.TRANSFER,
      from: fromId,
      to: toId,
      consumedAmount,
      obtainedAmount,
      name,
    })
  }
  // generic add transaction record.
  // DO NOT CALL THIS DIRECTLY FROM OUTSIDE OF THIS CLASS!
  async addTransactionRecord({
    name,
    date = new Date(),
    consumedAmount = 0,
    obtainedAmount = 0,
    from = null, to = null,
    exchangeRate = null,
    items = [],
    transactionType = Transactions.TransactionTypes.BUY}) {
    const { CONSUME, CRAFT } = Transactions.TransactionTypes
    const itemsOnly = [CONSUME, CRAFT].indexOf(transactionType) > -1

    // at least one of the "from" and "to" is there
    // except when this transaction involves items only
    if(!from && !to && !itemsOnly) return null
    if(!consumedAmount && !obtainedAmount && !itemsOnly) return null

    return await this.DB.insertAsync({
      name,
      consumedAmount, obtainedAmount,
      date,
      from, to,
      transactionType,
      items,
      type: Transactions.type
    })
  }
  // get recent transactions from the database, sorted from newest to oldest.
  // this returns the `pages * numRecords`-th to `(pages + 1 ) * numRecords`-th transactions
  async getRecentTransactions({ numRecords = 10, page = 0}) {
    return new Promise((resolve, reject ) => this.DB.find({
      type: Transactions.type,
    })
    .sort({ date: -1})
    .skip(numRecords * page)
    .limit(numRecords)
    .exec(
      (err, res) => (err?reject(err):resolve(res))
    ))
  }
  async getTotalNumberOfTransactions() {
    return await new Promise((res, _) =>
      this.DB.count(
        { type: Transactions.type },
        (err, count) => err?reject():res(count)
      )
    )
  }
  async getTransactionsOfAccount({_id}) {
    return await this.DB.findAsync({
      type: Transactions.type,
      $or: [
        {from: _id},
        {to: _id}
      ]
    })
  }

  /*
      Methods related to items
      items: [{
        name: String,
        amount: Number,
        cost: Number > 0
      }],
      date: Date
  */
  async buy({
    fromAccount,
    items, // this is a list!
    name,
    location,
    date,
  }) {
    try {
      await Yup.object().shape({
        items: Yup.array().required().of(
          Yup.object().shape({
            name: Yup.string().required(),
            amount: Yup.number().moreThan(0).required(),
            cost: Yup.number().min(0).required(),
            originalAmount: Yup.number().moreThan(0),
            unit: Yup.string()
          })
        ),
        name: Yup.string().required(),
        date: Yup.date().required(),
        fromAccount: Yup.string().required()
      }).validate({ fromAccount, items, name, date})
    } catch(err) {
      alert(`error validating buy: ${err.message}`)
      return
    }

    // check if total expenditure is more than sum of account.
    const account = await AccountModel.getAccountById(fromAccount)
    if(!account) return
    const { amount: surplus } = account

    const totalExpenditure = items.reduce((sum, item) => sum + item.cost, 0.0)
    // you can't spend more than you have... for now
    if (totalExpenditure > surplus) return null
    await AccountModel.addIncome({
      accountId: account._id,
      amount: -totalExpenditure
    })

    // add all items
    let canAddSuccessfully = true

    items.forEach(async function(itemChange, i) {
      let result = await ItemModel.add(itemChange)
      alert(`buy: ${JSON.stringify(this)}`)
      this[i].originalAmount = result.amount - itemChange.amount
      this[i].unit = result.unit
    })

    return await this.addTransactionRecord({
      name,
      date,
      consumedAmount: totalExpenditure,
      from: fromAccount,
      transactionType: Transactions.TransactionTypes.BUY,
      items
    })
  }
}

const Transaction = new Transactions(DB)
export default Transaction
