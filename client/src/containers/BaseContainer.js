import React, {useState} from 'react';
import { Route, useLocation, Switch, Link } from "react-router-dom";
import { Layout, Menu, Button, Tooltip } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import User from '../components/User';
import { useAuth } from '../context/auth';
import './BaseContainer.css';

const { Header, Sider, Content } = Layout;

function BaseContainer() {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const {signOut} = useAuth();

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    selectedKeys={[location.pathname]}>
                    <Menu.Item key="/me" icon={<UserOutlined />}>
                    <Link to="/me">Profile</Link>
              </Menu.Item>
                    <Menu.Item key="/test" icon={<VideoCameraOutlined />}>
                    <Link to="/test">nav 2</Link>
              </Menu.Item>
                    <Menu.Item key="/test2" icon={<UploadOutlined />}>
                    <Link to="/test2">nav 3</Link>
              </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                    })}
                    <div style={{float: 'right', padding: '0 24px'}}>
                        <Tooltip title="Sign Out">
                            <Button type="primary" shape="circle" icon={<LogoutOutlined />} onClick={signOut} />
                        </Tooltip>
                    </div>
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: '100vh',
                    }}
                >
                <Switch>
                    <Route path="/me" component={User} />
                </Switch>
            </Content>
            </Layout>
        </Layout>
    );
}

export default BaseContainer;