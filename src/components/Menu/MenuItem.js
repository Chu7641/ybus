import React, { Component } from 'react';
import { Menu } from 'antd';
import { connect } from 'react-redux';

class MenuItem extends Component {
    render() {
        var { item, key, authUser, dispatch, ...restProps } = this.props;
        // if(!authUser) return null;

        // var availablePermissions = authUser.permissions;

        // let isRender = false;
        
        // if(availablePermissions.indexOf(item.permission) >= 0 || !item.permission) isRender = true;
        // if(authUser.role_code == 'ADMIN') isRender = true;
        // else {
        //     if (item.isAdminOnly) isRender = false;
        // }

        // if(isRender) {
        //     return (
        //         <Menu.Item {...restProps} key={item.path} icon={item.icon}>{item.name}</Menu.Item>
        //     )
        // } else {
        //     return null;
        // }
        return (
            <Menu.Item {...restProps} key={item.path} icon={item.icon}>{item.name}</Menu.Item>
        )
    }
}

function mapStateToProps(state) {
    return {
        authUser: state.auth.authUser,
      
    }
}

export default connect(mapStateToProps,null)(MenuItem);