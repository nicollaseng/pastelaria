import React, { Component } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
	AsyncStorage,
	SectionList,
	View,
	TouchableWithoutFeedback
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import _ from "lodash";

import { Container, Header, Content, List, ListItem, Radio } from 'native-base'

import SideBar from "./Sidebar";
import getSideBarItems from "./SidebarItems";
import {colors} from "../theme/global";
import FooterView from "./FooterView.js";
// import { onSignOut, isSignedIn } from "../services/auth.js";
import { connect } from "react-redux";
import { setChart } from "../actions/ChartAction.js";
import { withNavigation } from "react-navigation";
import Modal from "react-native-modal";

class Home extends Component {
	constructor(props){
		super(props)
		this.state = {
			visibleModal: false,
			modalItem: {},
			item: {
				sizeQuantity: 0
			},
			itemQuantity: 1,
			itemSizeDescription: '',
			itemIngredientDescription: [],
			itemFinalPrice: 0.0,
			finalPrice: 0,

			itemSize: [],
			itemIngredient: [],
			itemBag: []
		}
	}

	GetSectionListItem=(item)=>{
		Alert.alert(item)
	}

	setItem = (item) => {
		this.setState({ modalItem: item, visibleModal: true })
	}
	_renderItem = item => {
		return (
			<TouchableWithoutFeedback onPress={() => this.setItem(item)}>
				<View style={styles.item}>
					<Text style={styles.title}>{item.title}</Text>
					<Text>{item.description}</Text>
					<Text style={styles.price}>{item.price}</Text>
				</View>
			</TouchableWithoutFeedback>
		)
	}

	filterRadio = (param, index) => {
		let { itemIngredient, itemIngredientDescription } = this.state
		let indexFiltered = _.findIndex(itemIngredient, e => e === index)
		let itemDescriptionFiltered = _.findIndex(itemIngredientDescription, e => e === param.title)
		console.log('index filtered', indexFiltered)
		if(indexFiltered !== -1 && itemDescriptionFiltered !== -1){
			_.pullAt(itemIngredient, indexFiltered)
			_.pullAt(itemIngredientDescription, itemDescriptionFiltered)
			this.setState({ 
				itemIngredient: itemIngredient, 
				[`${param.title}Radio`]: !this.state[`${param.title}Radio`],
				itemFinalPrice: this.state.itemFinalPrice - param.price < 0 ? 0 : this.state.itemFinalPrice - param.price,
				itemIngredientDescription 
			 })
		} else {
			return this.setState({
				[`${param.title}Radio`]: !this.state[`${param.title}Radio`],
				itemIngredient: itemIngredient.length <= 3 ? [...itemIngredient, index] : [],
				itemFinalPrice: this.state.itemFinalPrice + param.price,
				itemIngredientDescription: [...this.state.itemIngredientDescription, param.title]
			})
		}
	}

	setRadio = (param, index, category) => {
		let { itemSize, itemIngredient, itemBag } = this.state
		console.log('aqui index', index, param)
		switch(category){
			case 'size':
				return this.setState({
					itemSize: itemSize.length === 0 ? [index] : [],
					itemSizeDescription: param.title,
					itemFinalPrice: itemSize.length === 0 ? this.state.itemFinalPrice + param.price : this.state.itemFinalPrice - param.price < 0 ? 0 : this.state.itemFinalPrice - param.price 
				})
			case 'ingredient':
				return this.filterRadio(param, index)
			case 'bag': 
			return this.setState({
				itemBag: itemBag.length === 0 ? [index] : [],
				itemFinalPrice: itemBag.length === 0 ? this.state.itemFinalPrice + param.price : this.state.itemFinalPrice - param.price < 0 ? 0 : this.state.itemFinalPrice - param.price 
			})
		}
	}

