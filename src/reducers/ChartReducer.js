import { CHART, PAYMENT } from '../actions/actionTypes'

const initial_state = {
	chart: [],
	payment: '',
	paymentChange: ''
}

export const chart = (state = initial_state, action) => {
	switch(action.type){
			case CHART:
					return { ...state, chart: action.payload }
			case PAYMENT:
					return { ...state, payment: action.payload, paymentChange: action.paymentChange }
			default:
					return state
	}
}