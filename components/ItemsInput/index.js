import React from "react"

// global components
import {
	ScrollView,
	View,
	TouchableOpacity,
	StyleSheet,
	Text,
	Platform
} from "react-native"
import { ListItem, SearchBar, Overlay } from "react-native-elements"
import {
	ActionChip,
	Button,
	HeaderComponent,
	TextInput,
	CenterNotice,
	ItemCard,
	Card,
	Background
} from "components"
import { Fumi } from "react-native-textinput-effects"
import Icon from "react-native-vector-icons/dist/FontAwesome"

// local sub-components
import TagLeftBadge from "./TagLeftBadge"
import PreviewItemListItem from "./PreviewItemListItem"

// utils and backends
import * as _ from "lodash"
import { FormatItemAmount, FormatCurrency } from "utils"
import { quantityOptions } from "models"
import ItemModel from "models/items"
import PropTypes from "prop-types"
import { colors } from "theme"
const { textSecondary, secondary, primary, background, white } = colors
/*
  Component that exists within a form for selecting items for buy or consume
  When the field is not "selected", it lists the items the user has chosen.
    Each listed items provides:
      - name of the selected items,
      - amount of the selected items (about to be bought / consumed)
      - total about of the selected items before change.
      - a button for removing this item from the buy / consumption list.
  When no items are selected, a <CenterNotice> is displayed
    and user sees fullscreen popup for choosing items to buy / consume.
  When items are already selected, a button will be appended to the end of the list
    and user and click it to see the aforementioned fullscreen popup.
  When user enters such popup, he sees a searchbar and the results list.
    - search bar perform case-insensitive substring search on registered items.
    - search result contains the name and the amount of the items (before buy / consumption)
    - when there are no matching items, a <CenterNotice> is displayed to tell this.
  When user clicks on a search result,
    - another popup comes to ask about the amount of this item to be bought / consumed.
    - The following things will be shown:
      - A text-input for number only.
      - A text label for showing total number of item available
      - A button for confirming the amount input and,
      - A few buttons for selecting how to interpret the input value.
  There are few ways to interpret the input amount of a particular item,
    For buying:
      - literally. (e.g. 40 means 40 in the unit of that item.)
      - percent increased (e.g. 40 means you bought 40% of the original amount.)
      - times (e.g. 2 means you bought 2 times of the original amount)
    For consuming:
      - literally. (e.g. 40 means you consumed 40 units of that item.)
      - percent left (e.g. 10 means you consumed till 10% left of the original amount -> 100g of thing has 10g left if 10% of original is left)
      - percent of (e.g. 10 means you consumed 10% of the original amount -> 100g of thing has 90g left after 10% consumption)

  On finishing selection: it gives a list of items that has changes in amount
    - The ABSOLUTE DIFFERENCE of the amount of each item will be returned, W.R.T. the unit of that item.
*/
export default class ItemsInput extends React.Component {
	static propTypes = {
		isBuying: PropTypes.bool.isRequired,
		onFinishSelection: PropTypes.func.isRequired,

		account: PropTypes.shape({
			name: PropTypes.string.isRequired,
			currency: PropTypes.string.isRequired
		}) // for determining the currency
	}

	constructor(props) {
		super(props)
		this.state = {
			/*
      the list of items you can choose from
      */
			items: [],
			/*
      the list of items that are bought / consumed
      Item changes are of type:
        - {
          name: String,
          amount: Number > 0,
          cost: Number > 0, only if "isBuying" is true
        }
      */
			itemChanges: [],

			// show the overlay
			isSelectingItem: false,

			// this is the value for the item name search
			searchText: "",
			searchTermDirty: false,

			// these are for the overlay that helps choosing the quantity
			quantity: 0,
			cost: 0,
			choosingQuantityForItem: null,
			// use the index to locate the intepretation instead of the name
			selectedQuantityIntepretationIndex: 0
		}

		this.isIOS = Platform.OS === "ios"
		this.color = props.isBuying ? secondary : primary
	}
	clearItems() {
		this.setState({ itemChanges: [] })
	}
	refreshItemList() {
		ItemModel.getItems().then(items => {
			this.setState({ items })
		})
	}
	// display an overlay
	displayItemSelectView() {
		this.setState({ isSelectingItem: true })
		this.refreshItemList()
	}

