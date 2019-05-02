import React from 'react'
import PropTypes from 'prop-types'
import { Overlay } from 'react-native-elements'
import {
  View, ScrollView, Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

import {
  Card, Button, Icon,
  ContentCard
} from 'components'
import { colors } from 'theme'
const { secondary, textPrimary, white } = colors
import { Fumi } from 'react-native-textinput-effects'

const style = StyleSheet.create({
  snapshotTextContainer: {
    backgroundColor: white,
    borderRadius: 16,
  },
  snapshotText: {
    fontWeight: 'bold',
    color: textPrimary,
    padding: 8,
  }
})

export default class ImportRecordOverlay extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    availableSnapshots: PropTypes.array.isRequired,
    fetchAvailableListOfRecords: PropTypes.func.isRequired,
    onSnapshotSelected: PropTypes.func.isRequired,
    onServerURLChange: PropTypes.func,
    serverURL: PropTypes.string.isRequired,
  }

  static defaultProps = {
    onServerURLChange: () => {}
  }
  constructor(props) {
    super(props)


  }
  onServerURLChange(url) {
    this.props.onServerURLChange(url)
  }
  render() {
    const {
      isOpen, onClose,
      fetchAvailableListOfRecords,
      onSnapshotSelected,
      availableSnapshots,
      serverURL
    } = this.props

    return (
      <Overlay
        isVisible={isOpen}
        heigh={200}
        overlayStyle={style.overlay}
        onBackdropPress={onClose}>
        <Card style={style.container}>
          <ScrollView>
            <Text style={style.headerText}>
              {'import record'.toUpperCase()}
            </Text>
            <Fumi
              iconClass={Icon}
              iconColor={secondary}
              value={serverURL}
              iconName="database" label="server URL"
              onChangeText={this.onServerURLChange.bind(this)}
            />
            <Button
              title={"download snapshot".toUpperCase()}
              onPress={() => fetchAvailableListOfRecords(serverURL)}
              type="block" color={secondary}
              icon="cloud-download"
            />
            {
              availableSnapshots.length?(
                <ContentCard title="available snapshots"
                    icon="cloud-download">
                    {
                      availableSnapshots.map(snapshot => (
                        <TouchableOpacity
                          style={style.snapshotTextContainer}
                          key={snapshot}
                          onPress={() => onSnapshotSelected(snapshot)}
                          >
                          <Text style={style.snapshotText}>
                            {snapshot}
                          </Text>
                        </TouchableOpacity>
                      ))
                    }
                </ContentCard>
              ): null
            }
          </ScrollView>
        </Card>
      </Overlay>
    )
  }
}
