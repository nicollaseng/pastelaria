import React, { Component } from 'react'
import { 
		ImageBackground,
		TouchableOpacity,
		View,
		Image
	} from 'react-native'
import {
	 Content,
	 Form,
	 Item,
	 Input,
	 Label,
	 Button,
	 Text,
	 Icon } from 'native-base'
import { withNavigation } from 'react-navigation'
import { iphonex } from "../utils/iphonex"
import { logo, colors } from "../theme/global"

class LoginForm extends Component {

	navigate = () => {
		this.props.navigation.navigate('CEP')
	}
	render(){
		return (
			<View style={{ flex: 1 }}>
			<View style={styles.logoContainer}>
				<Image
					source={logo}
					style={styles.logo}
				/>
        </View>
				<View style={{ paddingVertical: 10, paddingHorizontal: 10}}>
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
					</View>
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
					<TouchableOpacity onPress={this.navigate}>
						<Text style={styles.footer}> Cadastre-se </Text>
					</TouchableOpacity>
        </Content>
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
		paddingHorizontal: 20,
		marginBottom: 50
	},
	loginForm: {
		paddingVertical: 20
	},
	button: {
		paddingVertical: 20,
		backgroundColor: colors.button.primary
	},
	label: {
		color: colors.login.input,
		fontSize: 15,
		fontWeight: '700'
	},
	input: {
		color: colors.login.input,
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