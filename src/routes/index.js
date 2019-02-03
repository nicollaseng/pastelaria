import { createStackNavigator, createAppContainer } from 'react-navigation'
import Login from '../index'
import CEP from '../screens/Cep/CepScreen'

const AppNavigator = createStackNavigator({
    Login: {
        screen: Login
    },
    CEP: {
        screen: CEP
    },
}, {
    headerMode: 'none',
    })

const AppContainer = createAppContainer(AppNavigator)

export default AppContainer