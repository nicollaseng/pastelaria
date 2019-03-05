import React, { Component } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  AsyncStorage
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
     <Container>
         <Content>
             <Text>Chart</Text>
         </Content>
     </Container>
    );
  }
}

const mapStateToProps = state => ({
  token: state.authReducer.loginToken,
  tab: state.navigation.tab
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
};
