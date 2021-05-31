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
            item:'',
            
        }
        this.logout = this.logout.bind(this)
    }

    componentDidMount(){
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
        })
        .catch(err => console.log(err))
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
                      <span style={{color:'red'}}></span>
                          <form onSubmit={this.submit}>
                          Item:
                          <select required onChange = {this.changeItem} name="item" id="item" style={{width:'100%', borderRadius:'30px'}} className = 'form-control form-group'>
                              <option value="">-- Choose Session --</option>
                                <option value="30mins">30 Mins. session</option>
                                <option value="1hour">1 Hour session</option>
                                <option value="children 30mins">Children shoot from 6months - 5years, 30Mins.</option>
                                <option value="children 1hour">Children shoot from 6months - 5years, 1Hour</option>
                                <option value="group 30mins">Group photo with family or friends, 30Mins.</option>
                                <option value="group 1hour">Group photo with family or friends, 1Hour</option>
                                <option value="product 30mins">Product shoot, 30Mins.</option>
                                <option value="product 1hour">Product shoot, 1Hour</option>
                                <option value="home 30mins">Photo session (Home service), 30Mins.</option>
                                <option value="home 1hour">Photo session (Home service), 1Hour</option>
                                <option value="outdoor 1hour">Photo session (Outdoor), 1Hour</option>
                                <option value="outdoor 30mins">Photo session (Outdoor), 30Mins.</option>
                                <option value="artist">Artist photoshoot @ the studio, 1Hour</option>
                          </select>
                           Customer:
                          <input required style={{width:'100%', borderRadius:'30px'}} type = 'text'
                          placeholder = 'Customer'
                          onChange = {this.changeCustomer}
                          value = {this.state.customer}
                          className = 'form-control form-group'
                          />
                          Phone Number:
                          <input required style={{width:'100%', borderRadius:'30px'}} type = 'number'
                          placeholder = 'Phone Number'
                          onChange = {this.changePhone}
                          value = {this.state.phone}
                          className = 'form-control form-group'
                          />
                          Discount:
                          <input style={{width:'100%', borderRadius:'30px'}} type = 'number'
                          placeholder = 'Discount'
                          onChange = {this.changeDiscount}
                          value = {this.state.discount}
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
