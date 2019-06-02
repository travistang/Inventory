import React from "react"
// global components
import { Overlay, SearchBar } from "react-native-elements"
import { View, Text, StyleSheet, Platform, ScrollView } from "react-native"
import { CenterNotice } from "components"
// local components
import SearchResultListItem from "./SearchResultsListItem"
// utils and themes
import { colors } from "theme"
const { background } = colors
const style = StyleSheet.create({
	itemSelectionOverlayContainer: {
		padding: 16,
		display: "flex",
		flex: 1
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	h4: {
		fontSize: 22
	}
})

export default class ItemSelectionOverlay extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			searchText: "",
			searchTermDirty: false
		}
		this.isIOS = Platform.OS === "ios"
	}

	render() {
		const {
			isSelectingItem,
			searchResult,
			onBackdropPress,
			itemChanges,
			onSelectItem,
			onSearchTermChanged
		} = this.props
		const { searchText, searchTermDirty } = this.state

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
							// trigger the search
							onSearchTermChanged(searchText)
						}}
						value={searchText}
					/>
					{searchTermDirty ? (
						searchResult.length ? (
							<ScrollView style={style.searchResult}>
								{searchResult.map(item => (
									<SearchResultListItem
										item={item}
										itemChanges={itemChanges}
										onSelectItem={onSelectItem}
									/>
								))}
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
}
