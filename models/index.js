import Datastore from 'react-native-local-mongodb'
import axios from 'axios'
import * as Crypto from 'aes-js'

export const DB = new Datastore({
   filename: 'asyncStorageKey',
   autoload: true
})

// TODO: encrypt the payload before saving to database
export const exportDB = (url) => {
  DB.findAsync({}).then(db => {
    alert(`exporting db: ${JSON.stringify(db)}`)
    axios.post(url, db)
  })
}
