import { CHART } from './actionTypes'

export const setChart = param => {
    return ({
        type: CHART,
        payload: param
    })
}