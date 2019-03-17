import React, { Component } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  AsyncStorage,
  View,
  Image,
  Linking,
  Platform
} from "react-native";

import {
  Spinner,
  Content,
  Input
} from "native-base";

import {colors} from "../theme/global";
import { connect } from "react-redux";
import { logOut } from "../actions/AuthAction.js";
import { withNavigation } from "react-navigation";
import _ from "lodash"
import { setChart } from "../actions/ChartAction.js";
import { tabNavigator } from "../actions/Navigation"
import { submitOrder, setOrder, setRating } from "../actions/OrderAction"
import { Rating, AirbnbRating } from 'react-native-ratings';
import Modal from 'react-native-modal';
import { unMask, toMoney } from '../utils/mask'
import * as firebase from 'firebase'
import { RESTAURANT } from 'react-native-dotenv'
import call from 'react-native-phone-call'


class Chart extends Component {

  constructor(props){
    super(props)
    this.state = {
      totalPrice: 0,
      totalPriceWithDelivery: 0,
			couponCode: '',
			
			// deliver status
			deliverStatus: true,
			
			//Modal
			visibleModal: false,

			// rating
			rating: '',
			rated: true
    }
  }

  componentWillMount(){
    let { order } = this.props
    firebase.database().ref(`${RESTAURANT}/orders/${order.userId}/${order.orderId}`).on('value', (data) => {
      console.log('atualizacao do pedido', data.val())
      let status = data.val().status
      this.setState({ orderStatus: status })
    })
  }

  componentWillReceiveProps(nextProps){
    let { chart } = nextProps
    let totalPriceArray = []
    let totalPrice = 0
    if(chart && chart.length > 0) {
      return chart.map(itemChart => totalPrice = totalPrice + parseFloat(itemChart.itemPrice))
        
        // this.setState({ totalPrice: parseFloat(this.state.totalPrice) + parseFloat(itemChart.itemPrice)},
          // () => this.setState({ totalPriceWithDelivery: parseFloat(this.state.totalPrice) + 0})
          //at this moment we should sum with Frete. Waiting for customer business estrategy for frete
      }
      console.log('total price', totalPrice)
      this.setState({totalPrice})
    }

  _renderChart = () => {
    let { order } = this.props
    console.log('order', order)
    if(order && Object.keys(order).length > 0) {
      return order.chart.map(itemChart => {
        return (
          <View style={styles.orderContainer}>
            <View style={styles.orderSubContainer}>
              <View style={styles.leftOrder}>
                <Text style={styles.leftOrderText}>
                  {itemChart.itemQuantity}x {itemChart.item}
                </Text>
                {this._renderSubItems(itemChart)}
              </View>
              <View style={styles.rightOrder}>
                <Text style={styles.rightOrderText}>
                  R$ {itemChart.itemPrice}
                </Text>
              </View>
            </View>
          </View>
        )
      })
    }
  }

  _renderSubItems = (param) => {
    if(param.itemIngredientDescription && param.itemIngredientDescription.length > 0){
      return param.itemIngredientDescription.map(itemExtraDescription => {
        return (
          <Text style={styles.leftOrderTextSubItemDescription}>- {itemExtraDescription}</Text>
        )
      })
    }
  }

