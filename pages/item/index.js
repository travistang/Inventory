import React from "react"
import {
	StyleSheet,
	View,
	ScrollView,
	TouchableOpacity,
	RefreshControl,
	Text,
	Button
} from "react-native"

import Icon from "react-native-vector-icons/dist/FontAwesome"
import { ItemCard, CenterNotice, Background, HeaderComponent } from "components"
import ItemModel from "models/items"

import Component, { navigationOptions } from "./component"

export default class ItemPage extends React.Component {
	static navigationOptions = navigationOptions
	constructor(props) {
		super(props)

		this.state = {
			items: [],
			refreshing: false,
			searchTerm: ""
		}

		// reload the list whenever it has been focused
		this.props.navigation.addListener("didFocus", this.loadItemsList.bind(this))
	}

	async loadItemsList() {
		this.setState(
			{
				refreshing: true
			},
			async () => {
				const items = await ItemModel.getItems()
				this.setState({
					items,
					refreshing: false
				})
			}
		)
	}

	toItemPage(item) {
		this.props.navigation.push("ItemDetailsPage", { item })
	}
	render() {
		const { items: allItems, searchTerm } = this.state
		const finalState = {
			...this.state,
			items: allItems.filter(({ name }) =>
				new RegExp(searchTerm, "i").test(name)
			)
		}
		return (
			<Component
				{...finalState}
				onSearchTermChanged={searchTerm => this.setState({ searchTerm })}
				onRefresh={this.loadItemsList.bind(this)}
				onItemClick={this.toItemPage.bind(this)}
			/>
		)
	}
}
