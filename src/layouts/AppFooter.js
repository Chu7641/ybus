import React, { Component } from 'react'
import { Layout } from 'antd';

var { Footer } = Layout;

export default class AppFooter extends Component {
    render() {
        return (
            <Footer style={{ textAlign: 'center' }}>Yobuma Bus</Footer>
        )
    }
}
