import React from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Text
} from 'react-native'
import { SearchBar } from 'react-native-elements'
import {
  Button,
  ItemCard,
  CenterNotice,
  Background,
  HeaderComponent,
} from 'components'
import { CommonHeaderStyle } from 'utils'
import { colors } from 'theme'
const { textPrimary } = colors

export const navigationOptions = ({navigation}) => {
  return {
    headerStyle: CommonHeaderStyle,
    headerTitle: (
      <HeaderComponent
        title="items"
        icon="gift"
      />
    ),
    headerRight: (
      <Button
        color={textPrimary}
        type="clear"
        onPress={() => navigation.push('CreateItemPage')}
        icon="add"
      />
    )
  }
}

const style = StyleSheet.create({
  innerContainer: {
    display: 'flex',
    flexDirection:'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    margin: 16
  }
})

export default function({
  items,
  refreshing,
  onRefresh,
  onItemClick,
  searchTerm,
  onSearchTermChanged
}) {
  return (
    <Background
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      style={style.container}
    >
    <SearchBar
      lightTheme
      round
      inputStyle={{fontFamily: 'Railwey'}}
      inputContainerStyle={{backgroundColor: 'white'}}
      containerStyle={{backgroundColor: 'transparent', borderWidth: 0, shadowColor: 'transparent'}}
      placeholder="Filter items..."
      onChangeText={onSearchTermChanged}
      value={searchTerm}
    />
    {
      (items.length)?(
        <View style={style.innerContainer}>
          {
            items.map(item => (
              <ItemCard
                key={item.name}
                onPress={() => onItemClick(item)}
                item={item} />
            ))
          }
        </View>
      ):(
        <CenterNotice
          title="You have no items"
          subtitle="Click on the '+' button to add one."
        />
      )
    }

  </Background>
  )
}
