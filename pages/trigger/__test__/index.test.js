import React from "react"
import TriggerPageContainer from "../"
import { shallow } from "enzyme"
import TriggerModel from "models/trigger"

it("should fetch triggers properly", async () => {
  const mockTriggers = [{ id: "a" }, { id: "b" }]
  const spy = jest
    .spyOn(TriggerModel, "getAllTriggers")
    .mockResolvedValueOnce(mockTriggers)

  const wrapper = shallow(<TriggerPageContainer />)
  // await wrapper.instance().componentDidMount()

  expect(spy).toHaveBeenCalled()
})
