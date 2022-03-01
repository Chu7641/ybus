import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Layout, Menu } from "antd";
import agentApi from "../api/agent";
import menu from "../menu";
import MenuGroupItem from "../components/Menu/MenuGroupItem";
import MenuItem from "../components/Menu/MenuItem";
import { Spin } from "antd";
import IntlMessages from "../components/IntlMessage";
import { HddOutlined } from "@ant-design/icons";
class AppSidebar extends Component {
  state = {
    menu2: [],
    collapsed: false,
    loading: false,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    let result = await agentApi.getAll();
    let data = result.data.list.map((res, index) => {
      return {
        path: `/app/companies/${res.id}`,
        name: res.firstname + " " + res.lastname,
        permission: null,
      };
    });

    // console.log(data);

    let menu2 = [...menu];
    menu2.splice(3, 0, {
      path: "/app/companies",
      name: <IntlMessages id="sidebar.companies" />,
      icon: <HddOutlined />,
      permission: null,
      children: data,
    });
    // console.log(menu);
    this.setState({
      menu2: menu2,
      loading: false,
    });
  }
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  onClickMenu(key) {
    this.props.history.push(key);
  }

  render() {
    var { pathname } = this.props.location;
    var { collapsed, loading, menu2 } = this.state;

    return (
      <Spin spinning={loading}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          style={{ borderRight: 0 }}
          onClick={({ item, key, keyPath }) => this.onClickMenu(key)}
        >
          {menu2.map((item, key) => {
            if (item.children) {
              return <MenuGroupItem item={item} key={key} />;
            } else {
              return <MenuItem item={item} key={item.path} />;
            }
          })}
        </Menu>
      </Spin>
    );
  }
}

function mapStateToProps(state) {
  return {
    authUser: state.auth.authUser,
    config: state.config,
  };
}

export default withRouter(connect(mapStateToProps)(AppSidebar));
