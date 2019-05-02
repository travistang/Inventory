import React from "react"
import { CommonHeaderStyle } from "utils"
import { colors } from "theme"
import { CenterNotice, Button, Background, ContentCard } from "components"
import { Text, View } from "react-native"
import PropTypes from "prop-types"
const { primary, secondary } = colors

export default class TriggerPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: CommonHeaderStyle,
      headerTitle: <HeaderComponent title="Triggers" icon="target" />
    }
  }

  render() {
    const { triggers = [] } = this.props
    return (
      <Background>
        {triggers.length ? (
          <ContentCard>
            {triggers.map(trig => (
              <Text>{trig.name}</Text>
            ))}
          </ContentCard>
        ) : (
          <CenterNotice icon="target" title="No triggers configured" />
        )}
      </Background>
    )
  }
}
