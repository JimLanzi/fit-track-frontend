import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AuthService from './AuthService'
import withAuth from './withAuth'

const Auth = new AuthService();

class App extends Component {
  
  constructor(props) {
      super(...arguments);
      this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
      Auth.logout();
      this.props.history.replace('/login');
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <h1 className="App-title">Welcome {this.props.user.user_name}</h1>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <button onClick={this.handleLogout}> Logout </button>
        </header>
      </div>
    );
  }
}

export default withAuth(App);
