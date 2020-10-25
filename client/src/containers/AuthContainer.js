import React from 'react';
import { Route, useRouteMatch, Redirect, Switch } from "react-router-dom";
import { Layout, Row, Col } from 'antd';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
//import SignIn from '../components/SignIn_m';
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
                <Row justify="space-around" align="middle">
                    <Col span={12} offset={6}>
                    <Switch>
                                <Route exact path={`${match.path}/signup`} component={SignUp} />
                                <Route exact path={`${match.path}/signin`} component={SignIn} />
                                <Redirect to={`${match.url}/signin`} />
                            </Switch>
                    </Col>
                </Row>

            </Content>
        </Layout>
    );
}

export default AuthContainer;