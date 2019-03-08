
import React from 'react'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import screens from './screens';

const AppNavigator = createStackNavigator({
	Login: {
		screen: screens.Login
	},
	CEP: {
		screen: screens.CEP
	},
	Signup: {
		screen: screens.SignupScreen
	},
	DashBoard: {
		screen: screens.DashboardScreen
	},
	Chart: {
		screen: screens.ChartScreen
	},
	OrderDetail: {
		screen: screens.OrderDetailScreen
	},
	Payment: {
		screen: screens.PaymentScreen
	}
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
