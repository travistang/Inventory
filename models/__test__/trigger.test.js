import TriggerModel, { Trigger } from "../trigger"
import ItemsModel, { Item } from "../items"
import { DB } from "../"
import { Location } from "../location"

const insertAsyncSpy = jest.spyOn(DB, "insertAsync")
const findAsyncSpy = jest.spyOn(DB, "findAsync")
const getItemByIdSpy = jest.spyOn(ItemsModel, "getItemById")

/*
  Reset all spies after each test.
*/
afterEach(() => {
  insertAsyncSpy.mockReset()
  findAsyncSpy.mockReset()
  getItemByIdSpy.mockReset()
})

it("should reject invalid payload", () => {
  const mockTrigger = {
    name: "sample_trigger",
    a: "b"
  }

  expect(Trigger.validationSchema.validate(mockTrigger)).rejects.toBe(
    expect.anything()
  )
})

it("should mark valid payload as valid", () => {
  const mockTrigger = {
    name: "sample_trigger",
    type: Trigger.triggerType.QUANTITY_LESS_THAN,
    triggerValue: 0,
    date: new Date()
  }

  expect(Trigger.validationSchema.validate(mockTrigger)).resolves.toBe(
    expect.anything()
  )
})

it("should recognise the initial values as invalid", () => {
  expect(Trigger.validationSchema.validate(Trigger.initialValues)).rejects.toBe(
    expect.anything()
  )
})

it("creates triggers properly", async () => {
  const mockTrigger = {
    name: "sample_trigger",
    date: new Date(),
    triggerValue: 0,
    triggerType: Trigger.triggerType.QUANTITY_LESS_THAN
  }

  // spy on the DB's `insertAsync`
  insertAsyncSpy.mockResolvedValueOnce({ _id: "mock" })

  // launch test
  const addResult = await TriggerModel.addTrigger(mockTrigger)

  expect(addResult).toBe(true)
  expect(insertAsyncSpy).toBeCalledWith({
    ...mockTrigger,
    type: Trigger.type // added automatically to indicate the doc is a trigger
  })
})

it("get activated triggers correctly", async () => {
  findAsyncSpy.mockResolvedValueOnce([
    {
      type: Trigger.type,
      name: "trig1",
      _id: "trigger",
      triggerType: Trigger.triggerType.QUANTITY_LESS_THAN
    },

    { type: Location.type, name: "loc1", _id: "location" }
  ])
})

it("expand list of triggers correctly", async () => {
  const mockTriggers = [
    {
      name: "trig1",
      date: new Date(),
      item: "item_id1",
      triggerValue: 0,
      triggerType: Trigger.triggerType.QUANTITY_LESS_THAN
    },
    {
      name: "trig2",
      date: new Date(),
      item: "item_id2",
      triggerValue: 0,
      triggerType: Trigger.triggerType.QUANTITY_LESS_THAN
    }
  ]

  const mockItems = [
    { _id: "item_id1", amount: 10, unit: "kg", name: "item1" },
    { _id: "item_id2", amount: 10, unit: "kg", name: "item2" }
  ]

  getItemByIdSpy.mockImplementation(
    id => mockItems.filter(item => item._id == id)[0]
  )
  findAsyncSpy.mockResolvedValueOnce(mockTriggers)

  const expandedTriggers = await TriggerModel.getAllTriggers(true)

  // number of "get all triggers" should be the same as the number of total triggers
  expect(expandedTriggers.length).toBe(2)
  expect(expandedTriggers.every(trig => typeof trig.item == "object")).toBe(
    true
  )
})

it("expand triggers correctly", async () => {
  const itemId = "id"
  const mockItem = {
    type: Item.type,
    name: "hahhaa",
    _id: itemId
  }
  const mockTrigger = {
    type: Trigger.type,
    triggerType: Trigger.triggerType.QUANTITY_LESS_THAN,
    name: "trigger",
    _id: "trigger",
    item: itemId
  }

  getItemByIdSpy.mockResolvedValueOnce(mockItem)

  const expandedTrigger = await TriggerModel.expandTrigger(mockTrigger)

  expect(expandedTrigger).not.toBe(null)
  expect(expandedTrigger.item).toBe(mockItem)
})

it("detects activated trigger correctly", () => {
  const mockExpandedTrigger = {
    name: "trigger",
    type: Trigger.type,
    item: {
      name: "item",
      _id: "item",
      amount: 0,
      unit: "L"
    },
    triggerValue: 8,
    triggerType: Trigger.triggerType.QUANTITY_LESS_THAN
  }

  const isTriggerActivated = TriggerModel.isTriggerActivated(
    mockExpandedTrigger
  )

  expect(isTriggerActivated).toBe(true)
})

it("detects inactivated trigger correctly", () => {
  const mockExpandedTrigger = {
    name: "trigger",
    type: Trigger.type,
    item: {
      name: "item",
      _id: "item",
      amount: 10,
      unit: "L"
    },
    triggerValue: 8,
    triggerType: Trigger.triggerType.QUANTITY_LESS_THAN
  }

  const isTriggerActivated = TriggerModel.isTriggerActivated(
    mockExpandedTrigger
  )

  expect(isTriggerActivated).not.toBe(true)
})
