import React from 'react'
import TextInput from './TextInput'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View, Text,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { shadow, colors } from '../theme'
const { white } = colors

export default class AutocompleteTextInput extends React.Component {
  static defaultProps = {
    transformInput: v => v // no transform by default
  }
  static propTypes = {
    ...TextInput.propTypes,
    transformInput: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string.isRequired,
    })).isRequired,

    // given a value, return an element that shows the search result
    renderItem: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props)

    this.state = {
      searchResult: [],
      isSearchResultOpen: false
    }
  }
  // given a list of options and input, return the list of options available
  filterResultsByInput({options, input}) {
    return options.filter(opt =>
      (opt.value.search(new RegExp(input, 'i')) > -1))
      .concat() // ensure a deep copy is used instead.
      .sort() // sort the search result in place, on this deep copy
  }
  // override the default behavior when text changes
  // when input changes, the input value will be the field value,
  // except a list of suggestions also appears based on the options given and the input itself.
  // if the suggestions are pressed, the field value will be set accordingly
  onChangeText(input) {
    const { setFieldValue,
            name, options,
            transformInput } = this.props

    this.setState({
      searchResult: this.filterResultsByInput({options, input}),
      isSearchResultOpen: input.length
    }, () => setFieldValue(name, transformInput(input)))

  }
  // called when an option is selected
  onSelect({value}) {
    const { transformInput, setFieldValue, name } = this.props
    // close the search result view after something is selected
    this.setState({
      isSearchResultOpen: false
    }, () => setFieldValue(
        name,
        transformInput(value)
      ))
  }

  // if no renderItem function is given, use this default function instead
  // which just returns a text of the value
  defaultRenderItem({value}) {
    return (
      <Text style={style.defaultTextItem}>{value}</Text>
    )
  }
  render() {
    const {
      options,
      transformInput = v => v,
      renderItem = this.defaultRenderItem,
      setFieldValue,
      name,
      ...props
    } = this.props
    const { searchResult, isSearchResultOpen } = this.state
    return (
      <View style={style.container}>
        <TextInput
          {...props}
          name={name}
          setFieldValue={setFieldValue}
          onChangeText={this.onChangeText.bind(this)}
        />

      <ScrollView style={style.suggestionsContainer}>
          {
            isSearchResultOpen?
              searchResult.map(option => (
                <TouchableOpacity
                  onPress={this.onSelect.bind(this, option)}
                >
                  {renderItem(option)}
                </TouchableOpacity>
              ))
            : null
          }
        </ScrollView>
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {

  },
  defaultTextItem: {
    padding: 8,
    fontSize: 18,
  },
  suggestionsContainer: {
    zIndex: 9999,
    borderRadius: 16,
    paddingHorizontal: 8,
    position: 'relative',
    width: '100%',
    maxHeight: 256,
    backgroundColor: white,
    ...shadow
  }
})