	_renderItemSizeModal = (item, index, category) => {
		console.log(category)
		return (
			<TouchableWithoutFeedback onPress={() => this.setRadio(item, index, category)}>
					<View style={[styles.item, { 	flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
						<View>
							<Text style={styles.title}>{item.title}</Text>
							<Text style={[styles.price, { marginVertical: 2 }]}>+{item.price}</Text>
						</View>
						<Radio
							color={"#ccc"}
							selectedColor={colors.primary}
							selected={this.state.itemSize[0] === index}
						/>
					</View>
			</TouchableWithoutFeedback>
		)
	}

	maximumReached = (param) => {
		Alert.alert('Ops', 'Só é possível selecionar três ingredientes extras')
		return this.setState({ itemIngredient: [], [`${param.title}Radio`]: false })
	}

	_renderItemIngredient = (item, index, category) => {
		console.log(category)
		return (
			<TouchableWithoutFeedback onPress={() => this.setRadio(item, index, category)}>
					<View style={[styles.item, { 	flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
						<View>
							<Text style={styles.title}>{item.title}</Text>
							<Text style={[styles.price, { marginVertical: 2 }]}>+{item.price}</Text>
						</View>
						<Radio
							color={"#ccc"}
							selectedColor={colors.primary}
							selected={ 
								this.state.itemIngredient.length <= 3 ? this.state[`${item.title}Radio`]
								: this.maximumReached(item)
						 }
						/>
					</View>
			</TouchableWithoutFeedback>
		)
	}

	_renderItemBag = (item, index, category) => {
		console.log(category)
		return (
			<TouchableWithoutFeedback onPress={() => this.setRadio(item, index, category)}>
					<View style={[styles.item, { 	flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
						<View>
							<Text style={styles.title}>{item.title}</Text>
							<Text style={[styles.price, { marginVertical: 2 }]}>+{item.price}</Text>
						</View>
						<Radio
							color={"#ccc"}
							selectedColor={colors.primary}
							selected={this.state.itemBag[0] === index}
						/>
					</View>
			</TouchableWithoutFeedback>
		)
	}

	_renderModalListSize = (param) => {
		return (
			<View style={styles.modalItemSize}>
				<Text style={styles.modalItemsOptions}>Escolha o tamanho</Text>
				<View style={styles.modalItemOptionsFooter}>
					<Text>{`${this.state.itemSize.length} de 1`}</Text>
					<Text style={styles.modalMandatory}>OBRIGATÓRIO</Text>
				</View>
			</View>
		)
	}

	_renderModalListExtra = (param) => {
		return (
			<View style={styles.modalItemSize}>
				<Text style={styles.modalItemsOptions}>Adicione mais ingredientes</Text>
				<View style={styles.modalItemOptionsFooter}>
					<Text>{`${this.state.itemIngredient.length} de 3`}</Text>
				</View>
			</View>
		)
	}

	_renderModalListBag = (param) => {
		return (
			<View style={styles.modalItemSize}>
				<Text style={styles.modalItemsOptions}>Embalagem</Text>
				<View style={styles.modalItemOptionsFooter}>
					<Text>{`${this.state.item.sizeQuantity} de 1`}</Text>
					<Text style={styles.modalMandatory}>OBRIGATÓRIO</Text>
				</View>
			</View>
		)
	}

	_renderModal = () => {
		const { modalItem } = this.state
		return (
			<View style={styles.modal}>
				<TouchableWithoutFeedback onPress={() => 
						this.setState({ 
							visibleModal: false, 	
							itemSize: [],
							itemIngredient: [],
							itemBag: []
						})
					}
					>
					<Icon 
						name="times"
						size={25}
						color={colors.primary}
						style={styles.icon}
					/>
				</TouchableWithoutFeedback>
				<Content>
					<Text style={styles.modalTitle}>DETALHES DO ITEM</Text>
					<View style={styles.modalContainer}>
						<Text style={[styles.title, { fontSize: 14.6, color: '#000'}]}>{modalItem.title}</Text>
						<Text>{modalItem.description}</Text>
						<Text style={[styles.price,{ marginVertical: 2 }]}>{modalItem.price}</Text>
					</View>
					<View style={{ flex: 0.4 }}>

						{/* tamanho */}

						<SectionList
							sections={[
								{title: '', data: [
									{title: 'Pequeno', description: 'O melhor pizza de mista', price: 4.9},
									{title: 'Médio', description: 'O melhor pizza de queijo', price: 8.2},
									{title: 'Grande', description: 'O melhor pizza de queijo', price: 22.4},
								]},
							]}
							renderSectionHeader={ ({section}) =>  this._renderModalListSize(section) }
							renderItem={ ({item, index}) => this._renderItemSizeModal(item, index, 'size') }
							keyExtractor={ (item, index) => index }
					/>

					{/* mais recheio */}

					<SectionList
						sections={[
							{title: '', data: [
								{title: 'Queijo', price: 4.9},
								{title: 'Presunto', price: 12.20},
								{title: 'Bacon', price: 12.30},
								{title: 'Salsicha', price: 12.40},
							]},
						]}
						renderSectionHeader={ ({section}) =>  this._renderModalListExtra(section) }
						renderItem={ ({item, index}) => this._renderItemIngredient(item, index, 'ingredient') }
						keyExtractor={ (item, index) => index }
					/>

					{/* embalagem */}

					<SectionList
						sections={[
							{title: '', data: [
								{title: 'Embalagem', price: 0.9},
							]},
						]}
						renderSectionHeader={ ({section}) =>  this._renderModalListBag(section) }
						renderItem={ ({item, index}) => this._renderItemBag(item, index, 'bag') }
						keyExtractor={ (item, index) => index }
					/>
					</View>
					<View style={styles.footer}>
						{/* inclusao de mais produtos */}
						<View style={styles.includeContainer}>
							<TouchableOpacity onPress={() => this.setState({ 
								itemQuantity: this.state.itemQuantity <= 1 ? 1 : this.state.itemQuantity - 1,
								}, () => this.setState({ finalPrice: this.state.itemFinalPrice * this.state.itemQuantity }))
							}>
								<Text style={styles.minus}>-</Text>
							</TouchableOpacity>
							<Text>{this.state.itemQuantity}</Text>
							<TouchableOpacity onPress={() => this.setState({ 
									itemQuantity: parseInt(this.state.itemQuantity) + 1
								}, () => this.setState({ finalPrice: this.state.itemFinalPrice * this.state.itemQuantity }))
							}>
								<Text style={styles.add}>+</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.addOrderContainer}>
							<TouchableOpacity onPress={this.setChart}>
								<View style={styles.addOrderSubContainer}>
									<Text style={styles.addText}>Adicionar</Text>
									<Text style={styles.addText}>R$ {this.state.itemQuantity > 1 ? this.state.finalPrice.toFixed(2) : this.state.itemFinalPrice.toFixed(2)}</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</Content>
			</View>
		)
	}

	setChart = () => {
		const { modalItem, itemIngredientDescription, itemSizeDescription, itemQuantity, finalPrice } = this.state
		let itemOrdered = {
			item: modalItem.title,
			itemIngredientDescription,
			itemSizeDescription,
			bag: true,
			itemQuantity,
			itemPrice: finalPrice
			// itemSize: 
		}
		console.log('itemOrdered', itemOrdered)
		this.props.setChart(itemOrdered)
	}
  render() {
    console.log("state", this.state.itemQuantity, 'props', this.props);
    return (
				<View style={styles.container}>
					<Modal isVisible={this.state.visibleModal}>
						{this._renderModal()}
					</Modal>
					<SectionList
					sections={[
						{title: 'Pizzas', data: [
							{title: 'Mista', description: 'O melhor pizza de mista', price: `a partir de R$ 14,90 `},
							{title: 'Queijo', description: 'O melhor pizza de queijo', price: `a partir de R$ 12,20 `},
						]},
						{title: 'Pasteis', data: [
							{title: 'Carne', description: 'O melhor pastel de carne', price: `a partir de R$ 7,90 `},
							{title: 'Frango', description: 'O melhor pastel de frango', price: `a partir de R$ 7,20 `},
						]},
						{title: 'Bebidas', data: [
							{title: 'Coca-cola lata 350ml', description: 'Mate sua sede', price: `R$ 5,90 `},
							{title: 'Coca-cola lata 2L', description: 'Mate sua sede', price: `R$ 11,90 `},
							{title: 'Fanta laranja lata 350ml', description: 'Mate sua sede', price: `R$ 4,90 `},
							{title: 'Fanta uva lata 350ml', description: 'Mate sua sede', price: `R$ 4,90 `},
							{title: 'Guaraná lata 350ml', description: 'Mate sua sede', price: `R$ 4,90 `},
						]},
					]}
					renderSectionHeader={ ({section}) => <Text style={styles.sectionHeaderTitle}> { section.title } </Text> }
					renderItem={ ({item}) => this._renderItem(item) }
					keyExtractor={ (item, index) => index }
				/>
			</View>
    );
  }
}

const mapStateToProps = state => ({
  chart: state.chart.chart
});

export default connect(
  mapStateToProps,
  { setChart }
)(withNavigation(Home));

const styles = {
  container: {
    flex: 1,
		backgroundColor: "#fff",
		justifyContent: "center",
  },
  header: {
    backgroundColor: colors.header.primary
	},
	sectionHeaderTitle:{
		fontSize : 15,
		color: '#000',
		fontWeight: '600',
		borderBottomColor: '#ccc',
		borderBottomWidth: 0.4,
		// marginVertical: 14,
		paddingVertical: 12.5,
		marginHorizontal: 10,
 	},
	SectionListItems:{
		fontSize : 16,
		padding: 6,
		color: '#000',
		backgroundColor : '#F5F5F5'
	},
	item: {
		padding: 10,
		marginHorizontal: 10,
		borderBottomColor: '#ccc',
		borderBottomWidth: 0.4
	},
	price: {
		marginVertical: 9.5
	},
	title: {
		fontWeight: '500'
	},
	modal: {
		flex: 1,
		backgroundColor: '#fff'
	},
	icon: {
		alignSelf: 'flex-end',
		margin: 9
	},
	modalTitle: {
		fontSize: 15.6,
		fontWeight: '500',
		textAlign: 'center',
		paddingBottom: 10,
		color: '#000'
	},
	modalContainer: {
		flex: 0.1,
		marginLeft: 10
	},
	modalItemSize: {
		// flex: 0.1,
		padding: 12,
		marginVertical: 10,
		backgroundColor: '#f2f2f2'
	},
	modalItemsOptions: {
		fontSize: 13.5,
		fontWeight: '500',
		color: '#8c8c8c'
	},
	modalMandatory: {
		backgroundColor: '#404040',
		color: '#fff',
		fontSize: 10,
		textAlign: 'right',
		marginRight: 5,
		padding: 3,
		fontWeight: '500',
		borderRadius: 4.5
	},
	modalItemOptionsFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	modalItemOptionsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	footer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 20,
		flex: 1,
		// width: '100%',
	},
	includeContainer: {
		// width: '50%',
		padding: 5,
		paddingHorizontal: 5,
		flex: 0.7,
		borderRadius: 5,
		borderColor: '#d9d9d9',
		borderWidth: 1.2,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	addOrderContainer: {
		backgroundColor: colors.primary,
		// width: '50%'
	},
	addOrderSubContainer: {
		padding: 10,
		borderRadius: 10,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	add: {
		fontSize: 20,
		padding: 3,
		color: colors.primary
	},
	minus: {
		fontSize: 20,
		padding: 3,
		color: colors.primary
	},
	addText: {
		color: '#fff',
		fontSize: 13.5,
		marginHorizontal: 3.5,
		fontWeight: '500',
	}
};
