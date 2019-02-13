import React from 'react'
import {
  Platform, StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native'

import {
  Text,
  Button
} from 'react-native-elements'

export default class ItemPage extends React.Component {
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      headerTitle:(
        <View style={{
            marginLeft: 16,
            flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="food" />
          <Text> {' '} </Text>
          <View>
            <Text>
              ITEMS
            </Text>
          </View>
        </View>
      ),
    }
  }

  render() {
    return null
  }
}
