import axios from "axios"
import * as models from "../"

const mockData = [{ _id: 1234 }, { _id: 5678 }]
const mockImportData = [{ _id: 7890 }]
const mockURL = "mock_url"

jest.mock("axios")

const findAsyncSpy = jest.spyOn(models.DB, "findAsync")
const insertSpy = jest.spyOn(models.DB, "insert")
const removeSpy = jest.spyOn(models.DB, "remove")

beforeEach(() => {
  jest.resetModules()
})

afterEach(() => {
  findAsyncSpy.mockReset()
  insertSpy.mockReset()
  removeSpy.mockReset()
})

it("post correct export data from database", async () => {
  axios.post.mockResolvedValue({ status: "ok" })

  // arm the spy
  findAsyncSpy.mockResolvedValueOnce(mockData)

  const result = await models.exportDB(mockURL)
  expect(axios.post).toBeCalledWith(mockURL, mockData)
})

it("should import correct data from server", async () => {
  // arm the spy
  removeSpy.mockImplementation((query, config, callback) => callback(null, 0))

  insertSpy.mockImplementationOnce((data, callback) =>
    // let's say there are no errors when inserting, and return the number of data it has inserted.
    callback(null, data.length)
  )

  // acutal thing for testing
  const importResult = await models.importDataToDB(mockImportData)

  // check if insert is indeed be called with mockImportData
  expect(insertSpy).toBeCalledWith(mockImportData, expect.anything())
  // check if the resolved value is true
  expect(importResult).toBe(true)
})

it("should not call insert if there are errors in `DB.remove`", async () => {
  // fake an error in remove
  removeSpy.mockImplementation((query, config, callback) =>
    callback(new Error(), null)
  )
  // arm the spy to see if it gets called.
  const importResult = await models.importDataToDB(mockData)

  expect(insertSpy).not.toHaveBeenCalled()
  expect(importResult).toBe(false)
})
