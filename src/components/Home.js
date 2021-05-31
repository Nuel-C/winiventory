import React, { Component } from 'react'
import {Link} from 'react-router-dom'

export default class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            email: this.props.location.state.email,
            companyname: this.props.location.state.companyname,
            id: this.props.location.state.id,
            type: this.props.location.state.type,
        }
    }
    render() {
        return (
            <div>
                <Link className='nav-link' style={{color:'black'}} to={{
                                      pathname: '/'
                                      }}><strong>Login</strong></Link>
            </div>
        )
    }
}
