import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Input, Result, Card, Row, Col, Typography } from 'antd';
import userApi from '../../api/user';
import { LockOutlined, LockTwoTone, MailOutlined, MailTwoTone } from '@ant-design/icons';
// actions

import IntlMessages from "../../components/IntlMessage";

export default function ResetPassword() {

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false)

    const onFinish = (values) => {
        setLoading(true)
        userApi.resetPassword(values).then(() => {
            setSuccess(true);
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };


    // if (authUser) return <Redirect to='/' />

    return (
        <div className="fullscreen">
            <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>

                <Col xs={24} xl={8}>
                    {
                        success ? (
                            <Card >
                                <Result
                                    status="success"
                                    title="Chúng tôi đã gửi thông tin lấy lại mật khẩu vào email của bạn"
                                    subTitle="Vui lòng kiểm tra email và làm theo hướng dẫn để lấy lại mật khẩu"
                                    extra={[
                                        <Link to='/login' key="login">
                                            <Button type="primary" key="console">
                                                <IntlMessages id="signup.back_to_login" />
                                            </Button>
                                        </Link>
                                    ]}
                                />
                            </Card>
                        ) : (
                                <Card >
                                    <Row justify="center">
                                        <Typography.Title level={4}><IntlMessages id="global.recover_password" /></Typography.Title>

                                    </Row>
                                    <Form

                                        layout="vertical"
                                        initialValues={{
                                            remember: true,
                                        }}
                                        onFinish={onFinish}
                                        onFinishFailed={onFinishFailed}
                                    >
                                        <Form.Item
                                            label={<IntlMessages id="global.email_reset_password" />}
                                            name="email"

                                            rules={[
                                                {
                                                    type: 'email',
                                                    message: <IntlMessages id="global.emai_not_valid" />,
                                                },
                                                {
                                                    required: true,
                                                    message: <IntlMessages id="global.requiredfield" />,
                                                },
                                            ]}
                                        >
                                            <Input size='large' prefix={<MailTwoTone className="site-form-item-icon" />} />
                                        </Form.Item>

                                        <Form.Item>
                                            <Row justify="center">
                                                <Button type="primary" htmlType="submit" size='large' loading={loading}>
                                                    <IntlMessages id="global.continue" />
                                                </Button>
                                            </Row>
                                        </Form.Item>
                                    </Form>
                                    <Row justify='center'>
                                        <Link to='/login' key="login">

                                            <IntlMessages id="signup.back_to_login" />

                                        </Link>

                                    </Row>
                                </Card>
                            )
                    }
                </Col>

            </Row>
        </div>
    )

}

