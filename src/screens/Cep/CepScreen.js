import React, { Component } from 'react'
import { ImageBackground, TouchableOpacity } from 'react-native'
import {
	 Content,
	 Form,
	 Item,
	 Input,
	 Label,
	 Button,
	 Text } from 'native-base'

class LoginForm extends Component {

	navigate = () => {
		this.props.navigate.navigation('CEP')
	}
	render(){
		return (
			<View style={styles.container}>
				<Text> Oi </Text>
			</View>
		)
	}
}

const styles = { 
	loginScreen: {
		width: '100%',
		height: '100%',
	},
	container: {
		justifyContent: 'flex-end',
		flex: 1,
		// paddingHorizontal: 20,
		// marginBottom: 50
	},
	loginForm: {
		paddingVertical: 20
	},
	button: {
		paddingVertical: 20,
		backgroundColor: '#e60000'
	},
	label: {
		color: '#fff',
		fontSize: 15,
		fontWeight: '700'
	},
	input: {
		color: '#fff',
		fontSize: 13.5,
		fontWeight: '600'
	},
	footer: {
		color: '#fff',
		fontSize: 13.5,
		fontWeight: '600',
		textDecorationLine: 'underline',
		textAlign: 'center',
		padding: 10
	}
}

export default LoginForm