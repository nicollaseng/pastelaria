import { 
	SELECT_CATEGORY
} from '../actions/actionTypes'

const initial_state = {
		categorySelected: '',
}

export const selectCategory = (state = initial_state, action) => {
	switch(action.type){
		case SELECT_CATEGORY:
				return { ...state, categorySelected: action.payload }
		default:
			return state
	}
}