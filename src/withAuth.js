import React, { Component } from 'react';
import AuthService from './AuthService';

export default function withAuth(AuthComponent)
{
    const Auth = new AuthService('http://208.68.36.25/api');
    return class AuthWrapped extends Component
    {
        constructor(props)
        {
            super(props);
            this.state = { user: null };
        }

        componentWillMount()
        {
            if(!Auth.loggedIn())
            {
                console.log("NOT LOGGED IN!!");
                this.props.history.replace('/login');
            }
            else
            {
                try 
                {
                    const profile = Auth.getProfile();
                    this.setState({user:profile});
                }
                catch(err)
                {
                    console.log("ERRORED OUT ON LOGIN TOKEN TEST");
                    Auth.logout();
                    this.props.history.replace('/login');
                }
            }
        }


        render()
        {
            if(this.state.user)
            {
                return (
                    <AuthComponent history={this.props.history} user={this.state.user} />
                );
            }
            else
            {
                return null;
            }
        }


    }
}
