import TriggerPageContainer from "../"
import TriggerModel, { Trigger } from "models/trigger"
import { shallow } from "enzyme"

it("should fetch triggers of the item", () => {
	const spy = jest.spyOn(TriggerModel, "getTriggerOfItem")
	const mockItem = { name: "item", _id: "abc", amount: 10, unit: "l" }
	const mockProps = {
		navigation: {
			getParam: (name, defaultValue) => {
				return mockItem
			}
		}
	}
	const wrapper = shallow(<TriggerPageContainer navigation={navigation} />)

	expect(spy).toHaveBeenCalled()
})
