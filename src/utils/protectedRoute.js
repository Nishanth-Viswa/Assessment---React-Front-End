import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const ProtectedRoute = ({ component: Component, path, ...rest }) => {
    return(
        <Route {...rest} render={props => (
            localStorage.getItem('token')
            // true
                ? <Component {...props} /> //Move to the component
                : <Redirect to={{ pathname: '/', state: { from: props.location } }} /> //Redirect to login
        )} />
    )
}