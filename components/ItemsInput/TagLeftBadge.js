import React from "react"
import { View, StyleSheet, Text } from "react-native"
import { colors } from "theme"
const { secondary } = "colors"

const style = StyleSheet.create({
	previewItemLeftContainer: {
		justifyContent: "center",
		alignItems: "center",
		flex: 2
	},
	previewItemLeftContainerText: {
		color: secondary,
		fontWeight: "bold"
	}
})

// the component to be rendered on the left of the item card at the top.
// this is meant to show the differences of the quantity given certain input.
export default function({ difference }) {
	return (
		<View style={style.previewItemLeftContainer}>
			<Text style={style.previewItemLeftContainerText}>{difference}</Text>
		</View>
	)
}
