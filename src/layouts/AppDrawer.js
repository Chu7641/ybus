import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Drawer, Modal, Menu } from 'antd';
import {
    LogoutOutlined,
    ExclamationCircleOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import menu from '../menu';
import MenuGroupItem from '../components/Menu/MenuGroupItem';
import MenuItem from '../components/Menu/MenuItem';
// actions
import { logout } from '../redux/actions/AuthActions';

const { confirm } = Modal;

class AppDrawer extends Component {
    onLogout() {
        confirm({
            title: 'Xác nhận đăng xuất',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn chắc chắn muốn đăng xuất chứ?',
            okText: 'OK',
            cancelText: 'Huỷ',
            onOk: () => {
                this.props.logout().then(() => {
                    window.location.href = '/login'
                })
            }
        })
    }

    onClickMenu(key) {
        if (key != 'logout') this.props.history.push(key);
        else this.onLogout();
        this.props.onClose();
    }

    render() {
        var { pathname } = this.props.location;
        var { visible, onClose } = this.props;

        return (
            <Drawer
                placement="right"
                closable={false}
                onClose={() => onClose()}
                visible={visible}
            >
                <Menu
                    mode="inline"
                    selectedKeys={[pathname]}
                    style={{ height: '100%', borderRight: 0 }}
                    onClick={({ item, key, keyPath }) => this.onClickMenu(key)}
                >
                    {
                        menu.map((item, key) => {
                            if (item.children) {
                                return <MenuGroupItem item={item} key={key} />
                            } else {
                                return <MenuItem item={item} key={item.path} />
                            }
                        })
                    }
                    <Menu.Item key="profile" icon={ <InfoCircleOutlined />}>
                  
                       
                            Thông tin tài khoản
                                                  
                    
                    </Menu.Item>
                    <Menu.Item key="logout" icon={<LogoutOutlined />}>
                        Đăng xuất
                    </Menu.Item>
                </Menu>
            </Drawer>
        )
    }
}

function mapStateToProps(state) {
    return {
        config: state.config
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logout())
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppDrawer));