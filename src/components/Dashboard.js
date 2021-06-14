import React, { Component } from 'react'
import {Link, Redirect} from 'react-router-dom'
import axios from 'axios'


export default class Dashboard extends Component {
    constructor(props){
        super(props)
        this.state = {
            email: this.props.location.state.email,
            companyname: this.props.location.state.companyname,
            id: this.props.location.state.id,
            type: this.props.location.state.type,
            logout: '',
            item: '',
            itemsApiData: [],
            customer: '',
            purchases: [],
            currentItem: {}
            
        }
        this.logout = this.logout.bind(this)
        this.submit = this.submit.bind(this)
        this.changeCustomer = this.changeCustomer.bind(this)
    }

    componentDidMount() {
        let itemsApiData
        this.setState({
            email: this.props.location.state.email,
            companyname: this.props.location.state.companyname,
            id: this.props.location.state.id,
            type: this.props.location.state.type,
        })
        var post = {
            companyname: this.state.companyname
        }
        var url = '/getitems'
        axios.post(url, post)
        .then((res)=>{
            console.log(res.data)
            itemsApiData = res.data
            this.setState({
                email: this.props.location.state.email,
                companyname: this.props.location.state.companyname,
                id: this.props.location.state.id,
                type: this.props.location.state.type,
                itemsApiData: itemsApiData.items
            })
        })
        .catch(err => console.log(err))
        
        fetch('/list_purchases', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({companyname: this.state.companyname})
        })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            data.purchases.map((purchase) => {
                if (purchase.status == 'Not yet approved') {
                    this.setState({
                        purchases: [...this.state.purchases,purchase]
                    })
                }
            })
            console.log(this.state.purchases)
        })
        .catch(err => console.log(err))
    }

    setCurrentItem = (e, item) => {
        this.setState({
            currentItem: item
        })
    }

    approve = (e) => {
        let approvalForm = document.getElementById("approvalForm")
        let formData = new FormData(approvalForm)
        let sale = {} //Object for adding sales
        for (let key of formData.keys()) {
            sale[key] = formData.get(key)
        }
        sale.item = this.state.currentItem.itemName
        sale.units = this.state.currentItem.units
        sale.unitPrice = this.state.currentItem.unitPrice
        sale.companyname = this.state.currentItem.companyName
        sale.customer = this.state.currentItem.customerName
        fetch(`/add_sale/${ this.state.companyname }`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(sale)
        })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            console.log(data)
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

        let edit = {} //Object for editing inventory
        edit.itemName = this.state.currentItem.itemName
        edit.units = this.state.currentItem.units
        edit.unitPrice = this.state.currentItem.unitPrice
        edit.companyname = this.state.currentItem.companyName
        edit.description = this.state.currentItem.description

        fetch(`/edit_inventory/${edit.itemName}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(edit)
        })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            console.log(data)
        })
        .catch(err => console.log(err))

        fetch(`/edit_purchase/${this.state.currentItem.customerName}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            }
        })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            console.log(data)
        })
        .catch(err => console.log(err))
        
        this.setState({
            purchases: this.state.purchases.filter((purchase) => {
                return purchase.itemName !== this.state.currentItem.itemName
            })
        })

    }

    submit = (e) => {
        e.preventDefault()
        let saleTable = document.getElementById("saleTable")
        let formData = new FormData(saleTable)
        let body = {}
        for (let key of formData.keys()) {
            body[key] = formData.get(key)
        }
        fetch(`/add_sale/${ this.state.companyname }`, {
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
            console.log(data)
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

        body.companyname = this.state.companyname
        fetch(`/edit_inventory/${body.item}`, {
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
            console.log(data)
        })
    }

    changeCustomer = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    logout(){
        var url = '/logout'
        axios.get(url)
        .then(res => this.setState({logout: res.data, email:'', companyname:''}))
        .catch(error => this.setState({logout: false}))
    }

    render() {
        if(this.state.type === 'Seller'){
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
                               <Link className='nav-link' style={{color:'black'}} to={{
                                          pathname: '/sales',
                                          state: {
                                              companyname: this.state.companyname,
                                              email: this.state.email,
                                              id: this.state.id,
                                              type: this.state.type
                                          }
                                          }}><strong>Sales</strong></Link>
                            </li>
    
                            <li className="nav-item">
                                <Link className='nav-link' to='' onClick={this.logout}><button className='btn btn-danger' style={{borderRadius:'30px'}}>Log Out</button></Link>
                            </li>
                        </ul>
    
                    </div>
                </nav>
    
                <div className='container' style={{marginTop: '5%'}}>
                      <h2 style={{textAlign:'center'}}>Initialize Sale</h2><br/>
                      <div className='form-div'>
                      <span style={{color:'green'}}>{this.state.message}</span>
                      <span style={{ color: 'red' }}>{this.state.error}</span>
                          <form onSubmit={this.submit} id="saleTable">
                          Item:
                          <select required onChange = {this.changeItem} name="item" id="item" style={{width:'100%', borderRadius:'30px'}} className = 'form-control form-group'>
                                <option value="">-- Choose Session --</option>
                                {this.state.itemsApiData.map((item) => (
                                    <option value={item.itemName} key={ item._id }>{ item.itemName }</option>
                                )) }
                          </select>
                           Customer:
                          <input required style={{width:'100%', borderRadius:'30px'}} type = 'text'
                            placeholder = 'Customer'
                            onChange = {this.changeCustomer}
                            value={this.state.customer}
                            name='customer'
                            className = 'form-control form-group'
                          />
                          Phone Number:
                          <input required style={{width:'100%', borderRadius:'30px'}} type = 'number'
                            placeholder = 'Phone Number'
                            onChange = {this.changePhone}
                            value={this.state.phone}
                            name='phone'
                            className = 'form-control form-group'
                          />
                          Units:
                          <input required style={{width:'100%', borderRadius:'30px'}} type = 'number'
                            placeholder = 'Units'
                            onChange = {this.changeUnit}
                            value={this.state.units}
                            name='units'
                            className = 'form-control form-group'
                          />
                                
                          Discount:
                          <input style={{width:'100%', borderRadius:'30px'}} type = 'number'
                            placeholder = 'Discount'
                            onChange = {this.changeDiscount}
                            value={this.state.discount}
                            name='discount'
                            className = 'form-control form-group'
                          />
                          <input 
                            type = 'submit'
                            className = 'btn btn-danger btn-block'
                            value = 'submit'
                          />
                          </form><br/>
                          <div style={{textAlign:'center'}}>
                          </div>
                      </div>
                    </div>

                    {
                        this.state.purchases.length == 0 ? <div></div> :
                            <div className='container mt-3'>
                                <p className='bg-info w-50 ml-auto mr-auto text-light text-center py-1' style={{
                                    borderRadius: '20px'
                                }}>Approvals</p>
                            </div>
                    }
                    
                    

                    <div className='container mt-5'>
                        <div className='row'>
                            {
                                this.state.purchases.map((purchase) => (
                                    <div className='col-sm-4 mb-4'>
                                        <div className='card' style={{ boxShadow: '0px 10px 15px darkgrey' }}>
                                            <div className='card-body'>
                                                <h5 className='text-success' style={{ fontFamily: 'cursive' }}>{purchase.itemName}</h5>
                                                <hr />
                                                <div className='row' style={{ fontFamily: 'cursive' }}>
                                                    <div className='col-sm-6'>
                                                        <p>Unit Price:</p>
                                                    </div>
                                                    <div className='col-sm-6'>
                                                        <p className='text-info'>{ 'N' + purchase.unitPrice }</p>
                                                    </div>
                                                </div>
                                                <div className='row' style={{ fontFamily: 'cursive' }}>
                                                    <div className='col-sm-6'>
                                                        <p>Units:</p>
                                                    </div>
                                                    <div className='col-sm-6'>
                                                        <p className='text-info'>{ purchase.units }</p>
                                                    </div>
                                                </div>
                                                <div className='row' style={{ fontFamily: 'cursive' }}>
                                                    <div className='col-sm-6'>
                                                        <p>Description:</p>
                                                    </div>
                                                    <div className='col-sm-6'>
                                                        <p className='text-info'>{ purchase.description }</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className='btn btn-default mb-5 mx-5 purchase' data-toggle="modal" data-target="#approvalModal" style={{
                                                borderRadius: 20,
                                                fontFamily: 'cursive',
                                                boxShadow: '0px 5px 10px darkgrey'
                                            }} onClick={ () =>this.setCurrentItem(this, purchase) }>
                                                <i className='la la-check-circle'></i>
                                                {' '}
                                                Approve
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    {/* Modal */}
                    <div class="modal fade" id="approvalModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Approve</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <form className='mt-3' id='approvalForm'>
                                        <span style={{color:'green'}}>{this.state.message}</span>
                                        <span style={{color:'red'}}>{this.state.error}</span>
                                        <div className='form-group'>
                                            <input type="number" name="discount" id="discountModal" placeholder='Enter discount...' className='form-control' style={{
                                                borderRadius: 20
                                            }} />
                                            <br />
                                            <input type="number" name="phone" id="phoneModal" placeholder="Customer's phone number..." className='form-control' style={{
                                                borderRadius: 20
                                            }}/>
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>
                                    <button type="button" class="btn btn-success" onClick={this.approve}>
                                        <i className='la la-check-circle'></i>
                                        Approve
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
    
                {
                   this.state.logout === true ? <Redirect to='/'/> : null
                }
                  
                </div>
            )
        }else if(this.state.type === 'Buyer'){
            return(
                <Redirect to={{
                    pathname: "/home",
                    state: {
                      email: this.state.email ? this.state.email : null,
                      companyname: this.state.companyname,
                      id: this.state.id,
                      type: this.state.type
                    }
                  }}/>
            )
        }else{
            <Redirect to='/'/>
        }
        
    }
}
