// setting up enzyme
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

global.navigator = {
  geolocation: {
    clearWatch: jest.fn(),
    requestAuthorization: jest.fn(),
    watchPosition: jest.fn(),
    getCurrentPosition: jest.fn()
  }
}
global.localStorage = localStorageMock
