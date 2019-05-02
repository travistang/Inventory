import { DB } from "./"

import * as Yup from "yup"
import { latLngDistance } from "utils"
// a transaction takes place in a location, which may or may not be recorded.
export class Location {
  static get type() {
    return "LOCATION"
  }

  static get initialValues() {
    return {
      location: {
        latitude: 0,
        longitude: 0
      },
      name: ""
    }
  }

  static get validationSchema() {
    return Yup.object().shape({
      location: Yup.object()
        .shape({
          latitude: Yup.number().required(),
          longitude: Yup.number().required()
        })
        .required(),
      // optional string value
      name: Yup.string()
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
    return await this.DB.findOneAsync({
      type: Location.type,
      _id
    })
  }
  /*
    return is a list of {
      location: { latitude: number, longitude: number},
      name: string,
      distance: number
    }
  */
  async getSavedLocationsNearby(
    { latitude: lat, longitude: lng },
    numLocations = 5
  ) {
    const allLocations = await this.DB.findAsync({
      type: Location.type
    })
    return allLocations
      .map(loc => {
        const { latitude: latLoc, longitude: lngLoc } = loc.location
        return { ...loc, distance: latLngDistance(latLoc, lngLoc, lat, lng) }
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, numLocations)
  }

  async recordLocation({
    shouldSaveLocation,
    registeredLocation,
    ...locationValues
  }) {
    if (registeredLocation) {
      const { _id } = await this.DB.findOneAsync({
        type: Location.type,
        name: locationValues.name
      })
      // pretend that we registered this location, and deliver it as result
      return _id
    } else {
      if (!shouldSaveLocation) return {}
      try {
        // not registered. registering location
        const validationResult = await Location.validationSchema.validate(
          locationValues
        )
        if (validationResult) {
          const { _id } = await this.DB.insertAsync({
            ...locationValues,
            type: Location.type
          })

          return _id
        } else {
          return null //
        }
      } catch (err) {
        return null
      }
    }
  }
  constructor(DB) {
    this.DB = DB
  }
}

export default new Location(DB)
