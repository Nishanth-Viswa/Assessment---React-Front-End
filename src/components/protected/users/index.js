import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom';
import UsersList from './list';
import AddUsers from './addEdit';

export default class Users extends Component {
  render() {
    return (
      <>
        <Switch>
          <Route exact path={`${this.props.match.path}/`} component={UsersList}/>
          <Route exact path={`${this.props.match.path}/add`} component={AddUsers}/>
          <Route exact path={`${this.props.match.path}/edit/:id`} component={AddUsers}/>
          <Route path='*' component={UsersList} />
        </Switch>
      </>
    )
  }
}