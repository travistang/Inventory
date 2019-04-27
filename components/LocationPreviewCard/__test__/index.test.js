import React from 'react'
import renderer from 'react-test-renderer'
import { shallow, mount } from 'enzyme'
import LocationPreviewCardContainer from '../'

import LocationModel from 'models/location'


it('gives correct initial states', () => {
  const mockProps = {
    location: "hahaha"
  }
  const wrapper = shallow(
    <LocationPreviewCardContainer {...mockProps} />
  )

  expect(wrapper.instance().state.location).toBe(null)
})

it('prevents malformed location object to be set as state', () => {
  const trash = {some: "trash"}
  // temporarily make the LocationModel's `getLocationById` return a trash value.
  const spy = jest.spyOn(LocationModel, 'getLocationById')
    .mockImplementation(_ => trash)

  const wrapper = mount(
    <LocationPreviewCardContainer location='whatever' />
  )
  const instance = wrapper.instance()

  // check the fake method needs to be called once (at componentDidMount)
  expect(spy.toHaveBeenCalled(1))

  // check the fake method is indeed fake.
  expect(
    jest.isMockFunction(Locationmodel.getLocationById))
    .toBe(true)

  // check the instance's state has not be modified.
  expect(wrapper.instance().state.location).toBe(null)

  // finally tear down the mock.
  spy.mockRestore()
})
