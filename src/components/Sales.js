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

    componentDidMount() {
        fetch(`/list_sales/${this.state.companyname}`)
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            let salesTable = document.getElementById('salesTable')
            let content = ''
            let reverse = []
            data.sales.map((sale) => {
                 reverse.push(sale)
            })
            reverse.reverse()
            reverse.map((sale) => {
                 content = `<tr>
                                <td>${ sale.item }</td>
                                <td>${ sale.customer }</td>
                                <td>${ sale.phone }</td>
                                <td>${ sale.units }</td>
                                <td>${ sale.discount }</td>
                                <td>${ new Date(sale.date).toISOString().substr(0, 10) }</td>
                            </tr>`
                salesTable.innerHTML += content
            })
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
                <div className="table-responsive container mt-5">
                    <table className="table table-hover" style={{ whiteSpace: 'nowrap' }}>
                        <thead className="thead thead-dark">
                            <tr>
                                <th>Item</th>
                                <th>Customer</th>
                                <th>Phone Number</th>
                                <th>Units</th>
                                <th>Discount</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody id="salesTable">
                        </tbody>
                    </table>
                </div>
            {
               this.state.logout === true ? <Redirect to='/'/> : null
            }
            </div>
        )
    }
}