	hideItemSelectView() {
		// clear everything after the selection
		this.setState({
			isSelectingItem: false,
			searchTermDirty: false,
			searchText: ""
		})
	}
	getOriginalItem(name) {
		return this.state.items.filter(i => i.name == name)[0]
	}

	onPreivewItemListItemSelected({ originalItem, amountDiff, cost }) {
		this.setState({
			choosingQuantityForItem: originalItem,
			quantity: amountDiff,
			cost
		})
	}
	removePreviewItem({ name }) {
		return this.setState(
			{
				itemChanges: this.state.itemChanges.filter(i => i.name !== name)
			},
			() => this.reportProposedItemChange()
		)
	}
	itemFilteredByName() {
		const { items, searchText } = this.state

		const result = items.filter(
			item => item.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1
		)
		return result
	}
	searchResultListItem(item) {
		const { name, amount } = item
		const { itemChanges } = this.state
		const hasBeenSelected = itemChanges.filter(i => i.name == name).length > 0
		const onSelectItem = (() => {
			this.setState({
				choosingQuantityForItem: item
			})
		}).bind(this)
		return (
			<ListItem
				key={name}
				title={name}
				style={style.searchResultItem}
				rightElement={
					<View style={style.previewItemChangeTextContainer}>
						<Text style={style.previewItemChangeText}>
							{FormatItemAmount(amount, item)}
						</Text>
					</View>
				}
				badge={(hasBeenSelected && { value: "selected" }) || null}
				onPress={(!hasBeenSelected && onSelectItem) || null}
			/>
		)
	}
	getQuantityOptions() {
		const { isBuying } = this.props
		return quantityOptions[isBuying ? "buy" : "consume"]
	}

