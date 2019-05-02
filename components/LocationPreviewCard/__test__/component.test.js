import React from 'react'
import renderer from 'react-test-renderer'
import {
  View, Text
} from 'react-native'
import { shallow } from 'enzyme'
import Component from '../component'
import MapView from 'react-native-maps-osmdroid'

it('should render "Location unavailable" when no location is provided',
  () => {
    const wrapper = shallow(<Component />)

    expect(wrapper.find(Text)).toHaveLength(1)
  }
)

it('should render a map when a location is provided', () => {
  const mockLocation = {location: { latitude: 0, longitude: 0} }
  const wrapper = shallow(<Component location={mockLocation} />)
  expect(wrapper.find(MapView)).toHaveLength(1)
})
