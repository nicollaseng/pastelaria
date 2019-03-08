import React from 'react'
import { View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import BottomNavigation, {
  IconTab,
  FullTab,
  Badge
} from 'react-native-material-bottom-navigation'
import { colors } from "../theme/global";
import { navTab } from "../utils/navTab"
import { Button } from 'native-base'
import { tabNavigator } from '../actions/Navigation'
import { connect } from 'react-redux'

class FooterView extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      activeTab: 'home',
      isActive: ''
    }
	}
	
	componentWillReceiveProps(nextProps){
		const { generalTab } = nextProps
		console.log('generaltab', generalTab)
		if(generalTab.length > 0){
			this.setState({ activeTab: this._renderTab(generalTab) })
		}
  }
  
  _renderTab = (tab) => {
    switch(tab){
      case 'orderDetail':
        return 'order'
      case 'payment':
        return 'chart'
      default:
        return tab
    }
  }


  renderIcon = icon => ({ isActive }) => (
    // <Button transparent style={styles.button}>
      <Icon size={24} color={isActive ? colors.icon.activated : colors.icon.deactivated} name={icon} />
    // </Button>
  )

  renderBadge = badgeCount => {
    return <Badge>{badgeCount}</Badge>
  }


  renderTab = ({ tab, isActive }) => {
    return (
      <FullTab
				onTabPress={() => {
					this.setState({ activeTab: tab.key })
					this.props.tabNavigator(tab.key)
				}}
        showBadge={tab.key === 'chat'}
        renderBadge={() => <Badge>2</Badge>}
        isActive={isActive}
        // key={this.state.activeTab}
        label={tab.label}
        renderIcon={this.renderIcon(tab.icon)}
        style={styles.bottom}
        labelStyle={ isActive ? colors.header.primary : '#fff' }
        // renderBadge={this.renderBadge(tab.badgeCount)}
      />
    )
	}
	
	tabChange = (newTab, oldTab) => {
		this.setState({ activeTab: newTab.key })
		return this.props.tabNavigator(newTab.key)
	}

  render() {
		console.log('ACTIVE TAB', this.state.activeTab)
    return (
        <BottomNavigation
					activeTab={this.state.activeTab}
					onTabPress={this.tabChange}
          renderTab={this.renderTab}
          tabs={navTab}
        />
    )
  }
}

const mapStateToProps = state => ({
	generalTab: state.navigation.tab,
	categorySelected: state.selectCategory.categorySelected
})

export default connect(mapStateToProps, { tabNavigator })(FooterView)

const styles = {
  bottom: {
    color: colors.header.primary,
  },
  button: {
    width: '90%',
    height: '90%',
    borderRadius: 17,  
    borderColor: colors.header.primary,
    borderWidth: 2
  }
}