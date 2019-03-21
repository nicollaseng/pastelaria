import React, { Component } from 'react'
import { ImageBackground, TouchableOpacity } from 'react-native'
import { View, Alert } from 'react-native'
import {
	 Content,
	 Form,
	 Item,
	 Input,
	 Label,
	 Button,
	 Text,
	 Container,
	  	} from 'native-base'
import { withNavigation } from 'react-navigation'
import HeaderView from '../../components/HeaderView'
import VMasker from 'vanilla-masker'
import { MAPS_KEY } from 'react-native-dotenv'
import axios from 'axios';
import geolib from 'geolib'
import { colors } from "../../theme/global"
import { connect } from 'react-redux'
import { signUp, setAddress } from '../../actions/AuthAction'
import { setRestaurantInfo } from '../../actions/RestaurantAction'
import * as firebase from 'firebase'
import Dimensions from '../../utils/dimensions'
import { RESTAURANT } from 'react-native-dotenv'


class CEPScreen extends Component {

	constructor(props){
		super(props)
		this.state = {
			borderBottomColor: '#fff', 
			cep: '',

			// flags
			fetch: false,
			loading: false,

			// Geolocations
			addressLatitude: '',
			addressLongitude: '',
			userLatitude: '',
			userLongitude: '',
			restaurantRadius: '',

			//address
			addressNumber: '',
			address: '',
			city: '',
			neighborhood: '',
			aditionalAddressInformation:'',
			nearestAddressPoint: ''
		}
	}
	
	navigate = () => {
		this.props.navigation.navigate('CEP')
	}

	onBack = (oldUser) => {
		oldUser ? this.props.navigation.navigate('DashBoard') : this.props.navigation.goBack()
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
		fetch(`http://viacep.com.br/ws/${cep}/json/`)
		.then(response => response.json())
		.then(response => {
			this.setState({
				address: response.logradouro,
				neighborhood: response.bairro,
				city: response.localidade,
				fetch: true
			})
		})

		// retrieve from server restaurant info as address to get after latitude and longitude
		firebase.database().ref(`/foods/restaurantes/${RESTAURANT}`).once('value', (data) => {
			
			let dataObject = data.val()
			let addressNumber = dataObject.enderecoNumero
			let address = dataObject.endereco
			let cep = dataObject.cep
			let city = dataObject.cidade
			let radius = parseInt(dataObject.raioEntrega)*1000 // meters not km
			let tax = parseFloat(dataObject.taxaEntregaKm.replace(',','.')).toFixed(2)*10

			this.props.setRestaurantInfo(data.val()) // set all restaurant data into redux store

			//get lat and long from restaurant
			axios.get(`http://www.mapquestapi.com/geocoding/v1/address?key=${MAPS_KEY}&location=${addressNumber}+${address}+${city},${cep}`)
				.then(response => {
					let userLatitude = response.data.results[0].locations[0].displayLatLng.lat
					let userLongitude = response.data.results[0].locations[0].displayLatLng.lng
					this.setState({ userLongitude, userLatitude, restaurantRadius: radius, tax  })
				})
				.catch(err => {
					console.log(err)
				})
			console.log('restaruant data', dataObject)
		})

		// below we set restaurant address and get restaurante Lat and Long
	}

