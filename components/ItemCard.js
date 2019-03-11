import React from 'react'
import {
  View, StyleSheet, Text,
  TouchableOpacity
} from 'react-native'
import { FormatItemAmount } from '../utils'
import TagCard from './TagCard'
import { colors } from '../theme'
const {
  primary, white
} = colors

const style = StyleSheet.create({
  consumeItemContainer: {
    width: '45%'
  },
  consumeTagCardMainElement: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  consumeTagCardVirtualElement: {
    marginHorizontal: 4
  },
  consumeTagCardTagElement: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: primary,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  consumeMainCardText: {
    // fontSize: 24,
    width: '100%'
  },
  consumeTagCardText: {
    // fontSize: 36
    color: white
  },
})
export default function({
  item,
  style: customStyle = {},
  onPress
}) {
  const { name: itemName, amount } = item
  return (
    <TouchableOpacity
      key={itemName}
      style={style.consumeItemContainer}
    >
      <TagCard
        config={{containerHeight: 72}}
        virtualContainerStyle={style.consumeTagCardVirtualElement}
        mainElement={(
          <View style={style.consumeTagCardMainElement}>
            <Text
              style={style.consumeMainCardText}>
              {itemName}
            </Text>
          </View>

        )}
        tagElement={(
          <View style={style.consumeTagCardTagElement}>
            <Text style={style.consumeTagCardText}>
              {FormatItemAmount(amount, item)}
            </Text>
          </View>
        )}
      />
    </TouchableOpacity>

  )
}
