import React from "react"
import { View, Text, StyleSheet, ToastAndroid } from "react-native"
import { CommonHeaderStyle } from "utils"
import { colors, iconOf } from "theme"
import { HeaderComponent, Background } from "components"
import TriggerOptionCard from "./triggerOptionCard"

const style = StyleSheet.create({
	container: {
		padding: 16
	}
})

/**
	Page for rendering triggers of an item.
 	Each item should have at most one trigger for each trigger type.

*/
export default class CreateTriggerPage extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			headerStyle: CommonHeaderStyle,
			headerTitle: <HeaderComponent title="trigger" icon={iconOf.trigger} />
		}
	}
	componentDidUpdate(prevProps, prevState, _) {
		const { errorMessage } = this.props
		if (prevProps.errorMessage != errorMessage) {
			ToastAndroid.show(errorMessage, ToastAndroid.SHORT)
		}
	}
	render() {
		const { item, onToggleActivate, onUpdateValue } = this.props
		// alert(`item triggers: ${JSON.stringify(item.triggers)}`)
		return (
			<Background style={style.container}>
				{item.triggers.map(({ triggerType, ...triggerAttributes }) => (
					<TriggerOptionCard
						key={triggerType}
						onToggleActivate={() => onToggleActivate(triggerType)}
						onUpdateValue={v => onUpdateValue(triggerType, v)}
						triggerType={triggerType}
						{...triggerAttributes}
					/>
				))}
			</Background>
		)
	}
}
