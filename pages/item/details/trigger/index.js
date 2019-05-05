import React from "react"
import TriggerModel from "models/trigger"
import { Item } from "models/items"
import { withNavigation } from "react-navigation"
import PropTypes from "prop-types"
import Component from "./component"

export class CreateTriggerPageContainer extends React.Component {
	static navigationOptions = Component.navigationOptions

	constructor(props) {
		super(props)

		this.state = {
			triggers: [],
			item: {}, // to be set in componentDidMount
			showError: false
		}
	}
	/**
		Fetch the list of trigger associated to the item
	*/
	async componentDidMount() {
		const item = this.props.navigation.getParam("item", {})
		this.setState({ item })

		const triggers = await TriggerModel.getTriggerOfItem(item._id)
		this.setState({ triggers })
	}
	/**
    Invoke actual trigger insertion.
    If the Trigger is added, the form will be reset, otherwise the form stays unchanged and error is reported.
  */
	async addTrigger(trigger) {
		const triggerAdded = await TriggerModel.addTrigger(trigger)

		if (triggerAdded) {
			// reset form here.
		} else {
			this.setState({ showError: true })
			// the time to toggle the flag back
			setTimeout(() => this.setState({ showError: false }), 3000)
		}
	}
	render() {
		return <Component {...this.state} />
	}
}

export default withNavigation(CreateTriggerPageContainer)