	checkAddress = async () => {
		const { currentUser} = this.props
		const { addressNumber,
						 city,
						 address,
						 userLatitude,
						 userLongitude,
						 cep,
						 neighborhood,
						 tax,
						 aditionalAddressInformation,
						 nearestAddressPoint,
					} = this.state
		let distance;
		this.setState({ loading: true })
		// bellow we check distance between restaurant and user 
		axios.get(`http://www.mapquestapi.com/geocoding/v1/address?key=${MAPS_KEY}&location=${addressNumber}+${address}+${city},${this.unMask(cep)}`)
			.then(response => {
				let locationLength = response.data.results[0].locations.length
				console.log('LATITUDEEEE', locationLength)
				let addressLatitude = response.data.results[0].locations[locationLength-1].latLng.lat
				let addressLongitude = response.data.results[0].locations[locationLength-1].latLng.lng
				distance = geolib.getDistance(
					{latitude: userLatitude, longitude: userLongitude},
					{latitude: addressLatitude, longitude: addressLongitude}
				);
				if(distance > this.state.restaurantRadius){
					Alert.alert('Atenção', 'Infelizmente ainda não cobrimos o endereço informado :(')
					return;
				}
				let deliveryTax = distance < 1000 ? parseFloat(tax) : ((distance/1000)*parseFloat(tax)).toFixed(2)

				let currentUserAddress = {
					...this.props.currentUser,
					addressLatitude,
					addressLongitude,
					userLatitude,
					userLongitude,
					addressNumber,
					address,
					city,
					neighborhood,
					deliveryTax,
					aditionalAddressInformation,
					nearestAddressPoint,
				}
				console.log('current user address', currentUserAddress)

				//update only if current user exists otherwise proceed normally
				if(this.props.currentUser && Object.keys(this.props.currentUser).length > 0){
					firebase.database().ref(`${RESTAURANT}/users/${this.props.currentUser.userId}`)
						.update({
							addressLatitude,
							addressLongitude,
							userLatitude,
							userLongitude,
							addressNumber,
							address,
							city,
							neighborhood,
							deliveryTax,
							aditionalAddressInformation,
							nearestAddressPoint,
						})
						.then(() => {
							console.log('User info updated successfully')
							this.setState({ isLoading: false })
							Alert.alert('Atenção', 'Seus dados pessoais foram atualizados com sucesso')
							this.props.signUp(currentUserAddress) // update redux current user with new address
							this.props.navigation.navigate('DashBoard')
						})
						.catch(err => {
							console.log('Error uptading user info', err)
							this.setState({ isLoading: false })
							Alert.alert('Ops :(', 'Algo deu errado. Tenta novamente mais tarde.')
						})
				} else {
					this.props.setAddress(currentUserAddress) // set global address for user at redux
					this.props.navigation.navigate(currentUser && Object.keys(currentUser).length > 0 ? 'DashBoard' : 'Signup')
				}
			})
			.catch(err => {
				console.log('error', err)
				Alert.alert('Atenção', 'Ops, houve algo errado :(  tente novamente em alguns instantes')
			})
	}

	focusInput(inputField) {
    this[inputField]._root.focus();
  }

