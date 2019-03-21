import { 
	SIGN_UP,
	LOGOUT,
	UPDATE_DISTANCE,
	SET_ADDRESS,
	UPDATE_USER
} from './actionTypes'

const signUp = param => {
	return ({
			type: SIGN_UP,
			payload: param
	})
}

const updateUser = param => {
	return ({
			type: UPDATE_USER,
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

const setAddress = param => {
	return ({
		type: SET_ADDRESS,
		payload: param
	})
}

export {
	signUp,
	logOut,
	updateDistance,
	setAddress,
	updateUser
}