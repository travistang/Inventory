import React from "react"
import { ListItem } from "react-native-elements"
import { View, Text, StyleSheet } from "react-native"

import { FormatItemAmount } from "utils"
import { colors } from "theme"
const { secondary } = colors

const style = StyleSheet.create({
	previewItemChangeText: {
		color: secondary,
		fontWeight: "bold"
	},
	previewItemChangeTextContainer: {
		display: "flex",
		flexDirection: "row"
	}
})

export default function({ item, itemChanges, onSelectItem }) {
	const { name, amount } = item
	const hasBeenSelected = itemChanges.filter(i => i.name == name).length > 0
	const onPress = () => {
		if (hasBeenSelected) return // don't unselect from here
		onSelectItem(item)
	}

	return (
		<ListItem
			title={name}
			rightElement={
				<View style={style.previewItemChangeTextContainer}>
					<Text style={style.previewItemChangeText}>
						{FormatItemAmount(amount, item)}
					</Text>
				</View>
			}
			badge={(hasBeenSelected && { value: "selected" }) || null}
			onPress={onPress}
		/>
	)
}
