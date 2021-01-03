import React from 'react';
import { Route, useRouteMatch, Redirect, Switch } from "react-router-dom";
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import ResetPassword from '../components/ResetPassword';
import NewPassword from '../components/NewPassword';
import Confirm from '../components/Confirm';
import PrivateRoute from '../PrivateRoute';
import './AuthContainer.css';


function AuthContainer() {
    const match = useRouteMatch();
    return (
        <div>
            <Switch>
                <Route exact path={`${match.path}/signup`} component={SignUp} />
                <Route exact path={`${match.path}/signin`} component={SignIn} />
                <Route exact path={`${match.path}/reset`} component={ResetPassword} />
                <Route exact path={`${match.path}/reset/:token`} component={NewPassword} />
                <PrivateRoute exact path={`${match.path}/confirm/:token`} component={Confirm} />
                <Redirect to={`${match.url}/signin`} />
            </Switch>
        </div>
    );
}

export default AuthContainer;