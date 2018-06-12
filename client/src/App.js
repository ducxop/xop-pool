import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      response: '',
      demo: 'not work',
      mes: [],
      isLogin: true
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleGet = this.handleGet.bind(this);
  }

  handleClick = async () => {
    this.state.isLogin?await fetch("/api/login"):await fetch("/api/logout")
    this.setState({demo: 'This Workkkk!!!'})
    this.setState(prevState => ({
      isLogin: !prevState.isLogin
    }));
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
      //   .map(msg=>{
      //     return (<li>{msg}</li>)
      //   })
      // })
  }

  handleGet = async() =>{
    const res = await fetch('/api/get')
    if (res.status===204)
      alert('204')
    else{
      const body = await res.json()
      alert("second")
      if (res.status !== 200)
        throw Error(body.message)
      else  
        alert(body.mes)
        this.setState({
          mes:body.mes.map(msg=>{
            return (<li>{msg}</li>)
          })
        })
    }
  }

  componentDidMount() {
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

  render() {     
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">{this.state.response}</h1>
        </header>
        <p className="App-intro">
          <p id="demo">Message receive: <MessList mess={this.state.mes}/></p>
          <button onClick={this.handleClick}>
          {this.state.isLogin ? 'Login' : 'Logout'}
          </button>
          <button onClick={this.handleGet}>Get</button>
          <button onClick={this.handleSend}>Send</button>
        </p>        
      </div>
    );
  }
}

function MessList(props) {
  const mess = props.mess;
  const listItems = mess.map((mes) =>
    <li>{mes}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}
export default App;
