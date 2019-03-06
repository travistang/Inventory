import React from 'react'

import {
  StyleSheet, View, ScrollView, TouchableOpacity
} from 'react-native'
import {
  Text, Button
} from 'react-native-elements'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import ConsumeForm from '../../forms/consume'
import TransactionModel from '../../models/transaction'
import HeaderComponent from '../../components/HeaderComponent'

export default class ConsumePage extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: (
        <HeaderComponent
          title="consume items"
          icon="fire"
        />
      )
    }
  }
  async onConsume(form) {
    return await TransactionModel.consume(form)
  }
  render() {
    return (
      <ScrollView>
        <View style={{margin: 16}}>
          <ConsumeForm
            onConsume={(form) => this.onConsume(form)}
          />
        </View>
      </ScrollView>
    )
  }
}
