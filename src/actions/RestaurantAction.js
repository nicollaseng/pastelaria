import { RESTAURANT_INFO } from './actionTypes'

export const setRestaurantInfo = param => {
    return ({
        type: RESTAURANT_INFO,
        payload: param
    })
}