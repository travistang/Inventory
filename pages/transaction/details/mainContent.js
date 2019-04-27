import React from 'react'
import { Transactions } from 'models/transaction'
import { StyleSheet } from 'react-native'
import {
  ContentCard, AccountCard
} from 'components'
const { BUY, CONSUME, SPEND } = Transactions.TransactionTypes
import { colors } from 'theme'
const { primary, secondary } = colors

const style = StyleSheet.create({
  consumeItemListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
})

const ContentWithoutItems = ({
  fromAccount, toAccount
}) {
  return (
    <ContentCard
      style={style.fromAccountContentCard}
      title="From account"
      icon="bank"
    >
      <AccountCard account={fromAccount || toAccount } />
    </ContentCard>
  )
}

const ContentWithItems = ({
  items = [], transactionType
}) => {
  const color = (transactionType == CONSUME)?secondary:primary

  return (
    <ContentCard
      title="items"
      icon="gift"
      style={style.consumeItemListContainer}>
      {
        items.map((item) => (
          <ItemCard
            tagColor={color}
            key={item.name} item={item} />
        ))
      }
    </ContentCard>
  )
}


export default function({
  transaction
}) {
  const { transactionType: type } = transaction

  if(type == BUY || type == CONSUME) {
    return <ContentWithItems transaction={transaction} />
  }

  if(type == SPEND) {
    return <ContentWithoutItems transaction={transaction} />
  }

  return null
}
