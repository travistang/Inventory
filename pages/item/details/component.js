// the actual UI of the detail page of an item.
import React from "react"
import Sparkline from "react-native-sparkline"
import {
	ItemCard,
	Background,
	HeaderComponent,
	ContentCard,
	Meter,
	Button
} from "components"

import { View, StyleSheet } from "react-native"
import { CommonHeaderConfig, FormatItemAmount } from "utils"
import FrequencyCard from "./frequencyCard"
import { colors, iconOf } from "theme"
const { primary, secondary, white, textPrimary } = colors

export const navigationOptions = ({ navigation }) => {
	// extract item from navigation state
	const {
		params: { item }
	} = navigation.state

	const { name } = item

	return {
		...CommonHeaderConfig(name, iconOf.item),
		headerRight: (
			<Button
				color={textPrimary}
				type="clear"
				onPress={() => navigation.push("CreateTriggerPage", { item })}
				icon={iconOf.trigger}
			/>
		)
	}
}

export default function({
	trendLineData,
	consumptionFrequency,
	buyFrequency,
	trendLineMin,
	heatmapData,
	averageCost,
	averageBuyAmount,
	averageConsumeAmount,
	refillInterval,
	item
}) {
	const style = StyleSheet.create({
		container: {
			padding: 16
		},
		cardRow: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center"
		},
		summaryRowWrapper: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			paddingVertical: 8
		},
		trendLineWrapper: {
			flex: 1,
			alignItems: "center",
			justifyContent: "center",
			paddingHorizontal: 16,
			paddingVertical: 8
		}
	})
	return (
		<Background style={style.container}>
			<View style={style.cardRow}>
				<ItemCard item={item} />
			</View>
			<View style={style.summaryRowWrapper}>
				<Meter
					icon="money"
					color={primary}
					title="average cost"
					value={averageCost}
				/>
				<Meter
					icon="refresh"
					color={secondary}
					title="Buy period"
					value={`${refillInterval} days`}
				/>
			</View>
			<View style={style.summaryRowWrapper}>
				<Meter
					icon="fire"
					color={primary}
					title="avg. consumption"
					value={FormatItemAmount(averageConsumeAmount, item)}
				/>
				<Meter
					icon="tachometer"
					color={secondary}
					title="avg. buy amount"
					value={FormatItemAmount(averageBuyAmount, item)}
				/>
			</View>

			<ContentCard title="amount trend" icon="tachometer">
				<View style={style.trendLineWrapper}>
					<Sparkline min={trendLineMin} color={primary} data={trendLineData}>
						<Sparkline.Line />
						<Sparkline.Fill />
					</Sparkline>
				</View>
			</ContentCard>
			<FrequencyCard
				title="consumption frequency"
				icon="fire"
				color={primary}
				values={consumptionFrequency}
			/>
			<FrequencyCard
				title="buy frequency"
				icon="refresh"
				color={secondary}
				values={buyFrequency}
			/>
		</Background>
	)
}
