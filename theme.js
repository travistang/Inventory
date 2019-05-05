import React from "react"
import { setCustomText } from "react-native-global-props"

export const configureGlobalProps = () => {
	setCustomText({
		style: {
			fontFamily: "Raleway"
		}
	})
}
const theme = {
	Text: {
		// h2Style: {
		//   fontWeight: 'regular'
		// },
		// h3Style: {
		//   fontWeight: 'regular'
		// }
	},
	Button: {
		// raised: true
	}
}

export default theme

export const rgbToHex = (r, g, b) => {
	const decToHex = dec => Number(dec).toString(16)
	return `#${decToHex(r)}${decToHex(g)}${decToHex(b)}`
}

export const iconOf = {
	item: "gift",
	trigger: "crosshairs"
}
export const colors = {
	background: rgbToHex(248, 249, 250),
	white: rgbToHex(255, 255, 255),
	black: rgbToHex(0, 0, 0),
	// text colors
	textPrimary: rgbToHex(0, 0, 0),
	textSecondary: rgbToHex(168, 168, 168),
	// background / solid colors
	primary: rgbToHex(255, 41, 17),
	secondary: rgbToHex(57, 104, 255),
	danger: rgbToHex(255, 89, 63),
	info: rgbToHex(126, 117, 140)
}

export const shadow = {
	shadowColor: "#000",
	shadowOffset: {
		width: 0,
		height: 2
	},
	shadowOpacity: 0.25,
	shadowRadius: 3.84,
	elevation: 5
}
