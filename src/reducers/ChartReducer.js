import { CHART } from '../actions/actionTypes'

const initial_state = {
    chart: []
}

export const chart = (state = initial_state, action) => {
	switch(action.type){
			case CHART:
					return { ...state, chart: action.payload }
			default:
					return state
	}
}