	render(){
		const { currentUser } = this.props
		const oldUser = currentUser && Object.keys(currentUser).length > 0
		return (
			<View style={styles.container}>
				<HeaderView title={oldUser ? 'Meu endereço' : 'Consultar CEP'} onBack={() => this.onBack(oldUser)} />
				<View style={styles.subContainer}>
						{!this.state.fetch ? (
						<View>
								<Text style={styles.cep}> CEP </Text>
								<Item inlineLabel>
									<Input
										keyboardType='numeric'
										value={this.state.cep}
										style={[ styles.input, { borderBottomColor: this.state.borderBottomColor} ]}
										onChangeText={this.mask} />
								</Item>
								<Button block style={ styles.button } onPress={ this.fetchCep }>
									<Text> Consultar </Text>
								</Button>
						</View>
						) : (
								<Content style={styles.holder} keyboardShouldPersistTaps="handled">
									<View style={{ alignItems: 'center'}}> 
										<Label style={styles.logoText}>CONFIRME SEU ENDEREÇO</Label>
									</View>
									<View>
										<Form>
											<Item
												stackedLabel
											>
												<Label>Endereço</Label>
												<Input
													autoCapitalize="words"
													returnKeyType="next"
													onSubmitEditing={() => this.focusInput('addressNumber')}
													value={this.state.address}
													onChangeText={(address) => false }
												/>
											</Item>
											<Item
												stackedLabel
											>
												<Label>Número</Label>
												<Input
													ref={(c) => { this.addressNumber = c; }}
													autoCapitalize="words"
													returnKeyType="next"
													onSubmitEditing={() => this.focusInput('aditionalAddressInformation')}
													value={this.state.addressNumber}
													onChangeText={(addressNumber) => this.setState({ addressNumber }) }
												/>
											</Item>
											<Item
												stackedLabel
											>
												<Label>Complemento</Label>
												<Input
													ref={(c) => { this.aditionalAddressInformation = c; }}
													autoCapitalize="words"
													returnKeyType="next"
													onSubmitEditing={() => this.focusInput('nearestAddressPoint')}
													value={this.state.aditionalAddressInformation}
														onChangeText={(aditionalAddressInformation) => this.setState({ aditionalAddressInformation }) }
												/>
											</Item>
											<Item
												stackedLabel
											>
												<Label>Ponto de referência</Label>
												<Input
													ref={(c) => { this.nearestAddressPoint = c; }}
													autoCapitalize="words"
													returnKeyType="next"
													onSubmitEditing={() => this.focusInput('neighborhood')}
													value={this.state.nearestAddressPoint}
														onChangeText={(nearestAddressPoint) => this.setState({ nearestAddressPoint }) }
												/>
											</Item>
											<Item
												stackedLabel
											>
												<Label>Bairro</Label>
												<Input
													ref={(c) => { this.neighborhood = c; }}
													autoCapitalize="words"
													returnKeyType="next"
													onSubmitEditing={() => this.focusInput('city')}
													value={this.state.neighborhood}
													onChangeText={(neighborhood) => false }
												/>
											</Item>
											<Item
												stackedLabel
											>
												<Label>Cidade</Label>
												<Input
													ref={(c) => { this.city = c; }}
													autoCapitalize="words"
													returnKeyType="done"
													value={this.state.city}
													onChangeText={(city) => false }
												/>
											</Item>
										</Form>
									</View>
									<View style={{ width: '100%', alignItems: 'center', flexDirection: 'column'}}>
										<Button block style={ [styles.button] } onPress={ this.checkAddress }>
											<Text> Confirmar </Text>
										</Button>
										<TouchableOpacity block  onPress={ () => this.setState({ fetch: !this.state.fetch, cep: '' }) }>
											<Text style={styles.footer}> Endereço errado? </Text>
										</TouchableOpacity>
									</View>
								</Content>
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
		paddingHorizontal: 10
	},
	loginForm: {
		paddingVertical: 20
	},
	button: {
		marginVertical: 40,
		backgroundColor: colors.button.primary,
		// alignSelf: 'center'
	},
	label: {
		color: colors.text.primary,
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
		color: colors.text.footer,
		fontSize: 13.5,
		fontWeight: '600',
		textAlign: 'center',
		marginBottom: 60,
		// padding: 20
	},
	cep: {
		color: colors.text.primary,
		fontSize: 20,
		fontWeight: '600',
		textAlign: 'center',
		padding: 10
	},
	addressContainer: {
		// flex: 0.5,
		// width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	confirmAddress: {
		flex: 1,
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	inputText: {
		fontSize: 14,
		color: '#000',
		textAlign: 'right',
		fontWeight: '400'
	},
	label: {
		fontSize: 16,
		color: '#e60000',
		fontWeight: '700'
	},
	containerAddress: {
    backgroundColor: '#fff'
  },
  holder: {
    paddingHorizontal: 8
  },
  logoText: {
    fontSize: 18,
    marginVertical: 30
  },
}

const mapStateToProps = state => ({
	currentUser: state.authReducer.currentUser,
	address: state.authReducer.address,
	restaurant: state.restaurant.restaurantInfo
})

export default connect(mapStateToProps, { signUp, setAddress, setRestaurantInfo })(withNavigation(CEPScreen))
