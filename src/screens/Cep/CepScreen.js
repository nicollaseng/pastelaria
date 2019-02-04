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
import VMasker from 'vanilla-masker'

class CEPScreen extends Component {

	constructor(props){
		super(props)
		this.state = {
			borderBottomColor: '#fff', 
			cep: '',
			// Geolocation
			userLat: '',
			userLong: '',
			companyLat: '',
			companyLong: '',

			// flags
			fetch: false,
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

	mask = (param) => {
		// let unMasked = VMasker(param).unMask()
		let masked = 	VMasker.toPattern(param, "99.999-999"); 
		this.setState({ cep: masked })
	}

	unMask = value => {
    const regex = /[^a-zA-Z0-9]/g;
    return (value || '')
      .toString()
      .replace(regex, '')
      .replace('R', '');
  };

	fetchCep = () => {
		let cep = this.unMask(this.state.cep)
		console.log(cep)
		fetch(`http://viacep.com.br/ws/${cep}/json/`)
		.then(response => response.json())
		.then(response => {
			console.log('response cep', response)
			this.setState({
				address: response.logradouro,
				neighborhood: response.bairro,
				fetch: true
			})
		})
	}
	

	render(){
		return (
			<View style={styles.container}>
				<HeaderView title="Consulta CEP" onBack={this.onBack} />
				<View style={styles.subContainer}>
						{!this.state.fetch ? (
						<View>
								<Text style={styles.cep}> CEP </Text>
								<Item inlineLabel>
									<Input
										value={this.state.cep}
										style={[ styles.input, { borderBottomColor: this.state.borderBottomColor} ]}
										onChangeText={this.mask} />
								</Item>
								<Button block style={ styles.button } onPress={ this.fetchCep }>
									<Text> Consultar </Text>
								</Button>
						</View>
						) : (
							<View style={{ flex: 1 }}>
								<View style={ styles.addressContainer }>
									<Item rounded>
										<Input />
									</Item>
									<Item rounded>
										<Input />
									</Item>
								</View>
								<Item rounded>
									<Input />
								</Item>
							</View>
						)}
						
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
		fontSize: 21,
		fontWeight: '600',
		borderBottomWidth: 1,
		textAlign:'center'
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
		fontSize: 20,
		fontWeight: '600',
		textAlign: 'center',
		padding: 10
	},
	addressContainer: {
		flex: 1,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center'
	}
}

export default withNavigation(CEPScreen)