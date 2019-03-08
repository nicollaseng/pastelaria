import React, { Component } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  AsyncStorage,
  View,
  Image,
  TouchableWithoutFeedback
} from "react-native";

import {
  Spinner,
  Content,
	Input,
	List,
	ListItem,
	Left,
	Right
} from "native-base";

import {colors} from "../theme/global";
import FooterView from "./FooterView.js";
// import { onSignOut, isSignedIn } from "../services/auth.js";
import { connect } from "react-redux";
import { logOut } from "../actions/AuthAction.js";
import { withNavigation } from "react-navigation";
import Icon from "react-native-vector-icons/FontAwesome5";
import _ from "lodash"
import { setChart, setPayment } from "../actions/ChartAction.js";
import { tabNavigator } from "../actions/Navigation"
import { submitOrder, setOrder } from "../actions/OrderAction"
import { payments } from "../utils/paymentMethods"
import { TextInputMask } from 'react-native-masked-text'
import Modal from 'react-native-modal'

class Payment extends Component {

  constructor(props){
    super(props)
    this.state = {
      totalPrice: 0,
      totalPriceWithDelivery: 0,
      couponCode: '',
			payment: false,
			paymentChange: '',
			
			//modal
			visibleModal: false
    }
  }

  _renderPayment = () => {
      return payments.map(payment => {
        return (
					<ListItem
						 selected
						 onPress={() => payment.method === 'Dinheiro' ? this._setChange(payment.method) : this._setPayment(payment.method)}
					>
							<Left>
									<Text>{payment.method}</Text>
							</Left>
							<Right>
									<Icon name={payment.icon} size={25} />
							</Right>
					</ListItem>
        )
      })
		}

	_setChange = (paymentMethod) => {
		this.setState({ visibleModal: true, paymentMethod })
	}
	
	_setPayment = (payment, paymentChange) => {
		this.props.setPayment(payment, paymentChange)
		return this.props.tabNavigator('chart')
	}

	_renderModal = () => {
			return (
				<View style={styles.modalContainer}>
					<View>
						<Text style={styles.moneyChange}> Troco para quanto?</Text>
						<Text style={styles.moneyChangeDescription}>
						 Insira o quanto irá pagar em dinheiro para que nosso entregador leve o seu troco
						</Text>
					</View>
					<View style={styles.moneyContainer}>
						<Text style={styles.money}>R$</Text>
						<TextInputMask
							type={'money'}
							value={this.state.paymentChange}
							onChangeText={paymentChange => {
								this.setState({
									paymentChange
								})
							}}
						/>
					</View>
					<View>
						<TouchableOpacity style={styles.finish} onPress={() => this._setPayment(this.state.paymentMethod, this.state.paymentChange)}>
							<Text style={styles.finishText}>Finalizar</Text>
						</TouchableOpacity> 
						<TouchableOpacity onPress={() => {
							this._setPayment(this.state.paymentMethod, null)
							this.setState({ visibleModal: false, paymentMethod: '' })
						}}>
							<Text style={styles.nonChangeText}>Não preciso de troco</Text>
						</TouchableOpacity> 
					</View>

				</View>
			)
		}

  render() {
    return (
      <View style={styles.container}>
				<Modal isVisible={this.state.visibleModal}>
					{this._renderModal()}
				</Modal>
        <Text style={styles.paymentType}>FORMAS DE PAGAMENTO</Text>
        <Text style={styles.paymentDescription}>Escolha uma das opções aceitas por este estabelecimento</Text>
        <Content>
            <View>
                <Text style={styles.deliverPaymentHeader}>Pague na entrega</Text>
            </View>
            <List>
                {this._renderPayment()}
            </List>
        </Content>
      </View>
    );
  }
}
const mapStateToProps = state => ({
	payment: state.chart.payment,
});

export default connect(
  mapStateToProps,
  { setPayment, tabNavigator }
)(withNavigation(Payment));

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  header: {
    backgroundColor: colors.header.primary
  },
  deliverContainer: {
    flex: 0.1,
    backgroundColor: colors.primary,
    padding: 10
  },
  deliverText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff'
  },
  addressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffd11a'
  },
  orderContainer: {
    flex: 1,
    marginVertical: 15
  },
  orderSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  leftOrder: {
    width: '45%',
    padding: 10
  },
  rightOrder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '45%',
    padding: 10
  },
  emptyChart: {
    textAlign: 'center',
    fontSize: 14,
    color: '#808080',
    padding: 30
  },
  leftOrderText: {
    fontSize: 15, 
    color: '#000',
    fontWeight: '300'
  },
  rightOrderText: {
    fontSize: 15, 
    color: '#000',
    fontWeight: '300',
    textAlign: 'center'
  },
  leftOrderTextSubItemDescription: {
    fontSize: 13,
    color: '#808080'
  },
  addMore: {
    color: colors.primary,
    fontSize: 14.5,
    textAlign: 'center',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    fontWeight: '400'
  },
  addMoreContainer: {
    
  },
  leftOrderTotalText: {
    fontSize: 18,
    padding: 8,
    color: '#000',
    fontWeight: '600'
  },
  couponContainer: {
    flex: 1,
    borderBottomWidth: 10,
    borderBottomColor: '#f2f2f2',
    borderTopWidth: 10,
    borderTopColor: '#f2f2f2',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  couponCodeContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  submitCoupon: {
    color: colors.primary,
    textAlign: 'center',
    padding: 5,
    fontSize: 14,
  },
  inputCoupon: {
    fontSize: 13,
    color: "#ccc"
  },
  finish: {
    marginVertical: 15,
    backgroundColor: colors.primary,
    marginHorizontal: 10,
    borderRadius: 2
  },
  finishText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: '500',
    padding: 10,
    textAlign: 'center'
  },
  paymentContainerMajor: {
    padding: 8
  },
  payment: {
    fontSize: 17.5,
    color: '#000',
    fontWeight: '500',
    paddingVertical: 10,
    textAlign: 'left'
  },
  paymentContainer: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
    borderTopColor: '#ccc',
    borderTopWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  paymentType: {
    fontSize: 14.5,
    color: '#000',
    fontWeight: '500',
    paddingVertical: 10,
    textAlign: 'center'
  },
  paymentDescription: {
    color: '#ccc',
    textAlign: 'center',
    paddingVertical: 3
  },
  deliverPaymentHeader: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
    paddingVertical: 10,
    textAlign: 'left',
    marginLeft: 6
	},
	modalContainer: {
		borderRadius: 5,
		flex: 0.6,
		backgroundColor: '#f2f2f2',
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	finish: {
    marginVertical: 15,
    backgroundColor: colors.primary,
    marginHorizontal: 10,
    borderRadius: 2
  },
  finishText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: '500',
    padding: 10,
    textAlign: 'center'
	},
	moneyContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	money: {
		fontSize: 18,
		fontWeight: '600',
		marginRight: 5,
		color: '#000'
		// marginVertical: 10
	},
	moneyChange: {
		fontSize: 15.5,
		fontWeight: '600',
		marginRight: 5,
		color: '#000',
		textAlign: 'center',
	},
	moneyChangeDescription: {
		fontSize: 14,
		fontWeight: '400',
		color: '#808080',
		textAlign: 'center',
		paddingVertical: 5,
	},
	nonChangeText: {
		color: '#808080',
		fontSize: 14,
		textAlign: 'center',
		paddingVertical: 6.5
	}
};
