import React, { Component } from 'react';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import withAuth from './withAuth';
import Home from './Home';
import Secret from './Secret';
import Login from './Login';
import Register from "./Register";
import LogOut from "./LogOut";
import Users from "./Users";
import isAdmin from "./isAdmin";
import { Button, ButtonGroup, Form } from 'reactstrap';

let users =[];

const fun = function () {
    return (
        <Redirect to='/'/>
    );
};

fetch('/users')
    .then(res => res.json())
    .then(json => {
        users = JSON.stringify(json);
    });

class App extends Component {
  render() {
    return (
      <div className='container'>
          <div className='row row-header pb-5'>
              <form action='/' className='col-2'>
                  <Button type='submit' className='col-12' color='primary'>
                      Home
                  </Button>
              </form>
              <form action='/secret' className='col-2'>
                  <Button type='submit' className='col-12' color='primary'>
                      Secret
                  </Button>
              </form>
              <form action='/login' className='col-2'>
                  <Button type='submit' className='col-12' color='primary'>
                      Login
                  </Button>
              </form>
              <form action='/register' className='col-2'>
                  <Button type='submit' className='col-12' color='primary'>
                      Register
                  </Button>
              </form>
              <form action='/logout' className='col-2'>
                  <Button type='submit' className='col-12' color='primary'>
                      LogOut
                  </Button>
              </form>
              <form action='/users' className='col-2'>
                  <Button type='submit' className='col-12' color='primary'>
                      Users
                  </Button>
              </form>
          </div>
          <div>
              <Switch>
                  <Route path="/" exact component={Home} />
                  <Route path="/secret" component={withAuth(Secret)} />
                  <Route path="/login" component={Login} />
                  <Route path="/register" component={Register}/>
                  <Route path="/logout" component={LogOut}/>
                  <Route path="/users" component={isAdmin(Users)}/>
              </Switch>
          </div>
      </div>
    );
  }
}

export default App;
