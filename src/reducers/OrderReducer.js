import { ORDER, ALL_ORDER, RATING } from '../actions/actionTypes'

const initial_state = {
		currentOrder: {},
		allOrders: [],
		rating: []
}

export const order = (state = initial_state, action) => {
	switch(action.type){
			case ORDER:
				return { ...state, order: action.payload }
			case ALL_ORDER:
				return { ...state, allOrders: action.payload }
			case RATING:
				return { ...state, rating: action.payload }
			default:
				return state
	}
}