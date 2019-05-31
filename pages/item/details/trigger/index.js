import React from "react"
import TriggerModel from "models/trigger"
import ItemModel, { Item } from "models/items"
import { withNavigation } from "react-navigation"
import PropTypes from "prop-types"
import Component from "./component"
import { ToastAndroid } from "react-native"

export class CreateTriggerPageContainer extends React.Component {
	static navigationOptions = Component.navigationOptions

	constructor(props) {
		super(props)

		this.state = {
			item: null,
			errorMessage: null
		}
	}
	async reloadItem(id = null) {
		const itemFromState = this.state.item
		if (!itemFromState && !id) return // can't find item id in both location
		const useId = id ? id : itemFromState._id // if the id is given, use that id to load item; else use the one in state
		if (useId) {
			const item = await ItemModel.getItemById(useId)
			this.setState({ item })
		}
	}
	async onToggleActivate(triggerType) {
		const isTriggerToggled = await TriggerModel.toggleActivate(
			this.state.item,
			triggerType
		)
		if (isTriggerToggled) {
			this.reloadItem()
		} else {
			this.showError("Cannot toggle trigger")
		}
	}

	async onUpdateValue(triggerType, value) {
		const isValueUpdated = await TriggerModel.updateTriggerValue(
			this.state.item,
			triggerType,
			value
		)
		if (isValueUpdated) {
			this.reloadItem()
			this.showError("trigger value updated") // HACK: display a message through 'error'
		} else {
			this.showError("Cannot update value")
		}
	}

	showError(errorMessage) {
		this.setState({ errorMessage })
	}
	/**
		Fetch the list of trigger associated to the item
	*/
	async componentDidMount() {
		const { _id } = this.props.navigation.getParam("item", {})
		this.reloadItem(_id)
	}

	render() {
		const { item } = this.state
		if (!item) return null
		return (
			<Component
				{...this.state}
				onUpdateValue={this.onUpdateValue.bind(this)}
				onToggleActivate={this.onToggleActivate.bind(this)}
			/>
		)
	}
}

export default withNavigation(CreateTriggerPageContainer)
