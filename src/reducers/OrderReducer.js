import { ORDER } from '../actions/actionTypes'

const initial_state = {
    order: {}
}

export const order = (state = initial_state, action) => {
	switch(action.type){
			case ORDER:
					return { ...state, order: action.payload }
			default:
					return state
	}
}