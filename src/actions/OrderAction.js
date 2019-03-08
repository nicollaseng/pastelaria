import { ORDER, ALL_ORDER, RATING } from './actionTypes'

const submitOrder = param => {
	return ({
		type: ORDER,
		payload: param
	})
}

const setOrder = param => {
	return ({
		type: ALL_ORDER,
		payload: param
	})
}

const setRating = param => {
	return ({
		type: RATING,
		payload: param
	})
}

export {
  submitOrder,
  setOrder,
  setRating
}