import { ORDER } from './actionTypes'

const submitOrder = param => {
	return ({
		type: ORDER,
		payload: param
	})
}

export {
  submitOrder,
}