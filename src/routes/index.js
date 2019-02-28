
import React from 'react'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import screens from './screens';

const AppNavigator = createStackNavigator({
	Login: {
		screen: Login
	},
	CEP: {
		screen: CEP
	},
},
{
	initialRouteName: 'Login',
	headerMode: 'none',
	navigationOptions: {
		headerVisible: false,
	},
}
)

const AppContainer = createAppContainer(AppNavigator)

export default AppContainer
