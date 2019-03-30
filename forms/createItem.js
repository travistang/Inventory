import React from 'react'
import {
  Formik
} from 'formik'
import {
 View,
 Picker,
 StyleSheet,
 Text
} from 'react-native'

import { recognizedUnits } from '../constants'
import * as Yup from 'yup'
import * as _ from 'lodash'
import ItemModel from '../models/items'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import {
  TextInput, Card, DropdownInput, Button
} from '../components'

import { colors } from '../theme'
const { primary, secondary, white } = colors

export default function({
  initialItemValues = ItemModel.initialItemValues,
  onSubmit,
  style
}) {
  // given a name, check if an item with same name exists before
  const checkItemNameCollision = async ({itemName, setStatus}) => {
    const existingItem = await ItemModel.getItemByName(itemName)
    if(!!existingItem) {
      setStatus({
        name: "Item with given name has been recorded already"
      })
    } else {
      setStatus({})
    }
  }

  return (
    <Formik
      validationSchema={ItemModel.validationSchema()}
      initialValues={initialItemValues}
    >
    {
      ({
        setStatus, errors, values, dirty, status,
        setFieldValue, isSubmitting
      }) => {
        return (
          <View style={style.formContainer}>
            <Card style={style.cardContainer}>
              <TextInput
                label="Item Name"
                name="name"
                icon="tag"
                errors={errors}
                values={values}
                setFieldValue={setFieldValue}
                onChangeText={(itemName) => {
                  setFieldValue("name", itemName)
                  checkItemNameCollision({itemName, setStatus})
                }}
              />
              <TextInput
                label="Initial Amount"
                name="amount"
                icon="weight"
                iconColor={secondary}
                keyboardType="decimal-pad"
                errors={errors}
                values={values}
                setFieldValue={setFieldValue}
              />
              <View style={style.unitRowContainer}>
                <DropdownInput
                  label="Unit"
                  icon="tachometer"
                  iconColor={secondary}
                  selectedValue={values["unit"]}
                  onValueChange={(unit) => setFieldValue("unit", unit)}
                  label="Unit"
                >
                  {
                    recognizedUnits.map((unit, i) => (
                      <Picker.Item key={i} label={unit} value={unit} />
                    ))
                  }
                </DropdownInput>
              </View>

            </Card>


            <View style={style.submitButton}>
              <Button
                type="block"
                color={secondary}
                containerStyle={style.button}
                title="Create Item"
                icon="add"
                onPress={() => onSubmit(values)}
                disabled={
                  !dirty
                  || !_.isEmpty(errors)
                  || !_.isEmpty(status)
                  || isSubmitting
                }
              >
              </Button>
            </View>
          </View>
        )
      }
    }
  </Formik>
  )
}
