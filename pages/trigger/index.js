import React from "react"
import PropTypes from "prop-types"
import TriggerModel, { Trigger } from "models/trigger"
import Component from "./component"

export default class TriggerPageContainer extends React.Component {
  static navigationOptions = Component.navigationOptions
  constructor(props) {
    super(props)

    this.state = {
      triggers: []
    }
  }
  /**
    Fetch all saved triggers when component is mounted.
  */
  async componentDidMount() {
    const triggers = await TriggerModel.getAllTriggers(false)
    this.setState({ triggers })
  }

  render() {
    return <Component {...this.state} />
  }
}
