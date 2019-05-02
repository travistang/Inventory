import React from "react"
import renderer from "react-test-renderer"
import { shallow } from "enzyme"
import ImportRecordOverlay from "../importRecordOverlay"
import { TouchableOpacity } from "react-native"

const mockState = {
  isOpen: false,
  onClose: jest.fn(),
  availableSnapshots: ["a", "b"],
  fetchAvailableListOfRecords: jest.fn(() =>
    new Promise().resolve(["log1", "log2"])
  ),
  onSnapshotSelected: jest.fn(),
  onServerURLChange: jest.fn(),
  serverURL: ""
}

it("renders given snapshots properly", () => {
  const wrapper = shallow(<ImportRecordOverlay {...mockState} />)

  expect(wrapper.find(TouchableOpacity)).toHaveLength(2)
})

it("returns the snapshot name on click", () => {
  const wrapper = shallow(<ImportRecordOverlay {...mockState} />)

  // press the first snapshot
  wrapper
    .find(TouchableOpacity)
    .first() // the "a"
    .props()
    .onPress()

  expect(mockState.onSnapshotSelected).toBeCalledWith("a")
})
