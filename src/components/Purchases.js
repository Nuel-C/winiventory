import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'

export class Purchases extends Component {
    //company name here refers to the buyer
    state = {
        email: this.props.location.state.email,
        companyname: this.props.location.state.companyname,
        seller: this.props.location.state.seller,
        id: this.props.location.state.id,
        items: [],
        type: this.props.location.state.type,
        currentItem: {}
    }

    componentDidMount() {
        fetch(`/list_purchases/${this.state.companyname}`)
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            console.log(data)
            let purchasesTable = document.getElementById('purchasesTable')
            let content = ''
            let reverse = []
            data.purchases.map((purchase) => {
                 reverse.push(purchase)
            })
            reverse.reverse()
            reverse.map((purchase) => {
                 content = `<tr>
                                <td>${ purchase.itemName }</td>
                                <td>${ purchase.companyName }</td>
                                <td>${ purchase.description }</td>
                                <td>${ purchase.unitPrice }</td>
                                <td>${ purchase.units }</td>
                                <td>${ new Date(purchase.date).toISOString().substr(0, 10) }</td>
                            </tr>`
                purchasesTable.innerHTML += content
            })
        })
        .catch((err) => {
            console.log(err)
        })
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
                                    pathname: '/home',
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
                               <Link className='nav-link' style={{color:'black'}} to={{
                                    pathname: '/home',
                                    state: {
                                        companyname: this.state.companyname,
                                        email: this.state.email,
                                        id: this.state.id,
                                        type: this.state.type
                                    }
                                }}><strong>Order</strong></Link>
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
                                <th>Company Name</th>
                                <th>Description</th>
                                <th>Unit Price</th>
                                <th>Units</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody id="purchasesTable">
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

export default Purchases
