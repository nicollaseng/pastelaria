import { 
	LOGOUT,
	SIGN_UP,
	UPDATE_DISTANCE
} from '../actions/actionTypes'

const initial_state = {
		currentUser: {},
		loginToken: {},
}

export const authReducer = (state = initial_state, action) => {
	switch(action.type){
		case SIGN_UP:
			return { ...state, currentUser: action.payload }
		case LOGOUT:
			return { ...state, currentUser: {} };
		case UPDATE_DISTANCE:
			return { ...state, currentUser: action.payload };
		default:
			return state
	}
}