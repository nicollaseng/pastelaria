import { CHART, PAYMENT } from './actionTypes'

const setChart = param => {
    return ({
        type: CHART,
        payload: param
    })
}

const setPayment = (payment, paymentChange) => {
    return ({
        type: PAYMENT,
        payload: payment,
        paymentChange
    })
}

export { setChart, setPayment }