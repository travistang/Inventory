import React from "react"
import { StyleSheet, View, Text, Switch, TextInput } from "react-native"
import { ContentCard, Button } from "components"
import { iconOf, colors } from "theme"
import { Trigger } from "models/trigger"
const { background, primary } = colors

const style = StyleSheet.create({
	container: {
		paddingVertical: 16
	},
	row: {
		flexDirection: "row",
		alignItems: "center"
	},
	inputContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start"
	},
	input: {
		backgroundColor: background,
		borderRadius: 6,
		flex: 1,
		margin: 8
	},
	updateButton: {
		height: 22
	},
	updateButtonText: {
		fontSize: 16
	},
	enabledText: {
		flex: 1
	}
})
export default class TriggerOptionCard extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			value: null
		}
	}

	render() {
		const {
			triggerType,
			activated,
			isTriggerEnabled,
			onTriggerEnabledChange,
			triggerValue,
			onToggleActivate,
			onUpdateValue
		} = this.props

		const value = this.state.value || triggerValue // if there is something in the state, use it; otherwise use the props
		return (
			<ContentCard
				title={Trigger.triggerTypeDescription(triggerType)}
				icon={iconOf.trigger}>
				<View style={style.container}>
					<View style={style.row}>
						<Text style={style.enabledText}>Activated</Text>
						<Switch
							trackColor={{ true: primary, false: background }}
							value={activated}
							onValueChange={onToggleActivate}
						/>
					</View>
					{activated ? (
						<View style={style.row}>
							<View style={{ ...style.row, ...style.inputContainer }}>
								<Text>Value</Text>
								<TextInput
									keyboardType="decimal-pad"
									style={style.input}
									value={value}
									onChangeText={value => this.setState({ value })}
								/>
							</View>
							<Button
								onPress={() => onUpdateValue(value)}
								type="outline"
								title="update"
								titleStyle={style.updateButtonText}
								buttonStyle={style.updateButton}
							/>
						</View>
					) : null}
				</View>
			</ContentCard>
		)
	}
}
