import Datastore from 'react-native-local-mongodb'

export const DB = new Datastore({
   filename: 'asyncStorageKey',
   autoload: true
})
