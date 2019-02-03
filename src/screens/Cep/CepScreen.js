import React, { Component } from 'react'
import { ImageBackground, TouchableOpacity } from 'react-native'
import { View } from 'react-native'
import {
	 Content,
	 Form,
	 Item,
	 Input,
	 Label,
	 Button,
	 Text } from 'native-base'
import { withNavigation } from 'react-navigation'
import HeaderView from '../../components/HeaderView'

class LoginForm extends Component {

	constructor(props){
		super(props)
		this.state = {
			borderBottomColor: '#fff'
		}
	}

	navigate = () => {
		this.props.navigation.navigate('CEP')
	}

	onBack = () => {
		this.props.navigation.goBack()
	}

	handleInput = (param) => {
		this.setState({
			cep: param,
			borderBottomColor: '#e60000'
		})
	}

	render(){
		return (
			<View style={styles.container}>
				<HeaderView title="Consulta CEP" onBack={this.onBack} />
				<View style={styles.subContainer}>
						<Text style={styles.cep}> CEP </Text>
						<Item inlineLabel>
							<Input
								style={[ styles.input, { borderBottomColor: this.state.borderBottomColor} ]}
								onChangeText={this.handleInput} />
						</Item>
					<Button block style={ styles.button }>
						<Text> Consultar </Text>
					</Button>
				</View>
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
		flex: 1,
	},
	subContainer: {
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 20
	},
	loginForm: {
		paddingVertical: 20
	},
	button: {
		marginVertical: 40,
		backgroundColor: '#e60000'
	},
	label: {
		color: '#fff',
		fontSize: 15,
		fontWeight: '700'
	},
	input: {
		color: '#000',
		fontSize: 13.5,
		fontWeight: '600',
		borderBottomWidth: 1
	},
	footer: {
		color: '#e60000',
		fontSize: 13.5,
		fontWeight: '600',
		textAlign: 'center',
		padding: 10
	},
	cep: {
		color: '#e60000',
		fontSize: 16,
		fontWeight: '600',
		textAlign: 'center',
		padding: 10
	}
}

export default withNavigation(LoginForm)