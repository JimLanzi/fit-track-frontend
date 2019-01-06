import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import AuthService from './AuthService'
import withAuth from './withAuth'
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, LineSeries} from 'react-vis';

const Auth = new AuthService();

class App extends Component {
  
    constructor(props) {
        super(...arguments);
        this.handleLogout = this.handleLogout.bind(this);
        this.enterNewWeight = this.enterNewWeight.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.state = {loaded: false, rows: [], data: []};
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleLogout() {
        Auth.logout();
        this.props.history.replace('/login');
    }
  
    enterNewWeight(e) {
        e.preventDefault();
        var token = Auth.getToken();
        var weight = this.state.weight;
        var date = this.state.date;
        fetch("http://208.68.36.25/api/postWeight", {
             headers: {"Content-Type": "application/json"},
             method: "POST",
             body: JSON.stringify({token, date, weight })
        }).then(res => console.log(res));  
    }
  
    componentWillMount() {
        fetch('http://208.68.36.25/api/getWeightData/'+Auth.getToken())
            .then(res => res.json())
            .then(rows => this.setState({rows}))
            .then(() => this.setState({...this.state.rows}))
            .then(() => console.log(this.state.rows))
            .then(() => {var data = this.state.rows.map((item)=>{return {'x':item.date,'y':item.weight}}); 
                         this.setState({data: data});
                        })
            .then(() => console.log(this.state.data))
            .then(() => this.setState({loaded: true}));
    }

    render() {
      return (
        <div className="App">
          <AppBar position="static">
              <Typography variant="title" color="inherit"> 
                  Weight Tracking Application: {this.props.user.first_name} {this.props.user.last_name}
              </Typography>
          </AppBar>
          <br/>
          <Grid container spacing={24}>
              <Grid item xs>
                  <Card>
                      <TextField
                         name="date"
                         type="date"
                         onChange={this.handleChange}
                      />
                      <br/>
                      <TextField
                          name="weight"
                          label="Weight"
                          type="text"
                          onChange={this.handleChange}
                      />
                      <br/>
                      <Button type="submit" onClick={this.enterNewWeight}> <b>Enter New Weight</b> </Button>
                  </Card>
              </Grid>
              <Grid item xs>
                  <Card>
                      <XYPlot
                          xType="ordinal"
                          width={400}
                          height={400}>
                             <VerticalGridLines />
                             <HorizontalGridLines />
                             <XAxis title="Date" />
                             <YAxis title="Weight - lb" />
                             <LineSeries
                                 data={this.state.data}
                                 style={{stroke: 'violet', strokeWidth: 3}}/>
                      </XYPlot>                  
                      <Typography> Plot will go here </Typography>
                  </Card>
              </Grid>
          </Grid>
          <br/>
          <button onClick={this.handleLogout}> Logout </button>
        </div>
      );
    }
}

export default withAuth(App);
