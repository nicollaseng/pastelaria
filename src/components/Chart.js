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
  Input
} from "native-base";

import {colors} from "../theme/global";
import FooterView from "./FooterView.js";
// import { onSignOut, isSignedIn } from "../services/auth.js";
import { connect } from "react-redux";
import { logOut, updateUser } from "../actions/AuthAction.js";
import { withNavigation } from "react-navigation";
import Icon from "react-native-vector-icons/FontAwesome5";
import _ from "lodash"
import { setChart, setPayment } from "../actions/ChartAction.js";
import { tabNavigator } from "../actions/Navigation"
import { submitOrder, setOrder } from "../actions/OrderAction"
import uuid from 'uuid'
import moment from 'moment'
import * as firebase from 'firebase'
import { RESTAURANT, ONE_SIGNAL_ID } from 'react-native-dotenv'
import VMasker from 'vanilla-masker'
import { unMask, toMoney } from '../utils/mask'
import OneSignal from 'react-native-onesignal'; // Import package from node modules

class Chart extends Component {
  constructor(props){
    super(props)
    this.state = {
      totalPrice: 0,
      totalPriceWithDelivery: 0,
      couponCode: '',
      payment: false,
      allOrders: [],
      userDeviceId: '',
    }
  }

  componentWillMount(){
    const userId = this.props.customer.userId
    let userDeviceId;

    firebase.database().ref(`${RESTAURANT}/users/${userId}`).once('value', (snapshot) => {
      let allOrders = snapshot.val().orders
      console.log('willl mount', allOrders)
      this.setState({ allOrders })
    })

		OneSignal.init(ONE_SIGNAL_ID, {
			kOSSettingsKeyAutoPrompt: true,
		});
		OneSignal.getPermissionSubscriptionState( (status) => {
      userDeviceId =  status.userId;
      this.setState({ userDeviceId })
    });
  }

  componentWillReceiveProps(nextProps){
    let { chart } = nextProps
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
    let { chart } = this.props
    if(chart && chart.length > 0) {
      return chart.map(itemChart => {
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
                <TouchableOpacity onPress={() => this._deleteItem(itemChart)}>
                  <Icon name="trash" size={25} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      })
    } else {
      return (
        <Text style={styles.emptyChart}>Carrinho Vazio</Text>
      )
    }
  }

