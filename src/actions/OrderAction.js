import { ORDER } from './actionTypes'

const setOrder = param => {
	return ({
		type: ORDER,
		payload: param
	})
}

export {
  setOrder,
}