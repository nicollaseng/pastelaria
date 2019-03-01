import { PAYMENT } from './actionTypes'

export const payment = param => {
    return ({
        type: PAYMENT,
        payload: param
    })
}