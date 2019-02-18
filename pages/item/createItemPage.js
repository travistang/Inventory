import React from 'react'
import {
  View, StyleSheet
} from 'react-native'
import {
  Text
} from 'react-native-elements'
import CreateItemForm from '../../forms/createItem'
import ItemModel from '../../models/items'
export default class CreateItemPage extends React.Component {
  async createItem({name, amount, unit}) {
    const result = await ItemModel.createItem({name, amount, unit})
    this.props.navigation.pop()
  }

  render() {
    return (
      <View style={style.container}>
        <Text h3>
          Create an item
        </Text>
        <CreateItemForm
          style={style}
          validationSchema={ItemModel.validationSchema()}
          onSubmit={this.createItem.bind(this)}
        />
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    margin: 16
  },
  submitButton: {
    marginTop: 16
  }
})
