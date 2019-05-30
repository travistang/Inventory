import { DB } from "./"
import * as Yup from "yup"
import ItemModel, { Item } from "./items"
import PropTypes from "prop-types"

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
	static triggerTypeDescription(type) {
		switch (type) {
			case Trigger.triggerType.QUANTITY_LESS_THAN:
				return "Quantity"
			default:
				return ""
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
			activated: false,
			triggerType: Object.values(Trigger.triggerType)[0],
			triggerValue: 0
		}
	}
	/**
    Define the propTypes of Trigger objects.

  */
	static get propTypes() {
		return PropTypes.shape({
			activated: PropTypes.bool.isRequired,
			triggerType: PropTypes.number.oneOf(Object.values(Trigger.triggerType)),
			triggerValue: PropTypes.oneOfType([PropTypes.number, PropTypes.date])
				.isRequired
		})
	}
	/**
    Define the schema of Trigger objects.

    @returns {Object} Yup object for the validation schema
  */
	static get validationSchema() {
		return Yup.object().shape({
			activated: Yup.bool().required(),
			triggerType: Yup.number()
				.required()
				.oneOf(Object.values(Trigger.triggerType)),
			triggerValue: Yup.mixed().required()
		})
	}

	constructor(DB) {
		this.DB = DB
	}
	/**
    Get the text description of trigger type.

    @return string: the description
  */
	static nameForType(type) {
		switch (type) {
			case Trigger.triggerType.QUANTITY_LESS_THAN:
				return "quantity"
			default:
				return ""
		}
	}

	/**
    Get the default value of trigger type.

    @return mixed: The default value, can be of any type, depending on the given type.
  */
	static defaultValueForType(type) {
		switch (type) {
			case Trigger.triggerType.QUANTITY_LESS_THAN:
				return 0
			default:
				return null
		}
	}

	static get defaultTriggersForItem() {
		return Object.values(Trigger.triggerType).map(triggerType => ({
			triggerType,
			triggerValue: Trigger.defaultValueForType(triggerType),
			activated: false
		}))
	}
	/**
    Get all triggers activated.

    @return {array} array of triggers that is activated
  */
	async getActivatedTriggers() {
		// get and expand triggers
		const items = await ItemModel.getItems()
		const itemWithActiveTriggers = items.map(item => ({
			// now this is all items with their active triggers
			...item,
			triggers: item.triggers.filter(trig => trig.activated)
		}))

		const activeTriggers = itemWithActiveTriggers.reduce(
			// this is list of active triggers with associated item in it
			(list, item) => [
				...list,
				...item.triggers.map(trig => ({ ...trig, item }))
			],
			[]
		)
		return activeTriggers
	}
	/**
    Given a trigger for an item and the type of trigger interested,
  */
	async toggleActivate(item, triggerType) {
		const itemRef = await ItemModel.getItemById(item._id)
		if (!itemRef) return false
		const currentTriggerConfig = itemRef.triggers.filter(
			trig => trig.triggerType == triggerType
		)[0]
		const otherTriggers = itemRef.triggers.filter(
			trig => trig.triggerType != triggerType
		)
		const updateResult = await this.DB.updateAsync(
			{ _id: item._id },
			{
				// update op
				$set: {
					triggers: [
						...otherTriggers, // keep oher irrelevant trigger
						{
							...currentTriggerConfig,
							activated: !currentTriggerConfig.activated // change the activated flag fot this trigger type only
						}
					]
				}
			}
		)
		return true
	}
}

export default new Trigger(DB)
