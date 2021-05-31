import React, { Component } from 'react'
import {Link, Redirect} from 'react-router-dom'
import axios from 'axios'

export default class Sales extends Component {
    constructor(props){
        super(props)
        this.state = {
            companyname: this.props.location.state.companyname,
            email: this.props.location.state.email,
            id: this.props.location.state.id,
            type:this.props.location.state.type,
            logout:'',
        }
        this.logout = this.logout.bind(this)
    }

    logout(){
        var url = '/logout'
        axios.get(url)
        .then(res => this.setState({logout: res.data}))
        .catch(error => this.setState({logout: false}))
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-md navbar-light bg-light" style={{textAlign:'center'}}>
                <a className="navbar-brand" href='/'>Winnieventory</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">

                        <li className="nav-item">
                           <Link className='nav-link' style={{color:'black'}} to={{
                                      pathname: '/dashboard',
                                      state: {
                                          companyname: this.state.companyname,
                                          email: this.state.email,
                                          id: this.state.id,
                                          type: this.state.type
                                      }
                                      }}><strong>Dashboard</strong></Link>
                        </li>

                        <li className="nav-item">
                           <Link className='nav-link' style={{color:'black'}} to={{
                                      pathname: '/inventory',
                                      state: {
                                          companyname: this.state.companyname,
                                          email: this.state.email,
                                          id: this.state.id,
                                          type: this.state.type
                                      }
                                      }}><strong>Inventory</strong></Link>
                        </li>

                        <li className="nav-item">
                            <Link className='nav-link' to='' onClick={this.logout}><button className='btn btn-danger' style={{borderRadius:'30px'}}>Log Out</button></Link>
                        </li>
                    </ul>

                </div>
            </nav>
            {
               this.state.logout === true ? <Redirect to='/'/> : null
            }
            </div>
        )
    }
}
