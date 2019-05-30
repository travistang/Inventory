import React from "react"
import { StyleSheet, View, Text, Switch } from "react-native"
import { ContentCard } from "components"
import { iconOf, colors } from "theme"
import { Trigger } from "models/trigger"

const style = StyleSheet.create({
	container: {
		paddingVertical: 16
	},
	row: {
		flexDirection: "row"
	},
	enabledText: {
		flex: 1
	}
})
export default function({
	triggerType,
	activated,
	isTriggerEnabled,
	onTriggerEnabledChange,
	triggerValue,
	onToggleActivate
}) {
	return (
		<ContentCard
			title={Trigger.triggerTypeDescription(triggerType)}
			icon={iconOf.trigger}>
			<View style={style.container}>
				<View style={style.row}>
					<Text style={style.enabledText}>Activated</Text>
					<Switch value={activated} onValueChange={onToggleActivate} />
				</View>
			</View>
		</ContentCard>
	)
}
