import Datastore from 'react-native-local-mongodb'
import axios from 'axios'
import * as Crypto from 'aes-js'
import { serverURL } from '../constants'

export const DB = new Datastore({
   filename: 'asyncStorageKey',
   autoload: true
})

// TODO: encrypt the payload before saving to database
export const exportDB = () => {
  return DB.findAsync({}).then(db =>
    axios.post(serverURL, db)
  ).then(response => {
    alert(response)
  })
}
