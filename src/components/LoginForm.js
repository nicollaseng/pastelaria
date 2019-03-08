import React, { Component } from 'react'
import { 
		ImageBackground,
		TouchableOpacity,
		View,
		Image,
		Alert,
		KeyboardAvoidingView
	} from 'react-native'
import {
	 Content,
	 Form,
	 Item,
	 Input,
	 Label,
	 Button,
	 Text,
	 Icon,
	 Spinner } from 'native-base'
// import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { withNavigation } from 'react-navigation'
import { iphonex } from "../utils/iphonex"
import { logo, colors } from "../theme/global"
import * as firebase from 'firebase'

class LoginForm extends Component {

	constructor(props){
		super(props)
		this.state = {
			email: '',
			password: ''
		}
	}

	componentWillMount(){
		firebase.auth().onAuthStateChanged(user => {
			this.props.navigation.navigate('DashBoard')
		})
	}

	navigate = () => {
		this.props.navigation.navigate('CEP')
	}

	onClickFacebookButton = async () => {

		// TO DO - FACEBOOK LOGIN AND REGISTER AT FACEBOOK API

		// await LoginManager.logInWithReadPermissions(['public_profile'])
		// .then(async (response) => {
		// 	console.log('response',response)
    //   if(!response.error && !response.isCancelled) {
		// 		await AccessToken.getCurrentAccessToken()
		// 		.then(data => {
		// 			this.props.userInfo(data)
		// 			this.setState({ userInfo: data }, () => this.props.navigation.navigate('Register'))
		// 			console.log('autenticao de login', data)
		// 			.catch((error) => {
		// 				console.log('error no login', error)
    //         let msg = 'Não foi possível realizar o Login do Facebook. Por favor, tente mais tarde.';
    //         Alert.alert('Atenção', msg);
    //       });
    //     });
    //   }
		// })

		return; // Temporalily
	}

	login = () => {
		const { email, password } = this.state
		this.setState({ loading: true })
		try {
			firebase.auth().signInWithEmailAndPassword(email, password)
				.then(response => {
					console.log('successfully login', response)
					this.setState({ loading: false })
					this.props.navigation.navigate('DashBoard')
				})
				.catch(err => {
					Alert.alert('Ops :(','E-mail ou senha inválidos')
					console.log('Erro while login firebase', err)
					this.setState({ loading: false })
				})
		}	catch (err) {	
			Alert.alert('Ops :(','Algo de errado aconteceu. Tente novamente em alguns instantes')
			console.log('Error before login firebase', err)
		}
	}
	
	render(){
		if(this.state.loading){
			return <Spinner />
		} else {
			return (
				<View style={{ flex: 1 }}>
				<View style={styles.logoContainer}>
					<Image
						source={logo}
						style={styles.logo}
					/>
					</View>
					{/* FUTURE VERSIONS - FACBEBOOK LOGIN */}
					{/* <View style={{ paddingVertical: 10, paddingHorizontal: 10}}>
						<Button
							iconLeft
							block
							onPress={this.onClickFacebookButton}
							style={styles.facebookButton}>
						<Icon name="logo-facebook" />
						<Text style={styles.facebookText}>
							Entrar com Facebook
						</Text>
						</Button>
						</View> */}
					 <View contentContainerStyle={styles.container}>
						 <KeyboardAvoidingView>
								<Form style={styles.loginForm}>
									<Item inlineLabel>
										<Label style={styles.label}>Email</Label>
										<Input
										style={[ styles.input ]}
										onChangeText={(email) => this.setState({ email })}
										value={this.state.email}
										/>
									</Item>
									<Item inlineLabel >
										<Label style={styles.label}>Password</Label>
										<Input
										style={[ styles.input ]}
										onChangeText={(password) => this.setState({ password })}
										value={this.state.password}
										secureTextEntry
										/>
									</Item>
								</Form>
							</KeyboardAvoidingView>
							<Button block style={ styles.button } onPress={this.login}>
								<Text>Login</Text>
							</Button>
							<TouchableOpacity onPress={this.navigate}>
								<Text style={styles.footer}> Cadastre-se </Text>
							</TouchableOpacity>
					</View>
				</View>
			)
		}
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
		marginHorizontal: 20,
		backgroundColor: colors.button.primary
	},
	label: {
		color: colors.login.input,
		fontSize: 15,
		fontWeight: '700'
	},
	input: {
		color: '#000',
		fontSize: 13.5,
		fontWeight: '600'
	},
	footer: {
		color: colors.footer,
		fontSize: 13.5,
		fontWeight: '600',
		textDecorationLine: 'underline',
		textAlign: 'center',
		padding: 10
	},
	logo: {
    resizeMode: "contain",
    width: iphonex ? 240 : 200,
    marginTop: iphonex ? 30 : 0
  },
  logoContainer: {
    flex: 0.8,
    alignItems: "center",
    justifyContent: "center"
	},
	facebookButton: {
		paddingHorizontal: 10,
		backgroundColor: '#3c5a96',
	},
	facebookText: {
		marginHorizontal: 10,
		fontWeight: '700',
		textAlign: 'center',
		color: '#fff',
		fontSize: 16
	},
}

export default withNavigation(LoginForm)