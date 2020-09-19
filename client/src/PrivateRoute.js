import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "./context/auth";

function PrivateRoute({ component: Component, ...rest }) {
    const { accessToken } = useAuth();

    return (
        <Route
            {...rest}
            render={props =>
                accessToken ? (
                    <Component {...props} />
                ) : (
                        <Redirect
                            to={{ pathname: "/auth/signin", state: { referer: props.location } }}
                        />
                    )
            }
        />
    );
}

export default PrivateRoute;