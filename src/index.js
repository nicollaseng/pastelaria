import React from 'react'
import Login from './screens/Login/LoginScreen'

class EntryPoint extends React.Component {
    static navigationOptions = {
        header: null,
    	};
    render(){
        return <Login />
    }
}

export default EntryPoint