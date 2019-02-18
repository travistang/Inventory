import React from 'react'

export default class ItemDetailsPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {
      params: { name } = {name: ""}
    } = navigation.state
    return {
      title: name
    }
  }
  render() {
    return null
  }
}
