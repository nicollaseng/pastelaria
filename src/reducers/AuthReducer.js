import { 
	LOGOUT,
	SIGN_UP,
	UPDATE_DISTANCE,
	SET_ADDRESS,
	UPDATE_USER
} from '../actions/actionTypes'

const initial_state = {
		currentUser: {},
		loginToken: {},
		address: {}
}

export const authReducer = (state = initial_state, action) => {
	switch(action.type){
		case SIGN_UP:
			return { ...state, currentUser: action.payload }
		case UPDATE_USER:
			return { ...state, currentUser: action.payload }
		case LOGOUT:
			return { ...state, currentUser: {} };
		case UPDATE_DISTANCE:
			return { ...state, currentUser: action.payload };
		case SET_ADDRESS:
			return { ...state, address: action.payload };
		default:
			return state
	}
}