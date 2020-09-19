import React from 'react';
import { Route, useRouteMatch, Redirect, Switch } from "react-router-dom";
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';

function AuthContainer() {
    const match = useRouteMatch();
    return (
        <React.Fragment>
            <Switch>
                <Route exact path={`${match.path}/signup`} component={SignUp} />
                <Route exact path={`${match.path}/signin`} component={SignIn} />
                <Redirect to={`${match.url}/signin`} />
            </Switch>
        </React.Fragment>
    );
}

export default AuthContainer;