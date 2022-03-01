import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import {
  Layout,
  Modal,
  Drawer,
  Button,
  Avatar,
  Row,
  Col,
  Popover,
  Divider,
  Space,
  Typography,
} from "antd";
import ClinicSwitcher from "../components/ClinicSwitcher";
import {
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { isMobile, MobileView, isBrowser } from "react-device-detect";
// actions
import { logout } from "../redux/actions/AuthActions";
import AppDrawer from "./AppDrawer";
import IntlMessages from "../components/IntlMessage";
import Search from "antd/lib/input/Search";
import { injectIntl } from "react-intl";
const { Text } = Typography;

const { Header } = Layout;
const { confirm } = Modal;

class AppHeader extends Component {
  state = {
    visible: false,
  };

  toggleDrawer(visible) {
    this.setState({ visible });
  }

  onLogout() {
    confirm({
      title: "Logout confirm",
      icon: <ExclamationCircleOutlined />,
      content: "You will navigate to login page!",
      okText: "OK",
      cancelText: "Cancel",
      onOk: () => {
        this.props.logout().then(() => {
          window.location.href = "/login";
        });
      },
    });
  }
  setName(account) {
    if (account) {
      var name = "";
      if (account.firstname) name = name + " " + account.firstname;
      if (account.lastname) name = name + " " + account.lastname;
      if (name) return name;
      return "Người dùng";
    }
  }
  render() {
    var { visible } = this.state;
    var { authUser } = this.props;
    const prefix = (
      <SearchOutlined
        style={{
          fontSize: 16,
          color: "#1890ff",
        }}
      />
    );

    const { formatMessage } = this.props.intl;
    return (
      <Header className="site-header-background">
        <Row justify="space-between">
          <Col>
            <Row>
              <ClinicSwitcher></ClinicSwitcher>
            </Row>
          </Col>
          <Col>
            <Row align="middle" justify="space-around">
              {/* <Col>
                                <Row align="middle">
                                    <Search
                                        placeholder={formatMessage({ id: 'global.search_placeholder' })}

                                        size="large"
                                        prefix={prefix}

                                    />
                                </Row>

                            </Col> */}

              <Col>
                <Divider type="vertical" style={{ height: "1.5em" }}></Divider>
                {isMobile ? (
                  <Button
                    type="link"
                    icon={<MenuFoldOutlined className="header-icons" />}
                    onClick={() => this.toggleDrawer(true)}
                  />
                ) : (
                  <React.Fragment>
                    <Space>
                      <Popover
                        trigger="click"
                        className="header-actions"
                        placement="bottomRight"
                        content={
                          <>
                            <Row gutter={[20, 20]}>
                              <Col>
                                <Row align="middle" justify="space-around">
                                  <Avatar
                                    style={{ backgroundColor: "#f56a00" }}
                                  >
                                    {authUser.lastname.charAt(0)}
                                  </Avatar>
                                </Row>
                              </Col>
                              <Col>
                                <Text strong>
                                  {authUser.lastname + " " + authUser.firstname}
                                </Text>
                                <br></br>
                                <Text
                                  style={{ fontSize: "12px" }}
                                  type="secondary"
                                >
                                  {authUser.email}
                                </Text>
                              </Col>
                            </Row>
                            <Divider
                              style={{
                                marginTop: "10px",
                                marginBottom: "10px",
                              }}
                            />
                            <Link to="/app/profile">
                              <Button type="link">
                                <IntlMessages id="global.account_information" />
                              </Button>
                            </Link>
                            {/* <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                                                            <Link to='/app/organization'>
                                                                <Button type="link">
                                                                    {authUser.clinic}
                                                                </Button>
                                                            </Link>
                                                            <Divider style={{ marginTop: '10px', marginBottom: '10px' }} /> */}
                            <Divider>
                              <Button
                                type="link"
                                onClick={() => this.onLogout()}
                              >
                                <Space>
                                  <IntlMessages id="global.signout" />
                                </Space>
                              </Button>
                            </Divider>
                          </>
                        }
                        title={null}
                      >
                        {authUser.image ? (
                          <Avatar
                            src={
                              this.props.config.url_asset_root + authUser.image
                            }
                          />
                        ) : (
                          <Avatar style={{ backgroundColor: "#f56a00" }}>
                            {authUser.lastname.charAt(0)}
                          </Avatar>
                        )}
                      </Popover>
                      <Text strong>
                        {authUser.lastname + " " + authUser.firstname}
                      </Text>
                    </Space>
                  </React.Fragment>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
        <AppDrawer visible={visible} onClose={() => this.toggleDrawer(false)} />
      </Header>
    );
  }
}

function mapStateToProps(state) {
  return {
    authUser: state.auth.authUser,
    config: state.config,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logout()),
  };
}

export default injectIntl(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(AppHeader))
);
