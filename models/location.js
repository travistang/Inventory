import { DB } from './'

import * as Yup from 'yup'

// a transaction takes place in a location, which may or may not be recorded.
export class Location {
  static get type() {
    return "LOCATION"
  }

  static get initialLocationValues() {
    return {
      location: {
        latitude: 0,
        longitude: 0,
      },
      name: ""
    }
  }

  static get validationSchema() {
    return Yup.object().shape({
      location: Yup.object().shape({
        latitude: Yup.number().isRequired,
        longitude: Yup.number().isRequired
      }).isRequired,
      // optional string value
      name: Yup.string(),
    })
  }

  /*
  given a result from location form, it should consists of the following:
    {
      location: { latitude, longitude},
      name,
      shouldSaveLocation
    }
    if "shouldSaveLocation" is not present, a null will be returned and nothing will be added to the data base.
    otherwise a
  */
  async getLocationById(_id) {
    return await this.DB.findAsync({
      type: Location.type,
      _id
    })
  }

  async recordLocation({shouldSaveLocation, ...locationValues}) {
    if(!shouldSaveLocation) return null
    try {
      const {_id} = await this.DB.insertAsync({
        ...locationValues,
        type: Location.type,
      })
      alert(`location ID: ${_id}`)
      return _id
    } catch(err) {
      return null
    }

  }
  constructor(DB) {
    this.DB = DB
  }
}

export default new Location(DB)
