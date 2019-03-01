import { SELECT_CATEGORY } from './actionTypes'

const selectCategory = param => {
	return ({
		type: SELECT_CATEGORY,
		payload: param
	})
}

export {
	selectCategory,
}