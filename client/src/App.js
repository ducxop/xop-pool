import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import socketIOClient from 'socket.io-client'
import {
  BrowserRouter as Router,
  Route,
  Link,
  //Redirect,
} from 'react-router-dom'

const socket = socketIOClient('http://localhost:5000')

class App extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      response: '',
      //endpoint: 'http://127.0.0.1:5000',
      mes: [], ///[],
      isLogin: true
    }
    this.handleSend = this.handleSend.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
  }


  handleSend = async() =>{
    const res = await fetch('/api/send')
    const body = await res.json()
    if (res.status !== 200)
      throw Error(body.message)
    else  
      //alert(body.mes)
      this.setState({
        mes:body.mes})
  }

  componentDidMount() {
    //SOCKET.IO
    //const {endpoint} = this.state
    
    //FETCH
    this.callApi()
      .then(resp => this.setState({ response: resp.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };     
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    socket.emit('send', this.state.value)
    //alert('A name was submitted: ' + this.state.value);
     event.preventDefault();
  }

  render() {     
    return (
      <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">{this.state.response}</h1>
        </header>
        {/*}
        <p>
          <form onSubmit={this.handleSubmit}>
            <label>
              Message to send:
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            {/*<input type="submit" value="Send" />
          </form>
        </p>
        */}
        <p>
          <Route exact path="/server" component={MessageInput}/>
          <Route exact path="/client" component={MessageView}/>
        </p>  
      </div>
      </Router>
    );
  }
}

class MessageView extends React.Component {
  // handleClick = (index) => {
  //   store.dispatch({
  //     type: 'DELETE_MESSAGE',
  //     index: index,
  //   });
  // };
  constructor(props){
    super(props)
    this.state = {
      mess:[],
      isLogin: true,
      uuid: '',
      token: ''
    }
    this.handleClick = this.handleClick.bind(this);
    socket.on("message", msg=>{
      if (this.state.mess)
      this.setState(prevState=>{
        if (prevState.mess.length>10)
          prevState.mess.shift()
        prevState.mess.push(msg)
        return {mess: prevState.mess}
      })
    })
  }
  
  handleClick = async () => {
    // var postData = {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({uuid: this.state.uuid, token: this.state.token})
    // }
    function cb(ans)
    {
      if (ans || (!ans && (!this.state.isLogin))){
        if (!this.state.isLogin) this.setState({mess:[]})
        this.setState(prevState => ({
          isLogin: !prevState.isLogin
        }))
      }
    }
    var ccb = cb.bind(this)
    this.state.isLogin?await socket.emit("login", {uuid: this.state.uuid, token: this.state.token}, ccb) //(ans)=>{response=ans; alert(ans)}) //await fetch("/api/login",postData)
                      :await socket.emit("logout", {uuid: this.state.uuid, token: this.state.token}, ccb) //(ans)=>{response=ans; alert(ans)})
    // if (response){
    //   if (!this.state.isLogin) this.setState({mess:[]})
    //   this.setState(prevState => ({
    //     isLogin: !prevState.isLogin
    //   }))
    // }
    
    
    //alert('res',response)cd app

    //const body = await response.json();
    // if (response.status == 200) {
    //   alert(response.status)
    //   if (!this.state.isLogin) this.setState({mess:[]})
    //   this.setState(prevState => ({
    //     isLogin: !prevState.isLogin
    //   }));
    // }
    // else
    //   alert(response.status)
  }
  
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  };
  onChangeID = (e) => {
    this.setState({
      uuid: e.target.value,
    })
  };
  onChangeTK = (e) => {
    this.setState({
      token: e.target.value,
    })
  };
  render() {
    const messages = this.state.mess.map((message, index) => (
      <p
        className='comment'
        key={index}
        //onClick={() => this.handleClick(index)}
      >
        {message}
      </p>
    ));
    return (
      <div className='ui comments'>
      <p className="App-intro">
        uuid:
        <input
          onChange={this.onChangeID}
          value={this.state.uuid}
          type='text'
          size={40}
        />
        token:
        <input
          onChange={this.onChangeTK}
          value={this.state.token}
          type='text'
          size={40}
        />
        <button onClick={this.handleClick} type='submit'>
        {this.state.isLogin ? 'Login' : 'Logout'}
        </button>
      </p>
      {this.state.isLogin?null:(
        <div>
          <p>Receive:</p>
          {messages}
        </div>
      )}
      </div>
    );
  }
}
class MessageInput extends React.Component {
  state = {
    value: '',
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  };

  handleSubmit = () => {
    // store.dispatch({
    //   type: 'ADD_MESSAGE',
    //   message: this.state.value,
    // });
    socket.emit('send', this.state.value)
    this.setState({
      value: '',
    });
  };

  render() {
    return (
      <div className='ui input'>
        <p>Broadcast:</p>
        <input
          onChange={this.onChange}
          value={this.state.value}
          type='text'
          size={50}
        />
        <button
          onClick={this.handleSubmit}
          className='ui primary button'
          type='submit'
        >
          Submit
        </button>
       </div>
    );
  }
}

export default App;
