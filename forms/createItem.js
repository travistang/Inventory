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

import {
  Button
} from 'react-native-elements'

import { recognizedUnits } from '../constants'
import * as Yup from 'yup'
import * as _ from 'lodash'
import ItemModel from '../models/items'
import Icon from 'react-native-vector-icons/dist/FontAwesome'
import TextInput from '../components/TextInput'
import Card from '../components/Card'
import DropdownInput from '../components/DropdownInput'
import { colors } from '../theme'
const { primary, secondary, white } = colors

export default function({
  initialItemValues = ItemModel.initialItemValues,
  onSubmit,
  style
}) {
  // given a name, check if an item with same name exists before
  const checkItemNameCollision = async ({itemName, setErrors, errors}) => {
    const existingItem = await ItemModel.getItemByName(itemName)
    if(!!existingItem) {
      setErrors({
        ...errors,
        name: "Item with given name has been recorded already"
      })
    }
  }
  return (
    <Formik
      validationSchema={ItemModel.validationSchema()}
      initialValues={initialItemValues}
    >
    {
      ({
        setErrors, errors, values, dirty,
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
                onChange={(itemName) =>
                  checkItemNameCollision({itemName, setErrors, errors})}
              />
              <TextInput
                label="Initial Amount"
                name="amount"
                icon="ruler"
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
                containerStyle={style.button}
                title="Create Item"
                icon={{name: "add"}}
                onPress={() => onSubmit(values)}
                disabled={!dirty || !_.isEmpty(errors) || isSubmitting}
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
