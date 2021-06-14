import React, { Component } from 'react'
import {Link, Redirect} from 'react-router-dom'
import axios from 'axios'

export default class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            email: this.props.location.state.email,
            companyname: this.props.location.state.companyname,
            id: this.props.location.state.id,
            type: this.props.location.state.type,
            users: [],
            inventories: [],
            companies: [],
            logout:'',
        }
        this.logout = this.logout.bind(this)
    }

    componentDidMount() {
        fetch('list_users')
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            this.setState({
                users: data.users
            })
            console.log(data)
        })
        .catch((err) => {
            console.log(err)
        })

        fetch('/list_inventories')
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            this.setState({
                inventories: data.items
            })
            this.state.inventories.map((inventory) => {
                this.state.users.map((user) => {
                    if (inventory.companyName == user.companyname) {
                        this.setState({
                            companies: [...this.state.companies, inventory.companyName]
                        })
                    }
                })
            })
            console.log(data)
            console.log(this.state.companies)
        })
        .catch((err) => {
            console.log(err)
        })

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
                    <a className="navbar-brand" href='/'>Winventory</a>
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
                                    }}><strong>Dashboard</strong>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className='nav-link' to='' onClick={this.logout}><button className='btn btn-danger' style={{borderRadius:'30px'}}>Log Out</button></Link>
                            </li>
                        </ul>

                    </div>
                </nav>
            
                {
                    this.state.users.map((user) => (
                        <div className='container mt-3'>
                            <div className='row'>
                                <div className='col-9'>
                                    <p className='badge badge-success px-5' style={{ borderRadius: 20 }}>
                                        <h5>
                                            <i className='la la-check-circle'></i>
                                            {' '}
                                            {user.companyname}
                                        </h5>
                                    </p>
                                </div>
                                <div className='col-3'>
                                    <Link className='btn btn-default view' style={{
                                        borderRadius: 20,
                                        fontFamily: 'cursive',
                                        boxShadow: '0px 10px 20px darkgrey',
                                        float: 'right'
                                    }} to={{
                                        pathname: '/order',
                                        state: {
                                            email: this.state.email ? this.state.email : null,
                                            seller: user.companyname,
                                            companyname: this.state.companyname,
                                            id: this.state.id,
                                            type: this.state.type
                                        }
                                    }}>
                                        <i className='la la-eye'></i>
                                        {' '}
                                        View items
                                    </Link>
                                    <Link className='btn btn-default viewBtn' title='View items' style={{
                                        borderRadius: 20,
                                        fontFamily: 'cursive',
                                        boxShadow: '0px 10px 20px darkgrey',
                                        float: 'right'
                                    }} to={{
                                        pathname: '/order',
                                        state: {
                                            email: this.state.email ? this.state.email : null,
                                            companyname: this.state.companyname,
                                            seller: user.companyname,
                                            id: this.state.id,
                                            type: this.state.type
                                        }
                                    }}>
                                        <i className='la la-eye'></i>
                                    </Link>
                                </div>
                            </div>
                            
                            <div className='card mb-5' style={{
                                boxShadow: '0px 10px 20px darkgrey'
                            }}>
                                <div className='card-body'>

                                    <h5 className='text-success' style={{ fontFamily: 'cursive' }}>Items:</h5>
                                    {
                                        this.state.inventories.map((inventory) => (
                                            inventory.units == 0 ? '' :
                                            <ul className="list-group" style={{ fontFamily: 'cursive' }}>
                                                {inventory.companyName == user.companyname ? <li className="list-group-item list-group-item-action">{inventory.itemName}</li> : null}
                                            </ul>
                                        ))
                                    }
                                    
                                </div>
                            </div>
                        </div>
                        
                    ))
                }
                
            </div>
        )
    }
}
