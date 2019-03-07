import { NAVIGATOR_TAB } from '../actions/actionTypes'

const initial_state = {
	tab: 'categories',
	data: ''
}

export const navigation = (state = initial_state, action) => {
	switch(action.type){
		case NAVIGATOR_TAB:
			return { ...state, tab: action.payload[0], data: action.payload[1] }
		default:
			return state
	}
}