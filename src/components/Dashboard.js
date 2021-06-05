import React, { Component } from 'react'
import {Link, Redirect} from 'react-router-dom'
import axios from 'axios'
import itemsApiData from '../Providers/provider'
// import itemApiData from '../Providers/provider'


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
            customer: ''
            
        }
        this.logout = this.logout.bind(this)
        this.submit = this.submit.bind(this)
        // this.changeItem = this.changeItem.bind(this)
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
    }

    submit = (e) => {
        e.preventDefault()
        let saleTable = document.getElementById("saleTable")
        let formData = new FormData(saleTable)
        let body = {}
        for (let key of formData.keys()) {
            body[key] = formData.get(key)
        }
        fetch('/add_sale', {
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
                    <a className="navbar-brand" href='/'>Winnieventory</a>
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
                   this.state.logout === true ? <Redirect to='/'/> : null
                }
                  
                </div>
            )
        }else if(this.state.type === 'Buyer'){
            return(
                <Redirect to={{
                    pathname: "/home",
                    state: {
                      email: this.state.email,
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
