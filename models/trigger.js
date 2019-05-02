import { DB } from "./"
import * as Yup from "yup"
import ItemModel from "./items"
/**
  Trigger is an object that describes relations betwee items quantity and corresponding actions.
  Suppose you want to add an item to the buy list
*/
export class Trigger {
  /**
    Type of trigger to be identified from objects with different schema
  */
  static get type() {
    return "TRIGGER"
  }
  /**
    The meaning of the `trigger value` of this trigger.
  */
  static get triggerType() {
    return {
      QUANTITY_LESS_THAN: 1
    }
  }
  /**
    Define the initial values for forms that involves the creation of trigger.

    @note The initial values are NOT supposed to be valid against the validationa schema,
      so that the form cannot be submitted right away.

    @returns {Object} initial value
  */
  static get initialValues() {
    return {
      name: "",
      item: null,
      triggerType: Object.values(Trigger.triggerType)[0],
      triggerValue: 0,
      date: new Date()
    }
  }
  /**
    Define the schema of Trigger objects.

    @returns {Object} Yup object for the validation schema
  */
  static get validationSchema() {
    return Yup.object().shape({
      name: Yup.string().required(),
      // the ID of the item for this trigger to monitor on
      item: Yup.string().required(),
      triggerType: Yup.number()
        .required()
        .oneOf(Object.values(Trigger.triggerType)),
      triggerValue: Yup.mixed().required(),
      // date of the trigger created
      date: Yup.date().required()
    })
  }

  constructor(DB) {
    this.DB = DB
  }
  /**
    Add a trigger to the database

    @param {Object} trigger object to be added.
    @returns {Boolean} true if inserted; false otherwise
  */
  async addTrigger(trigger) {
    try {
      Trigger.validationSchema.validate(trigger)
      // marking this object as a Trigger object.
      const result = await DB.insertAsync({
        type: Trigger.type,
        ...trigger
      })
      return !!result
    } catch (_) {
      console.log(`catch in add trigger: ${_}`)
      return false
    }
  }

  /**
    Get a trigger by it's ID.

    @param {string} ID of the trigger.
    @returns {Object} trigger with given ID. Or `null` when no such trigger found.

  */
  async getTrigger(_id) {
    return await this.DB.findOneAsync({
      type: Trigger.type,
      _id
    })
  }

  /**
    Get all triggers registered.

    @param {boolean} expanded: indicate whether the returned triggers are expanded or not.
    @return {array} list of triggers
  */
  async getAllTriggers(expanded = false) {
    const triggers = await this.DB.findAsync({ type: Trigger.type })
    if (expanded) {
      return Promise.all(triggers.map(t => this.expandTrigger(t)))
    } else {
      return triggers
    }
  }

  /**
    Get all triggers activated.

    @return {array} array of triggers that is activated
  */
  async getActivatedTriggers() {
    // get and expand triggers
    const triggers = await this.getAllTriggers()
    const expandedTrigger = await Promise.all(
      triggers.map(this.expandTrigger.bind(this))
    )
    // then filter out those that is activated
    return expandedTrigger.filter(trig => this.isTriggerActivated(trig))
  }

  /**
    Given a trigger object, return an "expanded" trigger object
    by replacing the "item" field of it with the actual item.

    @param {Object} trigger: trigger matching validation schema with `item` field to be a string.

    @returns {Object} trigger with `item` field holding the actual item data.
    @returns {Object} if no such item is found, return the given object untouched.
   */
  async expandTrigger(trigger) {
    // determine if the given object suits the trigger schema
    try {
      Trigger.validationSchema.validate(trigger)
    } catch (_) {
      return trigger
    }

    // fetch the item within the trigger.
    const item = await ItemModel.getItemById(trigger.item)
    if (!item) return trigger // huh?!

    return {
      ...trigger,
      item
    }
  }

  /**
    Verify if a trigger is activated according to the trigger type.
    A trigger is said to be activated if it suits the requirement.

    @param {Object} expandedTrigger: trigger that has an expanded item field (by using Trigger#expandTrigger)

    @returns false if the trigger is found unexpanded.
    @returns true if trigger is expanded and is activated; false otherwise.
  */
  isTriggerActivated(expandedTrigger) {
    if (typeof expandedTrigger.item !== "object") {
      return false
    }
    const { item, triggerType, triggerValue } = expandedTrigger
    switch (triggerType) {
      case Trigger.triggerType.QUANTITY_LESS_THAN:
        return item.amount <= triggerValue
      default:
        return false
    }
  }
}

export default new Trigger(DB)
