import { USER_INFO } from './actionTypes'

export const userInfo = param => {
    return ({
        type: USER_INFO,
        payload: param
    })
}