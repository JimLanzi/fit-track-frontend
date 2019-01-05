import React, {Component} from 'react';
import Button from '@material-ui/core/Button'         
import Typography from '@material-ui/core/Typography'         
import Paper from '@material-ui/core/Paper'         
import TextField from '@material-ui/core/TextField'         
import AuthService from './AuthService';
import PropTypes from 'prop-types';


class Login extends Component
{
    constructor(props)
    {
        super(...arguments);
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.Auth = new AuthService("http://208.68.36.25/api");
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

    handleRegister()
    {
       this.props.history.replace('/register');
    }

    handleChange(e)
    {
        this.setState({[e.target.name]: e.target.value});
    }

    handleFormSubmit(e)
    {
        console.log('Submitting login info');
        e.preventDefault();
        this.Auth.login(this.state.user_name, this.state.password)
            .then(res => {
                this.context.router.history.push("/");
                //this.props.history.replace('/');
            })
            .catch(err => {alert(err)});
    }


    render()
    {
        const {classes} = this.props;
        return (
        <div className="center">
        <Paper elevation={1}>
          <Typography noWrap>
            <h1>Login</h1>
            <form>
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
                onChange={this.handleChange}
              />
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
              <Button primary={true} onClick={this.handleRegister}>Register Now</Button>
            </form>
          </Typography>
        </Paper>
        </div>
        );
    }


}

Login.propTypes = {classes: PropTypes.object.isRequired};

export default Login;
