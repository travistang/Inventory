import React from 'react'
import { ContributionGraph } from 'react-native-chart-kit'
import {
  ContentCard
} from 'components'
import PropTypes from 'prop-types'
import { colors } from 'theme'
import { addOpacity } from 'utils'
const { white } = colors

export default class FrequencyCard extends React.Component {
  static propTypes = PropTypes.shape({
    values: PropTypes.array.isRequired,
    color: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
  })

  constructor(props) {
    super(props)
    this.state = {
      graphWidth: 0,
    }
  }

  reportInnerWidth({ nativeEvent: { layout: { width }}}) {
    this.setState({
      graphWidth: width // compensate padding
    })
  }
  render() {
    const {values, color, title, icon} = this.props
    const { graphWidth } = this.state
    return (
      <ContentCard
        onLayout={this.reportInnerWidth.bind(this)}
        title={title} icon={icon}>
        <ContributionGraph
          values={values}
          endDate={new Date()}
          numDays={90}
          width={graphWidth}
          style={{transform: [{translateX: -16}]}}
          height={196}
          chartConfig={{
            backgroundColor: white,
            backgroundGradientFrom: white,
            backgroundGradientTo: white,
            color: (opacity = 1) => addOpacity(color, opacity)
          }}
        />
      </ContentCard>
    )
  }

}
