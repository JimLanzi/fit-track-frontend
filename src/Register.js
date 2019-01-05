import React, {Component} from 'react';
import Button from '@material-ui/core/Button'         
import Typography from '@material-ui/core/Typography'         
import Paper from '@material-ui/core/Paper'         
import TextField from '@material-ui/core/TextField'         
import DoneIcon from '@material-ui/icons/Done';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import AuthService from './AuthService';
import PropTypes from 'prop-types';
import './Login.css';

class Register extends Component
{
    constructor(props)
    {
        super(...arguments);
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handlePasswordCheck = this.handlePasswordCheck.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.Auth = new AuthService("http://208.68.36.25/api");
        this.state = {passwordCheckIcon: <HighlightOffIcon/>};
    }

    // This is needed for the context.router.history stuff to work below
    static contextTypes = {router: PropTypes.object};

    componentWillMount()
    {
        if(this.Auth.loggedIn())
        {
            this.context.router.history.push("/");
//            this.props.history.replace('/');
        }
    }

    handleLogin()
    {
       this.props.history.replace('/login');
    }

    handleChange(e)
    {
        this.setState({[e.target.name]: e.target.value});
    }

    handlePasswordCheck(e)
    {
        // Store changed value in text field in state (asynchronous)
        this.handleChange(e);

        // Test Changed Value in Text Field against stored state
        var testSame = false;
        if(e.target.name === 'passwordCheck')
        {
            testSame = this.state.password === e.target.value;
        }
        else
        {
            testSame = this.state.passwordCheck === e.target.value;
        }

        // Set Check or X Icon accordingly
        if(this.state.password && testSame)
        {
            this.setState({passwordCheckIcon: <DoneIcon/>  });
        }
        else
        {
            this.setState({passwordCheckIcon: <HighlightOffIcon/>  });
        }
    }

    handleFormSubmit(e)
    {
        console.log('Submitting register info');
        e.preventDefault();
        if (!this.state.user_name || !this.state.password || !this.state.passwordCheck || !this.state.first_name || !this.state.last_name)
        {
            alert("One or more required fields are not filled in");
        }
        else if (this.state.password !== this.state.passwordCheck)
        {
           alert("Passwords do not match");
        }
        else
        {
           this.Auth.register(this.state.user_name, this.state.password, this.state.first_name, this.state.last_name)
          .then(res => {
            this.context.router.history.push("/");
          })
          .catch(err => {
            alert(err);
          });
        }        
    }


    render()
    {
        return (
        <div className="center">
        <Paper elevation={1}>
          <Typography noWrap>
            <h1>Register</h1>
            <form>
              <TextField
                placeHolder="Enter First Name"
                name="first_name"
                type="text"
                label="Firstname"
                onChange={this.handleChange}
              />
              <br/>
              <TextField
                placeHolder="Enter Last Name"
                name="last_name"
                type="text"
                label="Lastname"
                onChange={this.handleChange}
              />
              <br/>
              <TextField
                placeHolder="Enter Username"
                name="user_name"
                type="text"
                label="Username"
                onChange={this.handleChange}
              />
              <br/>
              <TextField
                placeHolder="Enter Password"
                name="password"
                type="password"
                label="Password"
                onChange={this.handlePasswordCheck}
              />
              <br/>
              <TextField
                placeHolder="Confirm Password"
                name="passwordCheck"
                type="password"
                label="PasswordCheck"
                onChange={this.handlePasswordCheck}
              />
              {
                  this.state.passwordCheckIcon
              }
              <br/>
              <br/>
              <Button 
                type="submit"
                primary={true}
                onClick={this.handleFormSubmit}
              >
              <b>Submit</b>
              </Button>
              <br/>
              <br/>
              <Button primary={true} onClick={this.handleLogin}>Login Now</Button>
            </form>
          </Typography>
        </Paper>
        </div>
        );
    }

}

Register.propTypes = {classes: PropTypes.object.isRequired};

export default Register;
