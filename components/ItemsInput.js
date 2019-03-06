import React from 'react'

import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from 'react-native'
import {
  ListItem,
  Text,
  Button,
  SearchBar,
  Overlay
} from 'react-native-elements'

import {
  FormatCurrency,
  FormatItemAmount
} from '../utils'

import * as _ from 'lodash'

import CenterNotice from '../components/CenterNotice'
import ActionChip from './ActionChip'

import ItemModel from '../models/items'

import Icon from 'react-native-vector-icons/dist/FontAwesome'
import PropTypes from 'prop-types'
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
      currency: PropTypes.string.isRequired,
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
      quantityInterpretationMode: 'literally'
    }
  }
  clearItems() {
    this.setState({itemChanges: []})
  }
  refreshItemList() {
    ItemModel.getItems().then(items => {
      this.setState({items})
    })
  }
  // display an overlay
  displayItemSelectView() {
    this.setState({isSelectingItem: true})
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
  removePreviewItem({ name }) {
    return this.setState({
      itemChanges: this.state.itemChanges.filter( i => i.name !== name)
    })
  }
  // a function that renders a preview of change of items.
  previewItemListItem(changedItem) {
    const { isBuying,
      account = {currency: ""}
    } = this.props
    const { currency } = account
    const { name, amount: amountDiff, cost } = changedItem
    const originalItem = this.getOriginalItem(name)
    const { amount: originalAmount, unit } = originalItem
    const newAmount = originalAmount + (isBuying?(amountDiff):(-amountDiff))
    const amountChangedText = (
      <View style={style.amountChangedTextContainer}>
        <Text style={style.previewItemPrice}>
          {FormatItemAmount(originalAmount, originalItem)}
        </Text>
        <Text>
          <Icon name="arrow-right" />
        </Text>
        <Text style={style.previewItemPrice}>
          {FormatItemAmount(newAmount, originalItem)}
        </Text>
      </View>
    )
    const onSelectItem = () => {
      this.setState({
        choosingQuantityForItem: this.getOriginalItem(name),
        quantity: amountDiff,
      })
    }
    const getBadge = () => {
      if(isBuying) {
        return {
          value: FormatCurrency(cost, currency),
          size: 'large'
        }
      } else {
        return {
          value: FormatItemAmount(amountDiff, originalItem),
          size: 'large'
        }
      }
    }
    return (
      <ListItem
        onPress={onSelectItem}
        title={name}
        subtitle={amountChangedText}
        badge={getBadge()}
        rightElement={
          <Button
            type="clear"
            style={{color: 'red'}}
            icon={{name: 'delete', color: 'red'}}
            onPress={() => this.removePreviewItem({ name })}
          />
        }
      />
    )
  }
  itemFilteredByName() {
    const { items, searchText } = this.state

    const result = items.filter(item =>
      item.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1
    )
    return result
  }
  searchResultListItem(item) {
    const { name, amount, unit } = item
    const { itemChanges } = this.state
    const hasBeenSelected = itemChanges.filter(i => i.name == name).length > 0
    const onSelectItem = (() => {
      this.setState({
        choosingQuantityForItem: item,
        quantity: 0,
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
        badge={hasBeenSelected && (
          {value: 'selected'}
        ) || null}
        onPress={(!hasBeenSelected && onSelectItem) || null}
      />
    )
  }
  getQuantityOptions() {
    const { isBuying } = this.props
    let names = "literally,% increased,times".split(',')
    let icons = "space-bar,percentage,times".split(',')
    let colors="brown,blue,green".split(',')
    if (!isBuying) {
      names="literally,remaining,% left,% of".split(',')
      icons="space-bar,remove,integral,less-than-equal".split(',')
    }

    const options = _.zipWith(
      names, icons, colors,
      (name, icon ,color) => ({
        name, icon, color
      })
    )
    return options
  }
  /*
    Quantity is the ABSOLUTE DIFFERENCE of this transaction
    totalAmount: the current amount of this item
    quantity: input value
  */
  convertQuantityToRealAmount() {
    const { isBuying } = this.props
    const {
      quantityInterpretationMode,
      quantity,
      choosingQuantityForItem: { amount: totalAmount }
    } = this.state
    if(quantity == 0 || _.isNaN(quantity)) return 0
    switch(quantityInterpretationMode) {
      case "literally":
        return quantity
      case "remaining":
        return totalAmount - quantity
      case '% left':
        return totalAmount * (1 - quantity / 100)
      case 'times':
        return totalAmount * (1 + quantity)
      case '% increased':
      case '% of':
        return totalAmount * (quantity / 100)
      default:
        return 0
    }
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
      quantityInterpretationMode: 'literally'
    })
    this.reportProposedItemChange()
  }
  getQuantitySelectionOverlay() {
    const {
      quantity: selectedQuantity,
      choosingQuantityForItem: item,
      quantityInterpretationMode,
      cost
    } = this.state
    const { isBuying,
      account: { currency } = { currency: ""}
    } = this.props
    const {name, amount, unit} = item
    const amountLabel = "Amount " + isBuying?
      "buying":"consuming"

    // real amount is the ABSOLUTE DIFFERENCES in this action (buy or consume)
    const realAmount = this.convertQuantityToRealAmount()
    const submitAmount = () => {
      let payload = {name, amount: realAmount}
      if(isBuying) payload.cost = cost
      this.setState({
        itemChanges: this.state.itemChanges
          .filter(changes => changes.name != payload.name) // to remove duplicates from previous adds
          .concat(payload)
      }, () => this.resetQuantityForm())
    }
    return (
      <Overlay
        isVisible
        onBackdropPress={this.resetQuantityForm.bind(this)}
      >
        <View style={style.itemSelectionOverlayContainer}>
          <Text h3>Amount</Text>
          <View style={style.quantityTextInputContainer}>
            <TextInput
              style={{...style.quantityTextInput, flex: 1}}
              keyboardType="decimal-pad"
              onChangeText={v => this.setState({
                quantity: parseFloat(v)
              })}
              value={selectedQuantity}
            />
            <Text h4 style={{flex: 1}}> / </Text>
            <Text h4 style={{flex: 1}}>
              {FormatItemAmount(amount, item)}
            </Text>
          </View>
          <Text>
            {amountLabel}: {FormatItemAmount(realAmount, item)}
          </Text>
          {
            isBuying && (
              <TextInput
                placeholder="Cost"
                keyboardType="decimal-pad"
                value={cost}
                onChangeText={v => this.setState({
                  cost: parseFloat(v)
                })}
              />
            )
          }
          {
            isBuying && (
              <View style={style.previewItemChangeTextContainer}>
                <Text>
                  Average Cost:
                </Text>
                <Text style={{fontWeight: 'bold'}}>
                  {FormatCurrency((cost / realAmount ) || 0, currency)} / {unit}
                </Text>
              </View>

            )
          }
          <Text h4>Interpret as:</Text>
          <View style={style.quantityOptionContainer}>
            {
              this.getQuantityOptions().map((config) => (
                <ActionChip
                  key={config.name}
                  {...config}
                  onPress={() => this.setState({
                    quantityInterpretationMode: config.name
                  })}
                  style={style.actionChip}
                  selected={quantityInterpretationMode == config.name}
                />
              ))
            }
          </View>
          <Button
            icon={{name: "check", color: 'white'}}
            title="Confirm"
            disabled={
              !realAmount ||
              (isBuying && !cost) ||
              (!isBuying && realAmount > amount)
            }
            onPress={submitAmount.bind(this)}
          />
        </View>
      </Overlay>
    )
  }
  getItemSelectionOverlay() {
    const {
      isSelectingItem,
      searchText,
      searchTermDirty } = this.state
    const searchResult = this.itemFilteredByName()
    return (
      <Overlay
        fullScreen
        onBackdropPress={this.hideItemSelectView.bind(this)}
        isVisible={isSelectingItem}>
        <View style={style.itemSelectionOverlayContainer}>
          <Text h3>
            Choose an item
          </Text>
          <SearchBar
            lightTheme
            autoFocus
            style={style.searchBar}
            placeholder="Search item..."
            onChangeText={searchText => {
              const searchTermDirty = searchText != ""
              this.setState({ searchText, searchTermDirty })
            }}
            value={searchText}
          />
          {
            searchTermDirty?(
              searchResult.length?
              (
                <ScrollView style={style.searchResult}>
                  {
                    searchResult
                    .map(this.searchResultListItem.bind(this))
                  }
                </ScrollView>
              ):(
                <CenterNotice title="No result" />
              )
            ): (
              <CenterNotice
                icon="search"
                title="Type to Start searching"
              />
            )
          }
        </View>
      </Overlay>
    )
  }
  // return a list of items that are selected selection
  /*

  */
  render() {
    const {
      items, itemChanges,
      choosingQuantityForItem } = this.state
    const {
      isBuying, onFinishSelection,
      account = { currency: "" }
    } = this.props
    const { currency } = account
    return (

      <ScrollView>
        {
          this.getItemSelectionOverlay()
        }
          {choosingQuantityForItem &&
            this.getQuantitySelectionOverlay()
        }
        {
          // list of items that is subject to change
          itemChanges.length ?
          (
            <View>
              {
                isBuying && (
                  <View style={style.summaryContainer}>
                    <Text>
                      { itemChanges.length } item(s). Total:
                    </Text>
                    <Text style={{fontWeight: 'bold'}}>
                      {FormatCurrency(
                        itemChanges.reduce((acc, item) => acc + item.cost, 0),
                        currency
                      )}
                    </Text>
                  </View>
                )
              }
              {
                // list of items
                itemChanges
                .map(this.previewItemListItem.bind(this)
                )
              }
              <Button
                icon={{name: 'add'}}
                title="Add item"
                onPress={this.displayItemSelectView.bind(this)}
              />
            </View>

          ):
          (
            <TouchableOpacity onPress={
                this.displayItemSelectView.bind(this)
            }>
            <CenterNotice
              icon="gift"
              title="No items selected"
              subtitle="Click here to add items"
            />
            </TouchableOpacity>

          )
        }
      </ScrollView>

    )
  }
}

const style = StyleSheet.create({
  previewItemChangeText: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8
  },
  searchResultListItem: {
    fontWeight: 'bold',
    color: 'green'
  },
  container: {

  },
  searchResult: {
    flex: 1
  },
  searchResultItem: {
    backgroundColor: "green"
  },
  searchBar: {
    flex: 1,
    // height: 48
  },
  itemSelectionOverlayContainer: {
    margin: 8,
    display: 'flex',
    flex: 1,
  },
  previewItemChangeText: {
    color: 'green',
    fontWeight: 'bold'
  },
  previewItemChangeTextContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  quantityTextInput: {
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 16,
  },
  actionChip: {
    // maxWidth: '50%',
  },
  quantityOptionContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1
  },
  amountChangedTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start'
  },
  quantityTextInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  summaryContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})
