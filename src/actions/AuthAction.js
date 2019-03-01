import { 
	SIGN_UP,
	LOGOUT,
	UPDATE_DISTANCE
} from './actionTypes'

const signUp = param => {
	return ({
			type: SIGN_UP,
			payload: param
	})
}

const logOut = param => {
	return ({
		type: LOGOUT,
		payload: param
	})
}

const updateDistance = param => {
	return ({
		type: UPDATE_DISTANCE,
		payload: param
	})
}

export {
	signUp,
	logOut,
	updateDistance
}