import React from 'react'
import PropTypes from 'prop-types'
import LocationModel from 'models/location'
import Component from './component'

export default class LocationPreviewCardContainer extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired
  }
  constructor(props) {
    super(props)

    this.state = {
      location: null
    }
  }
  async componentDidMount() {
    const { location: id } = this.props
    if(!id) return

    const location = await LocationModel.getLocationById(id)
    try {
      const result = LocationModel.validationSchema.validate(result)
      this.setState({ location: location })
    } catch(err) {
      // do nothing
    }
  }
  render() {
    return (
      <Component location={this.state.location || {}} />
    )
  }
}
