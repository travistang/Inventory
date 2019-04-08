import * as Yup from 'yup'

export const LocationSchema = Yup.object().shape({
  location: Yup.object().shape({
    lat: Yup.number().isRequired,
    lng: Yup.number().isRequired
  }).isRequired,
  // optional string value
  name: Yup.string(),
})

export const LocationInitialValues = {
  location: {
    lat: 0,
    lng: 0
  },
  name: ""
}

export const ItemSchema = Yup.object().shape({
  name: Yup.string().required(),
  amount: Yup.number().moreThan(0).required(),
  cost: Yup.number().moreThan(0).required()
})

export const ItemIntialValues = {
  name: "",
  amount: 0,
  cost: 0,
}
