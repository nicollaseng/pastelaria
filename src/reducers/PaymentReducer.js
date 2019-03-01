import { PAYMENT } from '../actions/actionTypes'

const initial_state = {
    paymentCard: {}
}

export const payment = (state = initial_state, action) => {
	switch(action.type){
			case PAYMENT:
					return { ...state, paymentCard: action.payload }
			default:
					return state
	}
}