	// invoke the callback to get the current snapshot of item changes
	reportProposedItemChange() {
		this.props.onFinishSelection(this.state.itemChanges)
	}
	resetQuantityForm() {
		this.setState({
			quantity: 0,
			cost: 0,
			choosingQuantityForItem: null,
			selectedQuantityIntepretationIndex: 0
		})
		this.reportProposedItemChange()
	}
	getQuantitySelectionOverlay() {
		const {
			quantity: selectedQuantity, // what's inside the `quantity` field
			choosingQuantityForItem: item, // the item selected in the previous popup
			selectedQuantityIntepretationIndex: selectedIndex, // the index of the mode selected
			cost
		} = this.state
		const { isBuying, account: { currency } = { currency: "" } } = this.props

		const { name, amount, unit } = item
		// return null
		const amountLabel = "Amount " + (isBuying ? "buying" : "consuming")

		const selectedOption = this.getQuantityOptions()[selectedIndex]
		// bind the conersion function with the original amount of the item
		const conversionFunction = selectedOption.conversionFunction.bind(
			this,
			amount
		)
		// difference betwee the proposed new amount of item and the original amount of item
		const amountDifference = conversionFunction(selectedQuantity) || 0
		const valuePrefix = isBuying ? "+" : ""
		const valueDifferenceText =
			valuePrefix + FormatItemAmount(amountDifference, item)
		// real amount is the ABSOLUTE DIFFERENCES in this action (buy or consume)
		const absDifference = Math.abs(amountDifference)
		const amountAfter = amount + amountDifference
		const submitAmount = () => {
			let payload = { name, amount: absDifference }
			if (isBuying) payload.cost = cost
			this.setState(
				{
					itemChanges: this.state.itemChanges
						.filter(changes => changes.name != payload.name) // to remove duplicates from previous adds
						.concat(payload)
				},
				() => this.resetQuantityForm()
			)
		}
		const onBackdropPress = this.resetQuantityForm.bind(this)
		return (
			<Overlay
				isVisible
				fullScreen
				overlayStyle={{ margin: 0 }}
				containerStyle={{ padding: 0, backgroundColor: background }}
				onBackdropPress={onBackdropPress}>
				<Background style={style.itemSelectionOverlayContainer}>
					<Text style={style.h4}>{"Amount".toUpperCase()}</Text>
					{// since there's no return button on iPhone,
					// there has to be a button to remove this overlay
					this.isIOS && <Button onPress={onBackdropPress}>Back</Button>}
					<View style={style.itemCardRow}>
						<ItemCard
							style={{ flex: 1 }}
							leftTagElement={<TagLeftBadge difference={valueDifferenceText} />}
							item={{ ...item, amount: amountAfter }}
						/>
					</View>
					{/*
              This is the card that holds the form
              It is supposed to render different forms, depending on the mode.
              If it is "buying", it should show the "quantity", the options to intepret, and the cost
              If it is "consuming", then it should just show the "quantity", options to intepret

              The final amount of the item after this change is shown above
          */}
					<Card style={style.quantityInputFormContainer}>
						<Fumi
							label="Quantity"
							iconName="tachometer"
							iconClass={Icon}
							iconColor={primary}
							style={{ ...style.quantityTextInput, flex: 1 }}
							keyboardType="decimal-pad"
							onChangeText={v =>
								this.setState({
									quantity: parseFloat(v) || 0
								})
							}
							value={(selectedQuantity || 0).toString()}
						/>
						{isBuying && (
							<Fumi
								label="Cost"
								iconName="money"
								iconClass={Icon}
								iconColor={primary}
								keyboardType="decimal-pad"
								value={(cost || 0).toString()}
								onChangeText={v =>
									this.setState({
										cost: parseFloat(v) || 0
									})
								}
							/>
						)}
						<View style={style.quantitySummaryRow}>
							<Text style={{ flex: 1 }}>{amountLabel}</Text>
							<Text style={{ ...style.h3, flex: 1, color: primary }}>
								{FormatItemAmount(Math.abs(amountDifference), item)}
							</Text>
						</View>

						{isBuying && (
							<View style={style.averageCostRow}>
								<Text style={{ flex: 1 }}>Average Cost:</Text>
								<Text style={{ flex: 1, fontWeight: "bold" }}>
									{FormatCurrency(cost / amountDifference || 0, currency)} /{" "}
									{unit}
								</Text>
							</View>
						)}
						<Text>Interpret as:</Text>

						<View style={style.quantityOptionContainer}>
							{this.getQuantityOptions().map(
								({ name, conversionFunction }, index) => (
									<ActionChip
										key={name}
										config={{ name, conversionFunction }}
										style={style.actionChip}
										selected={selectedIndex == index}
										onSelect={() =>
											this.setState({
												selectedQuantityIntepretationIndex: index
											})
										}
									/>
								)
							)}
						</View>
					</Card>

					<Button
						type="block"
						color={primary}
						icon="check"
						title="Confirm"
						disabled={
							!this.validateQuantityInfo({
								isBuying,
								realAmount: amountAfter,
								amountDifference
							})
						}
						onPress={submitAmount.bind(this)}
					/>
				</Background>
			</Overlay>
		)
	}
	validateQuantityInfo({ isBuying, realAmount, amountDifference }) {
		if (amountDifference == 0) return false
		if (realAmount < 0) return false

		return true
	}
	getItemSelectionOverlay() {
		const { isSelectingItem, searchText, searchTermDirty } = this.state
		const searchResult = this.itemFilteredByName()
		const onBackdropPress = this.hideItemSelectView.bind(this)
		return (
			<Overlay
				fullScreen
				onBackdropPress={onBackdropPress}
				style={{ backgroundColor: background }}
				isVisible={isSelectingItem}>
				<View style={style.itemSelectionOverlayContainer}>
					<View style={style.headerRow}>
						<Text style={style.h4}>{"Choose an item".toUpperCase()}</Text>
						{this.isIOS && <Button onPress={onBackdropPress}>Back</Button>}
					</View>

					<SearchBar
						lightTheme
						autoFocus
						containerStyle={{
							marginTop: 16,
							borderColor: "transparent",
							shadowColor: "transparent",
							elevation: 0,
							backgroundColor: background
						}}
						style={style.searchBar}
						placeholder="Search item..."
						onChangeText={searchText => {
							const searchTermDirty = searchText != ""
							this.setState({ searchText, searchTermDirty })
						}}
						value={searchText}
					/>
					{searchTermDirty ? (
						searchResult.length ? (
							<ScrollView style={style.searchResult}>
								{searchResult.map(this.searchResultListItem.bind(this))}
							</ScrollView>
						) : (
							<CenterNotice title="No result" />
						)
					) : (
						<CenterNotice icon="search" title="Type to Start searching" />
					)}
				</View>
			</Overlay>
		)
	}
	// return a list of items that are selected selection

