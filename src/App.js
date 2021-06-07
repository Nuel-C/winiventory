import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.js'
import axios from 'axios'
import './App.css'
import {BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Inventory from './components/Inventory'
import Sales from './components/Sales'
import Home from './components/Home'
import Order from './components/Order'
import Purchases from './components/Purchases'

export default class App extends Component {
  constructor(){
    super()
    this.state = {
      email: '',
      password: '',
      success: '',
      message: '',
      companyname: '',
      error: '',
      id: '',
    }
    this.changeUsername = this.changeUsername.bind(this)
    this.changeEmail = this.changeEmail.bind(this)
    this.submit = this.submit.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.changeType = this.changeType.bind(this)
  }

  componentDidMount(){
    this.setState({
      email: '',
      password: '',
      success: '',
      message: '',
      companyname: '',
      error: '',
      id:'',
      type:''
    })
  }

  changeUsername(event){
    this.setState({companyname: event.target.value})
  }

  changeType(event){
    this.setState({type: event.target.value})
  }

  changeEmail(event){
    this.setState({email: event.target.value})
  }

  changePassword(event){
    this.setState({password: event.target.value})
  }
  submit(event){
    event.preventDefault()
      const details = {
        companyname: this.state.companyname,
        password: this.state.password,
        email: this.state.email,
        type: this.state.type
      }
      this.setState({message: '*Loading*', error: ''})
      var url = '/signup'
      axios.post(url, details)
      .then(res => {
        console.log(res.data.id);
        this.setState({success: res.data.success, companyname: res.data.companyname, msg: res.data.msg, id: res.data.id, type: res.data.type, email: res.data.email})
        if(res.data.success === false){
          this.setState({message: '', error: this.state.msg})
        }else{
          this.setState({success:'', message:'', error:'', email: '', password:'', companyname:''})
        }
      }
      )
      .catch(error => this.setState({success:'', message:'', error:'Server Error', email: '', password:'', companyname:''}))
  
      setTimeout(()=>{
        this.setState({
            message:'',
            error:'',
        })
    }, 5000)
    
  }  

  render() {
    return (
      <Router>
        <Route path='/signup' render={props=>(
          <div>
            <div className='container' style={{marginTop: '10%'}}>
              <h2 style={{textAlign:'center'}}>Sign Up</h2>
              <div className='form-div'>
              <span style={{color:'green'}}>{this.state.message}</span>
              <span style={{color:'red'}}>{this.state.error}</span>
                <form onSubmit={this.submit}>
                  Company Name:
                  <input required type = 'text'
                  placeholder = 'Company Name'
                  onChange = {this.changeUsername}
                  value = {this.state.companyname}
                  className = 'form-control form-group'
                  />
                  Password:
                  <input required type = 'password'
                  placeholder = 'Password'
                  onChange = {this.changePassword}
                  value = {this.state.password}
                  className = 'form-control form-group'
                  />
                  E-mail:
                  <input required type = 'email'
                  placeholder = 'E-mail'
                  onChange = {this.changeEmail}
                  value = {this.state.email}
                  className = 'form-control form-group'
                  />
                  Account Type:
                      <select required onChange = {this.changeType} name="item" id="item" style={{width:'100%'}} className = 'form-control form-group'>
                          <option value="">-- Choose Account --</option>
                            <option value="Buyer">Buyer</option>
                            <option value="Seller">Seller</option>
                      </select>
                  <input 
                  type = 'submit'
                  className = 'btn btn-danger btn-block'
                  value = 'submit'
                  />
                </form><br/>
                <div style={{textAlign:'center'}}><Link style={{color:'red'}} to='/'>*Login*</Link></div>
                {
                 this.state.success ? <Redirect to={{
                  pathname: "/dashboard",
                  state: {
                    email: this.state.email,
                    companyname: this.state.companyname,
                    id: this.state.id,
                    type: this.state.type
                  }
                }}/> : null
                }
              </div>
            </div>
         </div>
        )} />
        <Route exact path = '/' component = {Login} />
        <Route path = '/dashboard' component = {Dashboard} />
        <Route path = '/inventory' component = {Inventory} />
        <Route path = '/sales' component = {Sales} />
        <Route path = '/home' component = {Home} />
        <Route path = '/order' component = {Order} />
        <Route path = '/purchases' component = {Purchases} />
      </Router>
    )
  }
}
