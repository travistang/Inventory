import React from 'react'
import PropTypes from 'prop-types'

import {
  StyleSheet, View, ScrollView
} from 'react-native'
import {
  Text,
  Button
} from 'react-native-elements'
import HeaderComponent from '../../components/HeaderComponent'

export default class TransactionPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
        headerTitle: (
          <HeaderComponent
            title="transactions"
            icon="exchange"
          />
        )
    }
  }

  render() {
    return (
      <ScrollView style={style.container}>
      </ScrollView>
    )
  }
}

const style = StyleSheet.create({
  container: {
    display: 'flex',
    margin: 16
  }
})
