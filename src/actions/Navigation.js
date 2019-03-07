import { NAVIGATOR_TAB } from './actionTypes'

const tabNavigator = (param, data) => {
	return ({
		type: NAVIGATOR_TAB,
		payload: [param, data]
	})
}

export {
  tabNavigator,
}