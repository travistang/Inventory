import React from "react"
import TriggerPage from "../component"
import { shallow } from "enzyme"
import { CenterNotice } from "components"

it("should render no trigger notice", () => {
  const wrapper = shallow(<TriggerPage />)

  expect(wrapper.find(CenterNotice).length).toBe(1)
})
