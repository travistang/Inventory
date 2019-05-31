// the list item in the itemsInput view
// global components
import React from "react"
import { View, StyleSheet } from "react-native"
import { Button, ItemCard } from "components"

// local sub-components
import TagLeftBadge from "./TagLeftBadge"

// utils and themes
import { colors } from "theme"
const { primary } = colors
import { FormatCurrency, FormatItemAmount } from "utils"

const style = StyleSheet.create({
	previewItemContainer: {
		flexDirection: "row",
		marginHorizontal: 16,
		marginVertical: 8
	},
	previewItemCardWrapper: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1
	}
})

export default class PreviewItemListItem extends React.Component {
	render() {
		const {
			removePreviewItem,
			originalItem,
			changedItem,
			isBuying,
			onSelectItem,
			account = { currency: "" }
		} = this.props

		const { currency } = account
		const { name, amount: amountDiff, cost } = changedItem

		const { amount: originalAmount, unit } = originalItem
		const newAmount = originalAmount + (isBuying ? amountDiff : -amountDiff)

		const valueText = isBuying
			? `-${FormatCurrency(cost, currency)}`
			: `-${FormatItemAmount(amountDiff, originalItem)}`

		return (
			<View style={style.previewItemContainer}>
				<View style={style.previewItemCardWrapper}>
					<ItemCard
						style={{ width: "100%" }}
						item={{ ...originalItem, amount: newAmount }}
						onPress={() => onSelectItem({ originalItem, amountDiff, cost })}
						leftTagElement={<TagLeftBadge difference={valueText} />}
					/>
				</View>
				<Button
					color={primary}
					type="block"
					icon="trash"
					onPress={() => removePreviewItem({ name })}
				/>
			</View>
		)
	}
}
