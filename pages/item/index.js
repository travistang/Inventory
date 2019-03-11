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
import Background from '../../components/Background'
import HeaderComponent from '../../components/HeaderComponent'
import {
  CommonHeaderStyle
} from '../../utils'

export default class ItemPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
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
      <Background
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.loadItemsList.bind(this)}
          />
        }
        style={style.container}
      >
      {
        (items.length)?(
          <View style={style.innerContainer}>
            {
              items.map(item => (
                <ItemCard key={item.name} item={item} />
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
}

const style = StyleSheet.create({
  innerContainer: {
    display: 'flex',
    flexDirection:'row',
    flexWrap: 'wrap',
    margin: 16
  }
})
