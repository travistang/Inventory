import React from 'react'
import {
  View, StyleSheet,
  Text
} from 'react-native'
import {
  CommonHeaderStyle
} from '../../utils'

import HeaderComponent from '../../components/HeaderComponent'
import CreateItemForm from '../../forms/createItem'
import ItemModel from '../../models/items'
import Background from '../../components/Background'
import { colors } from '../../theme'
const { primary, secondary, white } = colors

export default class CreateItemPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerStyle: CommonHeaderStyle,
      headerTitle: (
        <HeaderComponent
          title="Create an item"
          icon="gift"
        />
      )
    }
  }
  async createItem({name, amount, unit}) {
    const result = await ItemModel.createItem({name, amount, unit})
    this.props.navigation.pop()
  }

  render() {
    return (
      <Background style={style.container}>
        <CreateItemForm
          style={style}
          validationSchema={ItemModel.validationSchema()}
          onSubmit={this.createItem.bind(this)}
        />
      </Background>
    )
  }
}

const style = StyleSheet.create({
  container: {
    padding: 16
  },
  header: {
    fontSize: 22,
  },
  submitButton: {
    marginTop: 16
  },
  formContainer: {
    backgroundColor: 'transparent'
  },
  button: {
    backgroundColor: secondary
  },
  cardContainer: {
    padding: 8,
  },
  unitRowContainer: {
    paddingHorizontal: 8
  }
})
