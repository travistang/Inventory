import React from "react"
import { CommonHeaderStyle } from "utils"
import { colors, iconOf } from "theme"
import {
	CenterNotice,
	Button,
	Background,
	ContentCard,
	HeaderComponent
} from "components"
import { Text, View, StyleSheet } from "react-native"
import PropTypes from "prop-types"
const { primary, secondary } = colors

export default class TriggerPage extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			headerStyle: CommonHeaderStyle,
			headerTitle: <HeaderComponent title="Triggers" icon="target" />
		}
	}
	constructor(props) {
		super(props)
		this.explainationText = `
  A trigger is an object indicating that an attribute of an item is to be monitored. If the attribute fulfills the trigger requirement, the trigger is said to be activated. Items associated to an activated trigger will be added to item inputs automatically.
    `
	}
	render() {
		const { triggers = [] } = this.props
		return (
			<Background>
				<Text style={style.explaination}>{this.explainationText}</Text>
				{triggers.length ? (
					<ContentCard>
						{triggers.map(trig => (
							<Text>{trig.name}</Text>
						))}
					</ContentCard>
				) : (
					<CenterNotice
						icon={iconOf.trigger}
						title="No triggers configured"
						subtitle="Triggers can be added on the items' detail page."
					/>
				)}
			</Background>
		)
	}
}

const style = StyleSheet.create({
	explaination: {
		textAlign: "justify",
		paddingHorizontal: 16
	}
})
