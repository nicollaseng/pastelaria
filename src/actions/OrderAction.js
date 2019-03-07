import { ORDER, ALL_ORDER } from './actionTypes'

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

export {
  submitOrder,
  setOrder
}