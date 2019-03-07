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
  Icon,
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

class Chart extends Component {

  _renderChart = () => {
    const { chart } = this.props
    if(chart && Object.keys(chart).length > 0) {
      return (
        <View style={styles.orderContainer}>
          <View style={styles.orderSubContainer}>
            <View style={styles.leftOrder}>
              <Text style={styles.leftOrderText}>
                {this.props.chart.itemQuantity}x {this.props.chart.item}
              </Text>
              {this._renderSubItems(chart)}
            </View>
            <View style={styles.rightOrder}>
              <Text style={styles.rightOrderText}>
                R$ {this.props.chart.itemPrice}
              </Text>
            </View>
          </View>
        </View>
      )
    } else {
      return (
        <Text style={styles.emptyChart}>Carrinho Vazio</Text>
      )
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
  { logOut }
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
  }
};
