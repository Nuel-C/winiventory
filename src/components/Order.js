import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export class Order extends Component {
    //company name here refers to the buyer
    state = {
        email: this.props.location.state.email,
        companyname: this.props.location.state.companyname,
        seller: this.props.location.state.seller,
        id: this.props.location.state.id,
        items: [],
        type: this.props.location.state.type,
        currentItem: {},
        unitMessage: ''
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

    purchase = (e, item) => {
        this.setState({
            currentItem: item
        })
    }

    submit = (e) => {
        let purchaseForm = document.getElementById("purchaseForm")
        let formData = new FormData(purchaseForm)
        let body = this.state.currentItem
        
        //Delete the fields not needed
        delete body._id
        delete body.date

        body['customerName'] = this.state.companyname
        body['status'] = 'Not yet approved'
        for (let key of formData.keys()) {
            body['Units'] = formData.get(key)
        }

        console.log(this.state.currentItem)

        console.log('bodyUnits', body.Units)
        console.log('currentItemUnits', this.state.currentItem.units)
        //check if the units entered exceeds the current units available
        if (body.Units > this.state.currentItem.units) {
            this.setState({
                unitMessage: 'Cannot exceed available units!'
            })
            setTimeout(() => {
                this.setState({
                    unitMessage: ''
                })
            }, 5000)
        } else {
            body.units = body.Units
            delete body.Units
            fetch('/add_purchase', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(body)
            })
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                if (data.message == 'Success!') {
                    this.setState({message: data.message})
                    setTimeout(() => {
                        this.setState({
                            message: ''
                        })
                    }, 5000)
                    
                } else {
                    this.setState({message: data.message})
                    setTimeout(() => {
                        this.setState({
                            message: ''
                        })
                    }, 5000)
                }
            })
            .catch(() => {
                console.log('Oops, an error occured!')
            })
        }

        
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
                                    pathname: '/purchases',
                                    state: {
                                        companyname: this.state.companyname,
                                        email: this.state.email,
                                        id: this.state.id,
                                        type: this.state.type
                                    }
                                }}><strong>Purchases</strong></Link>
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
                            { this.state.seller }
                        </h5>
                    </p>
                    <div className='row'>
                        {
                            this.state.items.map((item) => (
                                
                                item.units == 0 ? '' :
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
                                            <button className='btn btn-default mb-5 mx-5 purchase' data-toggle="modal" data-target="#purchaseModal" style={{
                                                borderRadius: 20,
                                                fontFamily: 'cursive',
                                                boxShadow: '0px 5px 10px darkgrey'
                                            }} onClick={ () =>this.purchase(this, item) } id='purchaseBtn'>
                                                <i className='la la-shopping-cart'></i>
                                                {' '}
                                                Purchase
                                            </button>
                                        </div>
                                    </div>
                                
                                
                            ))
                        }
                    </div>
                </div>

                {/* Modal */}
                <div class="modal fade" id="purchaseModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Purchase</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form className='mt-3' id='purchaseForm'>
                                    <span className='text-info'>{this.state.unitMessage}</span>
                                    <span style={{color:'green'}}>{this.state.message}</span>
                                    <span style={{color:'red'}}>{this.state.error}</span>
                                    <div className='form-group'>
                                        <input type="number" name="units" id="units" placeholder='Number of units you wish to purchase...' className='form-control' style={{
                                            borderRadius: 20
                                        }}/>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-success" onClick={ this.submit }>Purchase</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default Order
