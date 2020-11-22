import React from 'react';
import { Route, useRouteMatch, Redirect, Switch } from "react-router-dom";
import { Layout, Row, Col } from 'antd';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import ResetPassword from '../components/ResetPassword';
import NewPassword from '../components/NewPassword';
import Confirm from '../components/Confirm';
import PrivateRoute from '../PrivateRoute';
import './AuthContainer.css';

const { Content } = Layout;

function AuthContainer() {
    const match = useRouteMatch();
    return (
        <Layout>
            <Content
                style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: '100vh',
                }}
            >
                <Row justify="center" align="middle">
                    <Col span={12}>
                    <Switch>
                                <Route exact path={`${match.path}/signup`} component={SignUp} />
                                <Route exact path={`${match.path}/signin`} component={SignIn} />
                                <Route exact path={`${match.path}/reset`} component={ResetPassword} />
                                <Route exact path={`${match.path}/reset/:token`} component={NewPassword} />
                                <PrivateRoute exact path={`${match.path}/confirm/:token`} component={Confirm} />
                                <Redirect to={`${match.url}/signin`} />
                    </Switch>
                    </Col>
                </Row>

            </Content>
        </Layout>
    );
}

export default AuthContainer;