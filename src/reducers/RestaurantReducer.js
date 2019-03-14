import { RESTAURANT_INFO } from '../actions/actionTypes'

const initial_state = {
    restaurantInfo: {}
}

export const restaurant = (state = initial_state, action) => {
	switch(action.type){
			case RESTAURANT_INFO:
					return { ...state, restaurantInfo: action.payload }
			default:
					return state
	}
}