import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Breadcrumb, Menu, Row } from 'antd';
import { isMobile, MobileView } from 'react-device-detect';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import AppFooter from './AppFooter';

import { withRouter, Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
// actions

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

class AppLayout extends Component {
    componentDidMount() {
    }
    state = {
        collapsed: false,
    };


    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    render() {
        const { collapsed } = this.state;
        return (
            <Layout style={{ minHeight: '100vh' }}>


                <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>

                    <Row className="logo" justify="center" >
                        <Link to="/">
                            {collapsed ?
                                <img style={{ height: 30, width: "auto" }} src={require('../assets/img/logo-icon.png')} />

                                : <img style={{ height: 40, width: "auto" }} src={require('../assets/img/logo.png')} />
                            }
                        </Link>
                    </Row>
                    <AppSidebar />
                </Sider>


                <Layout className="site-layout">

                    {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}

                    <AppHeader></AppHeader>
                    <Content style={{ margin: '16px 16px' }} >

                        <div className="site-layout-background" style={{ padding: 16, minHeight: 480 }}>
                            {this.props.children}
                        </div>


                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Yobuma ©2021 Created by Yobuma</Footer>
                </Layout>

            </Layout>
        )
    }
}

function mapStateToProps(state) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppLayout));