import React, { Component } from 'react'
import axios from 'axios'
import {Redirect, Link} from 'react-router-dom'

export default class Login extends Component {
    constructor(){
        super()
        this.state = {
          companyname: '',
          password: '',
          success: '',
          message: '',
          email: '',
          error: '',
          resmsg:'',
          id:'',
          type:''
        }
        this.changeCompanyName = this.changeCompanyName.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.submit = this.submit.bind(this)
      }

      componentDidMount(){
        this.setState({
          companyname: '',
          password: '',
          success: '',
          message: '',
          email: '',
          error: '',
          resmsg:'',
          id:'',
          type:''
        })
      }

    changeCompanyName(event){
        this.setState({companyname: event.target.value})
      }
    
    changePassword(event){
        this.setState({password: event.target.value})
      }
    
      submit(event){
        event.preventDefault()
        const details = {
          companyname: this.state.companyname,
          password: this.state.password
        }
        this.setState({message: '*Loading*', error:''})
        var url = '/login'
        axios.post(url, details)
        .then((res) => {this.setState({type: res.data.type, success: res.data.success, companyname: res.data.company, resmsg:res.data.message, id: res.data.id, email: res.data.email}); console.log(res.data.id);
        if(this.state.success === false){
          this.setState({error: this.state.resmsg, success: '', message:''})
        }else{
          this.setState({success:'', message:'', error:''})
        }
      })
        .catch(error => this.setState({success: false, error:'Server Error', message:''}))

        setTimeout(()=>{
          this.setState({
              message:'',
              error:'',
          })
      }, 5000)
      }

    render() {
        return (
            <div>
                <div className='container' style={{marginTop: '10%'}}>
                    <h2 style={{textAlign:'center'}}>Log In</h2>
                    <div className='form-div'>
                    <span style={{color:'green'}}>{this.state.message}</span>
                    <span style={{color:'red'}}>{this.state.error}</span>
                        <form onSubmit={this.submit}>
                        Company Name:
                        <input required type = 'text'
                        placeholder = 'Username'
                        onChange = {this.changeCompanyName}
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
                        <input 
                        type = 'submit'
                        className = 'btn btn-danger btn-block'
                        value = 'submit'
                        />
                        </form><br/>
                        <Link to='/signup' style={{color:'red'}}>*Initialise Account*</Link>
                    </div>
                </div>
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
        )
    }
}
