import React, { Component } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
	AsyncStorage,
	SectionList,
	View
} from "react-native";

import { Container, Header, Content, List, ListItem } from 'native-base'

import SideBar from "./Sidebar";
import getSideBarItems from "./SidebarItems";
import {colors} from "../theme/global";
import FooterView from "./FooterView.js";
// import { onSignOut, isSignedIn } from "../services/auth.js";
import { connect } from "react-redux";
import { logOut } from "../actions/AuthAction.js";
import { withNavigation } from "react-navigation";

class Home extends Component {
	GetSectionListItem=(item)=>{
		Alert.alert(item)
}

_renderItem = item => {
	return (
		<View style={styles.item}>
			<Text>{item.title}</Text>
			<Text>{item.price}</Text>
		</View>
	)
}
  render() {
    console.log("props", this.props.tab);
    return (
			<View style={styles.container}>
      <SectionList
       sections={[
				 { title: 'Username Starts with A', data: [{title: 'Biscoito', price: 20}, {title: 'Abacaxi', price: 400}] },
         { title: 'Username Starts with A', data: [{title: 'Biscoito', price: 20}, {title: 'Abacaxi', price: 400}] },
         { title: 'Username Starts with A', data: [{title: 'Biscoito', price: 20}, {title: 'Abacaxi', price: 400}] },
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
  token: state.authReducer.loginToken,
  tab: state.navigation.tab
});

export default connect(
  mapStateToProps,
  { logOut }
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
	}

};
