import { combineReducers } from 'redux'
import { token } from './UserProfile'
import { authReducer } from './AuthReducer'
import { payment } from './PaymentReducer'
import { navigation } from './NavigationReducer'
import { selectCategory } from './ProfessionalReducer'

export const Reducers = combineReducers({
    token,
    authReducer,
    navigation,
    selectCategory
})
