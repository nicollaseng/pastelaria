import { combineReducers } from 'redux'
import { token } from './UserProfile'
import { authReducer } from './AuthReducer'
import { payment } from './PaymentReducer'
import { navigation } from './NavigationReducer'
import { selectCategory } from './ProfessionalReducer'
import { chart } from './ChartReducer'
import { order } from './OrderReducer'

export const Reducers = combineReducers({
    token,
    authReducer,
    navigation,
    selectCategory,
    chart,
    order
})
