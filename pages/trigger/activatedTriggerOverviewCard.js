import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

export default class ActivatedTriggerOverviewCard extends React.Component {
	render() {
		const {
			item: { name },
			triggerType,
			triggerAmount
		} = this.props.trigger

		return (
			<TouchableOpacity style={style.container}>
				<Text style={style.name}>{name}</Text>
			</TouchableOpacity>
		)
	}
}
