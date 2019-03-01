import { NAVIGATOR_TAB } from './actionTypes'

const tabNavigator = param => {
	return ({
		type: NAVIGATOR_TAB,
		payload: param
	})
}

export {
  tabNavigator,
}