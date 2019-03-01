import { USER_INFO } from '../actions/actionTypes'

const initial_state = {
    accessToken: {}
}

export const token = (state = initial_state, action) => {
	switch(action.type){
			case USER_INFO:
					return { ...state, accessToken: action.payload }
			default:
					return state
	}
}