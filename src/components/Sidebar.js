import React from "react";

import { TouchableOpacity, Text } from "react-native";

import {
  Container,
  View,
  Content,
  List,
  ListItem,
  Grid,
  Col,
  Label,
  Icon,
  Header,
  Body,
} from "native-base";

import PropTypes from "prop-types";
import IconAwesome from "react-native-vector-icons/FontAwesome5";
import { colors } from "../theme/global";
import { connect } from "react-redux"
import _ from "lodash"

_getInitialLetter = (name) => {
  if (name && name.length > 0){
    let nameSplit = _.split(name,' ', 2)
    let firstLetter = nameSplit[0][0]
    let secondLetter = nameSplit[1][0]
    let initials = `${firstLetter}${secondLetter}`
    return initials
  }
} 

const SideBar = props => (
  <Container style={{ backgroundColor: "#fefefe" }}>
  <Content>
    <View style={styles.container}>
        <View style={{ width: '15.7%', margin: 7}}>
          <TouchableOpacity style={styles.headerProfileButton}>
            <Text style={styles.headerProfileText}>{_getInitialLetter(props.currentUser.name)}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ margin: 7}}>
          <Text style={styles.headerText}>{props.currentUser.name}</Text>
          <Text style={[styles.headerText, { fontWeight: '200'}]}>{props.currentUser.email}</Text>
        </View>
    </View>
    <List
      dataArray={props.sideBarItems.filter(e => e != undefined)}
      renderRow={item => (
        <View>
          {item && (
            <ListItem icon noBorder onPress={item.action} style={styles.item}>
              <Grid>
                <Col style={{ alignItems: "flex-start", flex: 0.15 }}>
                  {item.useAwesome && (
                    <IconAwesome
                      size={24}
                      style={{ color: "#666666" }}
                      name={item.icon}
                    />
                  )}
                  {!item.useAwesome && (
                    <Icon
                      size={24}
                      style={{ color: "#666666" }}
                      name={item.icon}
                    />
                  )}
                </Col>
                <Col style={{ alignItems: "flex-start", flex: 0.85 }}>
                  <Body noBorder style={{ borderBottomWidth: 0 }}>
                    <Label style={{ color: "#666666" }}>{item.title}</Label>
                  </Body>
                </Col>
              </Grid>
            </ListItem>
          )}
        </View>
      )}
    />
    </Content>
  </Container>
);
 
const styles = {
  containerDrawer: {
    flex: 1,
    backgroundColor: colors.drawer.header
  },
  headerProfileText: {
    fontSize: 14,
    color: colors.header.primary,
    padding: 9,
    fontWeight: "500"
  },
  headerProfileButton: {
    borderRadius: 60,
    backgroundColor: colors.button.profile
  },
  headerImage: {
    height: 140
  },
  headerItem: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 18,
    backgroundColor: "transparent",
    marginLeft: 0
  },
  item: {
    marginTop: 16,
    backgroundColor: "transparent"
  },
  headerName: {
    color: "#565656",
    fontWeight: "bold"
  },
  headerEmail: {
    color: "#666666",
    fontSize: 16
  },
  headerCondominium: {
    color: "#777777",
    fontSize: 14
  },
  container: {
    flex: 0.5,
    backgroundColor: colors.drawer.header
  },
  header: {
    flex:1,
    backgroundColor: colors.header.primary
  },
  headerText: {
    color: colors.drawer.text,
    fontSize: 14,
    fontWeight: '600',
  }
}

SideBar.propTypes = {
  sideBarItems: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  currentUser: state.authReducer.currentUser
})

export default connect(mapStateToProps)(SideBar);
