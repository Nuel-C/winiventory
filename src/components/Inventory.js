import axios from 'axios'
import React, { Component } from 'react'
import {Link, Redirect} from 'react-router-dom'
import Pen from '../assets/pen.png'
import Trash from '../assets/trash.png'

export default class Inventory extends Component {
    constructor(props){
        super(props)
        this.state = {
            companyname: this.props.location.state.companyname,
            email: this.props.location.state.email,
            id: this.props.location.state.id,
            type: this.props.location.state.type,
            name:'',
            unitprice:'',
            units:'',
            description: '',
            message:'',
            error:'',
            items:[],
            logout: '',
        }
        this.onChange = this.onChange.bind(this)
        this.submit = this.submit.bind(this)
        this.edit = this.edit.bind(this)
        this.logout = this.logout.bind(this)
        this.delete = this.delete.bind(this)
    }

    onChange(e){
        this.setState({[e.target.name]: e.target.value})
    }

    edit(e) {
        if (e.target.id == 'button') {
            document.getElementById('edit').textContent = 'Edit'
            let children = e.target.parentElement.parentElement.children
            console.log(children)
            document.getElementById('prevName').textContent = children[0].textContent
            this.setState({
                name: children[0].textContent,
                unitprice: children[1].textContent,
                units: children[2].textContent,
                description: children[3].textContent
            })
        }
        
    }

    delete(e){
        if (e.target.id == 'delBtn') {
            let children = e.target.parentElement.parentElement.children
            let id = children[0].textContent
            fetch(`/delete_inventory/${id}`, {
                method: 'DELETE',
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
                console.log(data)
            })
            .catch(err => console.log(err))
            this.setState({
                items: this.state.items.filter(item => {
                   return item.itemName !== id
                })
            })
        }
        if (e.target.id == 'delImg') {
            let children = e.target.parentElement.parentElement.parentElement.children
            let id = children[0].textContent
            console.log(id)
            fetch(`/delete_inventory/${ id }`, {
                method: 'DELETE',
            })
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                console.log(data)
            })
            .catch(err => console.log(err))
        }
    }

    componentDidMount(){
        var post = {
            companyname: this.state.companyname
        }
        var url = '/getitems'
        axios.post(url, post)
        .then((res)=>{
            console.log(res.data.items)
            this.setState({items: res.data.items})
        })
        .catch(err => console.log(err))
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.items === this.state.items){
            var post = {
                companyname: this.state.companyname
            }
            var url = '/getitems'
            axios.post(url, post)
            .then((res)=>{
                console.log(res.data.items)
                this.setState({items: res.data.items})
            })
            .catch(err => console.log(err))
        }
    }

    submit(e){
        e.preventDefault()
        this.setState({message: '*Adding Item*', error:''})
        var post = {
            companyname: this.state.companyname,
            itemName: this.state.name,
            units: this.state.units,
            description: this.state.description,
            unitPrice: this.state.unitprice,
            id: this.state.id

        }
        if (document.getElementById('edit').textContent == 'Edit') {
            let itemName = document.getElementById('prevName').textContent
            fetch(`/edit_inventory/${itemName}/edit`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(post)
            })
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                console.log(data)
            })
        } else {
            axios.post('/addinventory', post)
                .then((res) => {
                    console.log(res.data)
                    if(res.data.success === true){
                        this.setState({item:'', units:'', description:'', unitprice:'', message: res.data.message, error:''})
                    }else{
                        this.setState({item:'', units:'', description:'', unitprice:'', error: res.data.message, message:'',})
                    }
                })
        }

        this.setState({
            name:'',
            unitprice:'',
            units:'',
            description: ''
        })

        var post2 = {
            companyname: this.state.companyname
        }
        var url = '/getitems'
        axios.post(url, post2)
        .then((res)=>{
            console.log(res.data.items)
            this.setState({items: res.data.items})
        })
        .catch(err => console.log(err))

        setTimeout(()=>{
            this.setState({
                message:'',
                error:'',
            })
        }, 5000)
        document.getElementById('edit').textContent = ''
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
                  <h2 style={{textAlign:'center'}}>Add Inventory</h2><br/>
                  <div className='form-div'>
                    <span style={{color:'green'}}>{this.state.message}</span>
                    <span style={{ color: 'red' }}>{this.state.error}</span>
                        
                      <p style={{ display: 'none', margin: 'none' }} id='edit'></p>
                      <p style={{ display: 'none', margin: 'none' }} id='prevName'></p>

                      <form onSubmit={this.submit}>
                       Item Name:
                      <input required style={{width:'100%', borderRadius:'30px'}} type = 'text'
                      placeholder = 'Name'
                      onChange = {this.onChange}
                      value = {this.state.name}
                      className = 'form-control form-group'
                      name = 'name'
                      />
                      Unit Price:
                      <input required style={{width:'100%', borderRadius:'30px'}} type = 'number'
                      placeholder = 'Unit Price'
                      name = 'unitprice'
                      onChange = {this.onChange}
                      value = {this.state.unitprice}
                      className = 'form-control form-group'
                      />
                      Units:
                      <input style={{width:'100%', borderRadius:'30px'}} type = 'number'
                      placeholder = 'Units'
                      name = 'units'
                      onChange = {this.onChange}
                      value = {this.state.units}
                      className = 'form-control form-group'
                      />
                      Description:
                      <textarea required style={{width:'100%'}} type = 'text'
                      onChange = {this.onChange}
                      value = {this.state.description}
                      className = 'form-control form-group'
                      name = 'description'
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
              </div><br/><br/>
              <h2 style={{ textAlign: 'center' }}>Manage Inventory</h2><br />
              <div className='table-responsive'>
                    <table id='table' className='container table table-hover' style={{ whiteSpace: 'nowrap' }}>
                        <thead className='thead thead-dark'>
                            <tr>
                                <th>Item Name</th>
                                <th>Unit Price</th>
                                <th >Units</th>
                                <th className='hide'>Description</th>
                                <th className='hide'>Date Added</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.items.map(dat => {
                                    return(
                                        <tr key={dat._id}>
                                            <td>{dat.itemName}</td>
                                            <td>{dat.unitPrice}</td>
                                            <td>{dat.units}</td>
                                            <td className='hide'>{dat.description}</td>
                                            <td className='hide'>{dat.date}</td>
                                            <td><button onClick={this.edit} className='btn btn-success btn-block' id='button'><img src={Pen} alt='' style={{height:'1rem'}}/></button></td>
                                            <td><button onClick={this.delete} className='btn btn-danger btn-block' id='delBtn'><img src={Trash} alt='' style={{height:'1rem'}} id='delImg'/></button></td>
                                        </tr> 
                                    ) 
                                }).reverse()
                            }
                        </tbody>
                   </table><br/><br/><br/>
                </div>
              
                {
                    this.state.logout === true ? <Redirect to='/'/> : null
                }
            </div>
        )
    }
}
