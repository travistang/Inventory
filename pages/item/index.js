import React from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native'

import {
  Text,
  Button
} from 'react-native-elements'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import ItemCard from '../../components/ItemCard'
import ItemModel from '../../models/items'
import CenterNotice from '../../components/CenterNotice'

export default class ItemPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      headerTitle: (
        <View style={{
            marginLeft: 16,
            flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="gift" size={22} />
          <Text> {' '} </Text>
          <View>
            <Text>
              ITEMS
            </Text>
          </View>
        </View>
      ),
      headerRight: (
        <Button
          type="clear"
          onPress={() => navigation.push('CreateItemPage')}
          icon={{name: 'add'}}
        />
      )
    }
  }
  constructor(props) {
    super(props)

    this.state = {
      items: [],
      refreshing: false
    }

    // reload the list whenever it has been focused
    this.props.navigation.addListener('didFocus',
     this.loadItemsList.bind(this))
  }
  async loadItemsList() {
    const items = await ItemModel.getItems()
    this.setState({ items })
  }
  toItemPage(item) {
    this.props.navigation.push('ItemDetailsPage', { item })
  }
  render() {
    const { items } = this.state
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.loadItemsList.bind(this)}
          />
        }
        style={style.container}
      >
      {
        !(items.length) && (
          <CenterNotice
            title="You have no items"
            subtitle="Click on the '+' button to add one."
          />
        )
      }
      {
        items.map(item => (
          <ItemCard item={item}
            onClick={() => this.toItemPage(item)}
          />
        ))
      }

      </ScrollView>
    )
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection:'column',
  }
})
