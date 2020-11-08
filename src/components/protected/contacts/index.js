import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom';
import ContactsList from './list';
import AddContacts from './addEdit';

export default class Contacts extends Component {
  render() {
    return (
      <>
        <Switch>
          <Route exact path={`${this.props.match.path}/`} component={ContactsList}/>
          <Route exact path={`${this.props.match.path}/add`} component={AddContacts}/>
          <Route exact path={`${this.props.match.path}/edit/:id`} component={AddContacts}/>
          <Route path='*' component={ContactsList} />
        </Switch>
      </>
    )
  }
}