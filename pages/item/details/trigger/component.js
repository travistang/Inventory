import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { CommonHeaderStyle } from "utils"
import { colors, iconOf } from "theme"
import { HeaderComponent, Background } from "components"

const style = StyleSheet.create({})

export default class TriggerPage extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			headerStyle: CommonHeaderStyle,
			headerTitle: <HeaderComponent title="trigger" icon={iconOf.trigger} />
		}
	}

	render() {
		return <Background />
	}
}