  _renderSubChart = () => {
    const { order } = this.props
    let taxaEntrega = toMoney(unMask(parseFloat(this.props.address.deliveryTax)*100))
    let finalPrice = toMoney(unMask((parseFloat(order.totalPrice.toFixed(2)) + parseFloat(this.props.address.deliveryTax))))
    if(order && Object.keys(order).length > 0){
      return (
        <View>
          <View style={styles.orderSubContainer}>
            <View style={styles.leftOrder}>
              <Text style={styles.leftOrderTextSubItemDescription}>Subtotal</Text>
              <Text style={styles.leftOrderTextSubItemDescription}>Taxa de Entrega</Text>
              <Text style={styles.leftOrderTotalText}>Total</Text>
            </View>
            <View style={styles.leftOrder}>
              <Text style={[styles.leftOrderTextSubItemDescription, { textAlign: 'right'}]}>R$ {toMoney(unMask(order.totalPrice.toFixed(2)))}</Text>
              <Text style={[styles.leftOrderTextSubItemDescription, { color: colors.text.free, textAlign:'right' }]}>R$ {taxaEntrega}</Text>
              <Text style={[styles.leftOrderTotalText, { textAlign: 'right' }]}>R$ {finalPrice}</Text>
            </View>
          </View>
          <View style={styles.couponContainer}>
						<Text style={[styles.leftOrderTextSubItemDescription, styles.address]}>
							Endereço de entrega
						</Text>
						{/* <Text style={styles.leftOrderTextSubItemDescription}>{order.customer.address}, {order.customer.addressNumber}</Text>
						<Text style={styles.leftOrderTextSubItemDescription}>{order.customer.neighborhood} - {order.customer.city}</Text> */}
						<Text style={[styles.leftOrderTextSubItemDescription, { marginLeft: 9 }]}>Rua érico mota, 489</Text>
						<Text style={[styles.leftOrderTextSubItemDescription, { marginLeft: 9 }]}>Centro - Fortaleza</Text>
        	</View>
          <View style={styles.orderFurtherDetails}>
						<Text style={[styles.leftOrderTextSubItemDescription, styles.address]}>
							Mais informações
						</Text>
						<View style={styles.detailOrderContainer}>
							<View>
								<Text style={styles.leftOrderTextSubItemDescription}>No. Pedido</Text>
								<Text style={styles.leftOrderTextSubItemDescription}>Data do Pedido</Text>
								<Text style={styles.leftOrderTextSubItemDescription}>Dinheiro</Text>
							</View>
							<View>
								<Text style={[styles.leftOrderTextSubItemDescription, { textAlign: 'right'}]}>#{order.orderNumber}</Text>
								<Text style={[styles.leftOrderTextSubItemDescription, { textAlign: 'right'}]}>{order.date}</Text>
								<Text style={[styles.leftOrderTextSubItemDescription, { textAlign: 'right'}]}>Troco para R$ {order.totalPriceWithDelivery.toFixed(2)}</Text>
							</View>
						</View>
        </View>
				<View style={styles.orderFurtherDetails}>
					<Text style={[styles.leftOrderTextSubItemDescription, styles.address]}>
						Andamento do pedido
					</Text>
					<View style={styles.detailOrderContainer}>
						<View>
							<Text style={styles.leftOrderTextSubItemDescription}>Status</Text>
						</View>
						<View>
							<Text style={[styles.leftOrderTextSubItemDescription, { textAlign: 'right'}]}>{this.state.orderStatus}</Text>
						</View>
					</View>
        </View>
        {this.state.orderStatus === 'Concluído' ? (
          <TouchableOpacity onPress={() => this.setState({ visibleModal: true })}>
            <Text style={styles.evaluate}> Avaliar </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.finish}
            onPress={this.contact}>
            <Text style={styles.finishText}>
              Entrar em contato
            </Text>
        </TouchableOpacity>
        )}
			</View>
      )
    }
  }
  
  contact = () => {
    const { restaurant } = this.props
    // let phoneNumber;
    // if (Platform.OS !== 'android') {
    //   phoneNumber = `telprompt:${restaurant.telefone}`;
    // } else  {
    //   phoneNumber = `tel:${restaurant.telefone}`;
    // }
    // return Linking.openURL(`tel:${phoneNumber}`)


    const args = {
      number: restaurant.telefone, // String value with the number to call
      prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
    }
    return call(args).catch(console.error)
  }
	
	_renderModal = () => {
		const { rated } = this.state
		if(rated){
			return (
				<View style={styles.modalContainer}>
					<Text style={styles.ratingText}> Avalie esta entrega</Text>
					<Rating
						type='star'
						ratingCount={5}
						imageSize={40}
						showRating
						onFinishRating={this.ratingCompleted}
					/>
					<TouchableOpacity style={styles.finish} onPress={this._setOrderRating}>
            <Text style={styles.finishText}>Finalizar</Text>
          </TouchableOpacity>
				</View>
			)
		} else {
			return (
				<Text style={styles.rated}> Obrigado por sua avaliação. </Text>
			)
		}
	}

	_valueChanged(rating) {
		console.log('rating', rating)
    this.setState({ rating })
	}
	
	_setOrderRating = () => {
		let rating = [
			...this.props.rating,
			{
				order: this.props.order.orderNumber,
				rating: this.state.rating
			}
		]
		this.props.setRating(rating)
		return this.setState({ visibleModal: false, rating: '' })
	}

  render() {
    console.log('props do order detail', this.props )
    return (
      <View style={styles.container}>
				<Modal isVisible={this.state.visibleModal}>
					{this._renderModal()}
				</Modal>
        {/* <View style={styles.deliverContainer}>
          <Text style={styles.deliverText}>ENTREGAR EM: </Text>
          <Text style={styles.addressText}>{`${this.props.address.address}, ${this.props.address.addressNumber}`}</Text>
        </View> */}
         <Content>
           {this._renderChart()}
           {this._renderSubChart()}
         </Content>
     </View>
    );
  }
}
const mapStateToProps = state => ({
  chart: state.chart.chart,
  address: state.authReducer.currentUser,
  customer: state.authReducer.currentUser,
	allOrders: state.order.allOrders,
	order: state.navigation.data,
  rating: state.order.rating,
  restaurant: state.restaurant.restaurantInfo
});

export default connect(
  mapStateToProps,
  { logOut, setChart, submitOrder, tabNavigator, setRating }
)(withNavigation(Chart));

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
		paddingVertical: 10,
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
	address: { 
		fontSize: 18,
		fontWeight: '400',
		color: '#000',
		textAlign: 'left',
		// padding: 5,
		marginLeft: 9
	},
	detailOrderContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 10,
	},
	orderFurtherDetails: {
		flex: 1,
    borderBottomWidth: 10,
		borderBottomColor: '#f2f2f2',
		paddingVertical: 10,
	},
	evaluate: {
		textAlign: 'center',
		color: colors.primary,
		padding: 15,
		fontSize: 15,
		fontWeight: '400'
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
	modalContainer: {
		flex: 0.8,
		backgroundColor: '#fff',
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	rated: {
		color: colors.primary,
		fontSize: 22,
		fontWeight: '500',
		textAlign: 'center',
		padding: 20
	},
	ratingText: {
		fontSize: 22,
		fontWeight: '600',
		color: colors.primary,
		padding: 10,
		textAlign: 'center'
	}
};
