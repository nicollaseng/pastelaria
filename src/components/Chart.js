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

  render() {
    console.log("props", this.props.tab);
    return (
      <View style={styles.container}>
        <View style={styles.deliverContainer}>
          <Text style={styles.deliverText}>ENTREGAR EM: </Text>
          <Text style={styles.addressText}>{`${this.props.address.address}, ${this.props.address.addressNumber}`}</Text>
        </View>
         <Content>
           <
             <Text>Carrinho Vazio</Text>
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
  }
};
