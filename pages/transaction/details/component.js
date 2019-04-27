import React from 'react'
import {
  StyleSheet,
  View, Text
} from 'react-native'

import {
  Background, LocationPreviewCard
} from 'components'
import DetailsHeaderSection from './detailsHeader'
import MainContent from './mainContent'

import { colors } from 'theme'
const { primary, secondary,
  danger, white, background, textSecondary } = colors

const style = StyleSheet.create({
  headerText: {
    color: white,
  },
  subSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 16
  },
  mainContainer: {
    marginHorizontal: 16,
  },

  subSectionHeaderText: {
    // fontSize: 26,
    textAlign: 'center'
    // paddingLeft: 8
  },

  fromAccountContentCard: {
    paddingHorizontal: 0,
    backgroundColor: 'transparent'
  }
})

export default function({
  transaction
}) {
  return (
    <Background>
      <DetailsHeaderSection
        transaction={transaction}
      />
      <View style={style.mainContainer}>
        <LocationPreviewCard
          location={transaction.location}
        />
        <MainContent transaction={transaction} />
      </View>
    </Background>
  )
}