	render() {
		const { items, itemChanges, choosingQuantityForItem } = this.state
		const {
			isBuying,
			onFinishSelection,
			account = { currency: "" }
		} = this.props
		const { currency } = account
		return (
			<ScrollView>
				{this.getItemSelectionOverlay()}
				{choosingQuantityForItem && this.getQuantitySelectionOverlay()}
				{// list of items that is subject to change
				itemChanges.length ? (
					<View>
						<View style={style.headerRow}>
							<HeaderComponent title="Items" icon="gift" textStyle={style.h4} />
							{isBuying && (
								<View style={style.summaryContainer}>
									<Text>{itemChanges.length} item(s). Total:</Text>
								</View>
							)}
						</View>

						{// list of items
						itemChanges.map(changedItem => (
							<PreviewItemListItem
								changedItem={changedItem}
								originalItem={this.getOriginalItem(changedItem.name)}
								isBuying={this.props.isBuying}
								account={this.props.account}
								removePreviewItem={this.removePreviewItem.bind(this)}
								onSelectItem={this.onPreivewItemListItemSelected.bind(this)}
							/>
						))}
						<Button
							type="outline"
							color={primary}
							buttonStyle={style.addItemButton}
							icon="add"
							titleStyle={style.addItemButtonTitle}
							title="Add item"
							onPress={this.displayItemSelectView.bind(this)}
						/>
					</View>
				) : (
					<TouchableOpacity onPress={this.displayItemSelectView.bind(this)}>
						<CenterNotice
							icon="gift"
							title="No items selected"
							subtitle="Click here to add items"
						/>
					</TouchableOpacity>
				)}
			</ScrollView>
		)
	}
}

const style = StyleSheet.create({
	h3: {
		fontSize: 32
	},
	h4: {
		fontSize: 22
	},
	previewItemChangeText: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",
		marginVertical: 8
	},
	searchResultListItem: {
		fontWeight: "bold",
		color: "green"
	},
	container: {},
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	searchResult: {
		flex: 1
	},
	searchBar: {
		flex: 1
		// height: 48
	},
	itemSelectionOverlayContainer: {
		padding: 16,
		display: "flex",
		flex: 1
	},
	previewItemChangeText: {
		color: secondary,
		fontWeight: "bold"
	},
	previewItemChangeTextContainer: {
		display: "flex",
		flexDirection: "row"
	},

	actionChip: {
		width: 128
		// maxWidth: '50%',
	},
	averageCostRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		// alignItems: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 8
	},
	quantityOptionContainer: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "flex-start",
		alignItems: "center",
		flex: 1
	},
	quantityInputFormContainer: {
		padding: 8,
		marginVertical: 8
	},
	summaryContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between"
	},
	itemCardRow: {
		marginTop: 8,
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		paddingHorizontal: 16
	},
	quantitySummaryRow: {
		// flexDirection: 'column'
		paddingHorizontal: 16,
		paddingVertical: 8
	},
	addItemButton: {
		backgroundColor: white,
		borderRadius: 16
	},
	addItemButtonTitle: {}
})
