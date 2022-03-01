import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Form, Button, Input, Checkbox, Card, Row, Col, Space, Typography } from 'antd';
import { LockOutlined, LockTwoTone, MailOutlined, MailTwoTone } from '@ant-design/icons';
import IntlMessages from "../../components/IntlMessage";

// actions
import { login } from '../../redux/actions/AuthActions';
const { Text } = Typography;

class Login extends Component {


    state = {
        loading: false
    }

    onFinish = values => {
        var dataSub = {

            username: values.username,
            password: values.password
        }
        var a = this;
        this.setState({ loading: true }, () => {
            a.props.login(dataSub).then(res => a.setState({ loading: false })).catch(err => a.setState({ loading: false }))

        })

    };

    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    render() {
        var { authUser } = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 0 },
                sm: { span: 0 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 },
            },
        };

        if (authUser) return <Redirect to='/' />;

        return (
            <div className="fullscreen">
                <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
                    <Col xs={24} xl={8}>
                        <Card>

                            <Row type="flex" justify="center">
                                {<img src={require('../../assets/img/logo.png')} className="login-logo" />}
                                <div style={{

                                }}></div>
                            </Row>
                            <Row type="flex" justify="center">

                                <Text strong>Move Smart</Text>
                            </Row>
                            <p></p>
                            <Form
                                {...formItemLayout}
                                layout="vertical"
                                initialValues={{
                                    remember: true,
                                }}
                                onFinish={this.onFinish}
                                onFinishFailed={this.onFinishFailed}
                                size="large"
                            >
                                <Form.Item
                                    name="username"
                                    rules={[

                                        // {
                                        //     type: 'text',
                                        //     message: <IntlMessages id="global.emai_not_valid" />,
                                        // },
                                        {
                                            required: true,
                                            message: <IntlMessages id="global.emai_required" />,
                                        },
                                    ]}
                                >
                                    <Input prefix={<MailTwoTone className="site-form-item-icon" />}

                                        placeholder="Username"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[


                                        {
                                            required: true,
                                            message: <IntlMessages id="global.password_required" />,
                                        },
                                    ]}
                                >
                                    <Input.Password prefix={<LockTwoTone className="site-form-item-icon" />} placeholder="Password" />
                                </Form.Item>

                                {/* <Row justify="space-between">
                                    <Col></Col>
                                    <Col><Link to='/resetpassword'><IntlMessages id="global.forgot_password" /></Link></Col>
                                </Row> */}

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="login-form-button"
                                        loading={this.state.loading}
                                    >
                                        <IntlMessages id="global.signin" />
                                    </Button>
                                </Form.Item>


                                {/* <Form.Item>

                                    <Link to='/signup'>
                                        <Button
                                            type="secondary"
                                            htmlType="button"
                                            className="login-form-button"
                                        >
                                            <IntlMessages id="global.signup" />
                                        </Button>

                                    </Link>


                                </Form.Item> */}


                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        authUser: state.auth.authUser
    }
}

function mapDispatchToProps(dispatch) {
    return {
        login: (data) => dispatch(login(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);