  _deleteItem = (param) => {
    let { chart } = this.props
    var newChart = _.clone(chart)
    if(newChart && newChart.length > 0) {
      let index = _.findIndex(newChart, e => e.item === param.item)
      console.log('index', index, newChart)
      if(index !== -1){
        _.pullAt(newChart, index)
        console.log('new chart', newChart)
        return this.props.setChart(newChart)
      }
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

  _renderSubChart = (fullPrice) => {
    const { chart } = this.props
    let price = VMasker.toMoney(fullPrice.toFixed(2))
    let taxaEntrega = parseFloat(unMask(this.props.taxDelivery).split(",").join(""))/100
    let finalPrice = VMasker.toMoney((parseFloat(fullPrice.toFixed(2)) + taxaEntrega))
    console.log(price, taxaEntrega, finalPrice, fullPrice.toFixed(2), fullPrice)
    if(chart && chart.length > 0){
      return (
        <View>
          <View>
            <TouchableOpacity onPress={() => this.props.tabNavigator('home')}>
              <Text style={styles.addMore}> Adicionar mais items </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.orderSubContainer}>
            <View style={styles.leftOrder}>
              <Text style={styles.leftOrderTextSubItemDescription}>Subtotal</Text>
              <Text style={styles.leftOrderTextSubItemDescription}>Taxa de Entrega</Text>
              <Text style={styles.leftOrderTotalText}>Total</Text>
            </View>
            <View style={styles.leftOrder}>
              <Text style={[styles.leftOrderTextSubItemDescription, { textAlign: 'right'}]}>R$ {price}</Text>
              <Text style={[styles.leftOrderTextSubItemDescription, { color: colors.text.free, textAlign:'right' }]}>
               R$ {VMasker.toMoney(taxaEntrega*100)}
              </Text>
              <Text style={[styles.leftOrderTotalText, { textAlign: 'right' }]}>R$ {finalPrice}</Text>
            </View>
          </View>
          <View style={styles.couponContainer}>
            <Icon name="ticket-alt" size={45} color="#a6a6a6" />
            <View style={styles.couponCodeContainer}>
              <Text style={[styles.leftOrderTextSubItemDescription, { fontSize: 18, fontWeight: '400', marginTop: 10 }]}>
                Cupom de desconto
              </Text>
              <Input
                style={styles.inputCoupon}
                value={this.state.couponCode}
                onChangeText={(couponCode) => this.setState({ couponCode })}
                placeholder="Insira um código"
                placeholderTextColor="#808080"
              />
            </View>
          </View>
          <View style={styles.paymentContainerMajor}>
            <Text style={styles.payment}>Pagamento</Text>
            <TouchableWithoutFeedback onPress={this.setPayment}>
              <View style={styles.paymentContainer}>
                <View>
                  <Text style={styles.paymentType}>Formas de pagamento</Text>
                  <Text style={styles.leftOrderTextSubItemDescription}>
                    {this.props.payment && this.props.payment.length > 0 ? this.props.payment : ''}
                  </Text>
                </View>
                <Text style={styles.paymentSelect}>
                  {this.props.payment && this.props.payment.length > 0 ? 'Trocar' : 'Escolher'}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <TouchableOpacity
            style={styles.finish}
            onPress={() => this.props.payment && this.props.payment.length > 0 ? this.submitOrder(fullPrice, taxaEntrega) : this.setPayment()}>
            <Text style={styles.finishText}>
              {this.props.payment && this.props.payment.length > 0 ? 'Finalizar' : 'Selecionar pagamento'}
            </Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  setPayment = () => {
    return this.props.tabNavigator('payment')
  }

  submitOrder = async (price, taxaEntrega) => {
    const { chart, customer } = this.props
    const { totalPrice, totalPriceWithDelivery, couponCode } = this.state
    const orderNumber = Math.floor(Math.random() * 10001)
    const orderId= uuid()
    const userId = this.props.customer.userId
    const order = {
      orderNumber,
      orderId,
      userId,
      userDeviceId: this.state.userDeviceId, //very important for one signal specifc user notification
      chart,
      totalPrice: price,
      itemsPrice: price,
      offPrice: 0,
      deliveryPrice: taxaEntrega,
      totalPriceWithDelivery: price,
      couponCode,
      customer,
      dateDay: moment().date(),
      dateMonth: moment().month().length === 1 ? `0${moment().month() + 1}` :moment().month()+1 ,
      createdAt: moment().format('DD/MM/YYYY HH:mm:ss'),
      updatedAt: moment().format('DD/MM/YYYY HH:mm:ss'),
      paymentMethod: this.props.payment,
      paymentChange: this.props.paymentChange === undefined ? '' : this.props.paymentChange,
      status: 'Realizado'
    }
    // order for details is only for order list at order's screen - sectionlist
    const orderForDetails = [
      {title: orderNumber, data: [order]}
    ]
    console.log('order to send', order)

    // first checks if restaurant is open or not if it is next set order 
    firebase.database().ref(`${RESTAURANT}/status`).on('value', data => {
      if(data.val() !== null){
        if(data.val()){
          if(couponCode.length > 0){
            //Check on server if coupon exist
            firebase.database().ref(`/${RESTAURANT}/voucher`).on('value', coupon => {
              if(coupon.val() !== null){
                let coupons = coupon.val()
                console.log('cupons', coupons)
                let couponExist = _.filter(coupons, e => e.voucherCode == couponCode.toLowerCase())
                if(couponExist.length > 0){
                  let today = moment(new Date()).format('DD/MM/YYYY')
                  let expiryDate = moment(couponExist[0].voucherExpiryDate, "DDMMYYYY")
                  let valid = expiryDate.diff(moment(today, "DDMMYYYY")) >= 0
                  console.log('valid', valid, couponExist[0].voucherQuantity)
                  if(valid === false ){

                    Alert.alert('Atenção', 'Infelizmente esse voucher já expirou')
                    return;
                  }
                  if(valid && couponExist[0].voucherQuantity === 'Única'){
                    // Check if user already used this voucher if voucher uniq
                    firebase.database().ref(`${RESTAURANT}/users/${userId}`).once('value', snapshot => {
                      if(snapshot.val() !== null){
                        let user = snapshot.val()
                        console.log('USER VOUCHER', user.voucher)
                        let userVoucher = _.filter(user.voucher, userVoucher => {
                          return userVoucher === couponCode
                        })
                        if(userVoucher.length > 0){
                          Alert.alert('Atenção', 'Parece que você já utilizou esse voucher no passado')
                        } else { //if user never used this voucher so proceed to finish chart
                          let offPrice = price
                          let voucherValue = parseFloat(couponExist[0].voucherPayment.split(",").join(""))/100
                          let finalPrice = couponExist[0].voucherType === 'Dinheiro' ? offPrice - voucherValue : offPrice - (voucherValue/100)*offPrice

                          console.log('price', offPrice, 'voucher value', voucherValue, finalPrice )

                          firebase.database().ref(`${RESTAURANT}/orders/${userId}/${orderId}`).set({
                            ...order,
                            totalPrice: finalPrice <= 0 ? 0 : finalPrice,
                            offPrice: couponExist[0].voucherType === 'Dinheiro' ? voucherValue : (voucherValue/100)*offPrice
                          })
                            .then(() => {
                              // let userVouchers = this.props.customer.voucher ? this.props.customer.voucher : []
                              firebase.database().ref(`${RESTAURANT}/users/${userId}`).update({
                                voucher: [...user.voucher, couponCode]
                              })
                                .then(() => {
                                  Alert.alert('Hmmmmm', 'Seu pedido foi realizado com sucesso! Acompanhe o status de seu pedido na aba Pedidos')
                                  console.log('Created Order with Sucess and set voucher code at user')
                                  
                                  this.props.submitOrder(order) // current order only
                                  this.props.setOrder(orderForDetails) // set all orders for order view section list
                                  this.props.setChart([]) // make empty chart again
                                  this.props.tabNavigator('order') //navigate to orders
                                  this.props.setPayment('', '') // refresh payment method at redux
                                })
                                .catch(err => console.log('error while updating user with voucher code', err))
                              })
                            .catch(error => {
                              Alert.alert('Ops :(', 'Algo de errado aconteceu. Tenta novamente!')
                              console.log('Error creating order at database: ', error)
                            })
                        }
                      }
                    })
                  } else if(valid && couponExist[0].voucherQuantity === 'Ilimitado'){ //proceeds if voucher not uniq
                    let offPrice = price
                    let voucherValue = parseFloat(couponExist[0].voucherPayment.split(",").join(""))/100
                    let finalPrice = couponExist[0].voucherType === 'Dinheiro' ? offPrice - voucherValue : offPrice - (voucherValue/100)*offPrice

                    console.log('price', offPrice, 'voucher value', voucherValue, finalPrice )

                    firebase.database().ref(`${RESTAURANT}/orders/${userId}/${orderId}`).set({
                      ...order,
                      totalPrice: finalPrice <= 0 ? 0 : finalPrice,
                      offPrice: couponExist[0].voucherType === 'Dinheiro' ? voucherValue : (voucherValue/100)*offPrice
                    })
                      .then(() => {
                          console.log('Created Order with Sucess')
                          Alert.alert('Hmmmmm', 'Seu pedido foi realizado com sucesso! Acompanhe o status de seu pedido na aba Pedidos')
                          this.props.submitOrder(order) // current order only
                          this.props.setOrder(orderForDetails) // set all orders for order view section list
                          this.props.setChart([]) // make empty chart again
                          this.props.tabNavigator('order') //navigate to orders
                          this.props.setPayment('', '') // refresh payment method at redux
                        })
                      .catch(error => {
                        Alert.alert('Ops :(', 'Algo de errado aconteceu. Tenta novamente!')
                        console.log('Error creating order at database: ', error)
                      })
                  }
                } else {
                  Alert.alert('Atenção:', 'Coupom inválido!')
                }
                console.log('coupon', coupons)
              }
            })
          } else { //there arent coupom code
            firebase.database().ref(`${RESTAURANT}/orders/${userId}/${orderId}`).set(order)
              .then(() => {
                  console.log('Created Order with Sucess')
                  Alert.alert('Hmmmmm', 'Seu pedido foi realizado com sucesso! Acompanhe o status de seu pedido na aba Pedidos')
                  this.props.submitOrder(order) // current order only
                  this.props.setOrder(orderForDetails) // set all orders for order view section list
                  this.props.setChart([]) // make empty chart again
                  this.props.tabNavigator('order') //navigate to orders
                  this.props.setPayment('', '') // refresh payment method at redux
                })
              .catch(error => {
                Alert.alert('Ops :(', 'Algo de errado aconteceu. Tenta novamente!')
                console.log('Error creating order at database: ', error)
              })
          }
          } else {
            Alert.alert('Atenção', 'estamos fechados no momento. Retorne no nosso horário de atendimento')
          }
      }
    })

    }

  render() {
    console.log("customer", this.props);
    const { chart } = this.props   
    let totalPrice = 0
    chart.map(itemChart => {
      totalPrice = parseFloat(totalPrice) + parseFloat(itemChart.itemPrice)
    })
    return (
      <View style={styles.container}>
        <View style={styles.deliverContainer}>
          <Text style={styles.deliverText}>ENTREGAR EM: </Text>
          <Text style={styles.addressText}>{`${this.props.address.address}, ${this.props.address.addressNumber}`}</Text>
        </View>
         <Content>
           {this._renderChart()}
           {this._renderSubChart(totalPrice)}
         </Content>
     </View>
    );
  }
}
const mapStateToProps = state => ({
  chart: state.chart.chart,
  address: state.authReducer.currentUser,
  taxDelivery: state.restaurant.restaurantInfo.taxaEntregaKm,
  customer: state.authReducer.currentUser,
  allOrders: state.authReducer.currentUser.orders,
  payment: state.chart.payment,
  paymentChange: state.chart.paymentChange,
  restaurant: state.restaurant.restaurantInfo
});

export default connect(
  mapStateToProps,
  { logOut, setChart, submitOrder, tabNavigator, setOrder, setPayment, updateUser }
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
    fontSize: 13.5,
    color: '#000',
    fontWeight: '400',
    paddingVertical: 1,
    textAlign: 'left'
  },
  paymentSelect: {
    fontSize: 13.5,
    color: colors.primary,
    fontWeight: '300',
    paddingVertical: 1,
    textAlign: 'right',
    marginRigth: 10,
  }
};
