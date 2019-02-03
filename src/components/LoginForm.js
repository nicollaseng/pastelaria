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
	render(){
		return (
			<ImageBackground source={require('../assets/img/login.jpg')} style={styles.loginScreen} >
				 <Content contentContainerStyle={styles.container}>
          <Form style={styles.loginForm}>
            <Item inlineLabel>
              <Label style={styles.label}>Username</Label>
              <Input style={[ styles.input ]} />
            </Item>
            <Item inlineLabel last>
              <Label style={styles.label}>Password</Label>
              <Input style={[ styles.input ]} secureTextEntry />
            </Item>
          </Form>
					<Button block style={ styles.button }>
						<Text>Login</Text>
					</Button>
					<TouchableOpacity>
						<Text style={styles.footer}> Cadastre-se </Text>
					</TouchableOpacity>
        </Content>
			</ImageBackground>
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
		paddingHorizontal: 20,
		marginBottom: 50
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