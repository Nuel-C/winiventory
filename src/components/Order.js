import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export class Order extends Component {
    state = {
        email: this.props.location.state.email,
        companyname: this.props.location.state.companyname,
        seller: this.props.location.state.seller,
        id: this.props.location.state.id,
        items: [],
        type: this.props.location.state.type
    }

    componentDidMount() {
        fetch('/getitems', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                companyname: this.state.seller
            })
        })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            this.setState({
                items: [...this.state.items, ...data.items]
            })
        })
        .catch(err => console.log(err))
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
                                <Link className='nav-link' to='' onClick={this.logout}><button className='btn btn-danger' style={{borderRadius:'30px'}}>Log Out</button></Link>
                            </li>
                        </ul>
                    </div>
                </nav>

                <div className='container mt-4'>
                    <p className='badge badge-success px-5 mb-4' style={{ borderRadius: 20 }}>
                        <h5>
                            <i className='la la-check-circle'></i>
                            {' '}
                            {this.state.seller}
                        </h5>
                    </p>
                    <div className='row'>
                        {
                            this.state.items.map((item) => (
                                <div className='col-sm-4 mb-4'>
                                    <div className='card' style={{ boxShadow: '0px 10px 15px darkgrey' }}>
                                        <div className='card-body'>
                                            <h5 className='text-success' style={{ fontFamily: 'cursive' }}>{item.itemName}</h5>
                                            <hr />
                                            <div className='row' style={{ fontFamily: 'cursive' }}>
                                                <div className='col-sm-6'>
                                                    <p>Unit Price:</p>
                                                </div>
                                                <div className='col-sm-6'>
                                                    <p className='text-info'>{ 'N' + item.unitPrice }</p>
                                                </div>
                                            </div>
                                            <div className='row' style={{ fontFamily: 'cursive' }}>
                                                <div className='col-sm-6'>
                                                    <p>Units:</p>
                                                </div>
                                                <div className='col-sm-6'>
                                                    <p className='text-info'>{ item.units }</p>
                                                </div>
                                            </div>
                                            <div className='row' style={{ fontFamily: 'cursive' }}>
                                                <div className='col-sm-6'>
                                                    <p>Description:</p>
                                                </div>
                                                <div className='col-sm-6'>
                                                    <p className='text-info'>{ item.description }</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button className='btn btn-default mb-5 mx-5 purchase' style={{
                                            borderRadius: 20,
                                            fontFamily: 'cursive',
                                            boxShadow: '0px 5px 10px darkgrey',
                                            float: 'right'
                                        }}>Purchase</button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

            </div>
        )
    }
}

export default Order
