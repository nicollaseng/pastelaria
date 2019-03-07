import React, { Component } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  AsyncStorage,
  View
} from "react-native";

import {
  Header,
  Body,
  Left,
  Right,
  Title,
  Drawer,
  Button,
  Container,
  Spinner,
  Content
} from "native-base";

import SideBar from "./Sidebar";
import getSideBarItems from "./SidebarItems";
import {colors} from "../theme/global";
import FooterView from "./FooterView.js";
// import { onSignOut, isSignedIn } from "../services/auth.js";
import { connect } from "react-redux";
import { logOut } from "../actions/AuthAction.js";
import { withNavigation } from "react-navigation";
import Icon from "react-native-vector-icons/FontAwesome";
import _ from "lodash"
import { setChart } from "../actions/ChartAction.js";

class Chart extends Component {

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

  _renderSubChart = () => {
    const { chart } = this.props
    if(chart && chart.length > 0){
      return (
        <View>
          <Text style={styles.addMore}> Adicionar mais items </Text>
        </View>
      )
    }
  }

  render() {
    console.log("props", this.props);
    return (
      <View style={styles.container}>
        <View style={styles.deliverContainer}>
          <Text style={styles.deliverText}>ENTREGAR EM: </Text>
          <Text style={styles.addressText}>{`${this.props.address.address}, ${this.props.address.addressNumber}`}</Text>
        </View>
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
  address: state.authReducer.currentUser
});

export default connect(
  mapStateToProps,
  { logOut, setChart }
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
    fontWeigth: '700',
    color: '#fff'
  },
  addressText: {
    fontSize: 14,
    fontWeigth: '500',
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
    fontWeigth: '700'
  },
  rightOrderText: {
    fontSize: 15, 
    color: '#000',
    fontWeigth: '500',
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
    fontWeigth: '400'
  },
  addMoreContainer: {
    
  }
};
