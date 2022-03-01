
import { Button, Card, Col, Form, Input, Menu, Row, Select, Tag, Typography, message, List } from 'antd';
//import moment from "moment";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import IntlMessages from '../../components/IntlMessage';
import PageTitle from '../../components/PageTitle';
import UploadAvatar from '../../components/UploadAvatar';
import { updateAuthUser } from '../../redux/actions/AuthActions';
import { updateUser, changePassword } from '../../redux/actions/UserAction';
import LayoutContent from '../../components/LayoutContent';
import { injectIntl } from 'react-intl'
import moment from 'moment-timezone';

const { Option } = Select;
const { Title, Text } = Typography;


class Profile extends Component {

    formatMessage = this.props.intl.formatMessage;
    formRef = React.createRef();
    timezones = moment.tz.names();


    state = {
        loadingChangePW: false,
        loadingupdateinfo: false,
        id_image: [],
        activeTab: 'general',
        open: false,

        loading: true
    }
    formRef = React.createRef();

    UNSAFE_componentWillReceiveProps(nextProps, nextState) {

        if (nextProps.authUser) {

            this.setState({
                id_image: nextProps.authUser.id_image ? nextProps.authUser.id_image : [],

            });
        }
    }
    async componentDidMount() {

        this.setState({ loading: false })
    }

    handleSubmit = (values) => {

        console.log(values.new_password);

        //this.setState({ loadingChangePW: true });
        changePassword(values).then(() => {
            message.success({ content: this.formatMessage({ id: "global.save_success" }) });
            this.formRef.current.resetFields();
            this.setState({ loadingChangePW: false })
        }).catch(() => {
            message.error({ content: this.formatMessage({ id: "global.save_failed" }) })
            this.setState({ loadingChangePW: false })
        })
    }
    getValueChosseId = (data) => {

        this.setState({
            ...this.state,
            id_image: data
        });
    };
    handleSubmitInfo = (values) => {
        this.setState({
            loadingupdateinfo: true
        })
        var data = {
            ...values,

        };

        updateUser(this.props.authUser.id, data).then(() => {
            message.success({ content: this.formatMessage({ id: "global.save_success" }) });
            this.formRef.current.resetFields();
            this.setState({ loadingupdateinfo: false })
        }).catch(() => {
            message.error({ content: this.formatMessage({ id: "global.save_failed" }) })
            this.setState({ loadingupdateinfo: false })
        })
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
        var { loadingChangePW, loadingupdateinfo } = this.state;
        var { authUser } = this.props;
        let validate = this.formatMessage;

        return (
            <>
                <LayoutContent>
                    <PageTitle title={<IntlMessages id="global.account_information" />} />
                    <Row gutter={24}>
                        <Col lg={6} sm={24}>
                            <Card hoverable className="card-without-padding">
                                <div className="your-img" >
                                    <UploadAvatar />
                                    <Title level={3} className="your-name">{this.setName(authUser)}</Title>
                                    {/* <Title level={5} className="your-name">{authUser ? authUser.email : null}</Title> */}
                                    <Tag className="mt-2">{authUser.email}</Tag>
                                </div>

                                <List>
                                    <List.Item>
                                        <Text >
                                            <IntlMessages id="global.your_plan" />: {authUser.plan}
                                        </Text>
                                    </List.Item>
                                    <List.Item>
                                        <Text >
                                            <IntlMessages id="global.trial_end" />:
                                            {moment.tz(authUser.trial_end, authUser.timezone).format('DD-MM-YYYY')}

                                        </Text>
                                    </List.Item>

                                    <List.Item>
                                        <Button type="primary" >
                                            <IntlMessages id="global.upgrade" />
                                        </Button>
                                    </List.Item>
                                </List>


                            </Card>
                        </Col>
                        <Col>
                            <Row gutter={[24, 24]}>
                                <Col span={24}>
                                    <Card hoverable>
                                        <Typography.Title level={4}><IntlMessages id="global.account_information" /></Typography.Title>

                                        <Form
                                            ref={this.formRef}
                                            layout="vertical"
                                            onFinish={this.handleSubmitInfo}
                                            ref={this.formRef}
                                            initialValues={authUser ?
                                                {
                                                    ...authUser,

                                                }
                                                : null}
                                        >
                                            <Row gutter={24}>
                                                <Col span={12}>
                                                    <Form.Item
                                                        label={<IntlMessages id="global.firstname" />}
                                                        name="firstname"
                                                        rules={[
                                                            { required: true, message: <IntlMessages id="global.requiredfield" /> }
                                                        ]}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </Col >
                                                <Col span={12}>
                                                    <Form.Item
                                                        label={<IntlMessages id="global.lastname" />}
                                                        name="lastname"
                                                        rules={[
                                                            { required: true, message: <IntlMessages id="global.requiredfield" /> }
                                                        ]}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={24}>
                                                <Col span={12}>
                                                    <Form.Item
                                                        label={<IntlMessages id="global.email" />}
                                                        name="email"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: <IntlMessages id="global.requiredfield" />
                                                            }
                                                        ]}
                                                    >
                                                        <Input disabled={authUser && authUser.email_verified === 1 ? true : false} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item
                                                        label={<IntlMessages id="global.mobile" />}
                                                        name="mobile"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: <IntlMessages id="global.requiredfield" />
                                                            }
                                                        ]}
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                            </Row>

                                            <Row gutter={24}>
                                                <Col span={12}>
                                                    <Form.Item
                                                        label={<IntlMessages id="global.language" />}
                                                        name="language"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: <IntlMessages id="global.requiredfield" />
                                                            }
                                                        ]}
                                                    >

                                                        <Select style={{ width: '100%' }}>
                                                            <Option value="en-US">English</Option>
                                                            <Option value="vi-VN">Vietnamese</Option>
                                                        </Select>

                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item
                                                        label={<IntlMessages id="global.currency" />}
                                                        name="currency"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: <IntlMessages id="global.requiredfield" />
                                                            }
                                                        ]}
                                                    >
                                                        <Select style={{ width: '100%' }}>
                                                            <Option value="USD">US Dollar</Option>
                                                            <Option value="EUR">Euro</Option>
                                                            <Option value="VND">Vietnam Dong</Option>
                                                        </Select>


                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={24}>
                                                <Col span={12}>
                                                    <Form.Item
                                                        label={<IntlMessages id="global.timezone" />}
                                                        name="timezone"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: <IntlMessages id="global.requiredfield" />
                                                            }
                                                        ]}
                                                    >

                                                        <Select
                                                            showSearch

                                                            style={{ width: '100%' }}
                                                            filterOption={(input, option) =>
                                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                            }
                                                        >

                                                            {this.timezones.map(value => (
                                                                <Option key={value}>{value}</Option>
                                                            ))}

                                                        </Select>


                                                    </Form.Item>
                                                </Col>

                                            </Row>


                                            <Form.Item>
                                                <Button type="primary" htmlType="submit" loading={loadingupdateinfo}>
                                                    <IntlMessages id="global.save" />
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </Card>

                                </Col>
                                <Col span={24}>

                                    <Card hoverable>
                                        <Typography.Title level={4}><IntlMessages id="global.changepassword" /></Typography.Title>
                                        <Form
                                            layout="vertical"
                                            onFinish={this.handleSubmit}
                                            ref={this.formRef}
                                        >


                                            <Form.Item
                                                label={<IntlMessages id="global.current_password" />}
                                                name="old_password"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: <IntlMessages id="global.requiredfield" />
                                                    }
                                                ]}
                                            >
                                                <Input.Password />
                                            </Form.Item>

                                            <Form.Item
                                                label={<IntlMessages id="global.new_password" />}
                                                name="new_password"
                                                rules={[
                                                    { required: true, message: <IntlMessages id="global.requiredfield" /> },
                                                    { min: 6, message: <IntlMessages id="global.password_min_charactor" /> }
                                                ]}
                                            >
                                                <Input.Password />
                                            </Form.Item>

                                            <Form.Item
                                                label={<IntlMessages id="global.confirm_new_password" />}
                                                name="confirm_new_password"
                                                dependencies={['new_password']}
                                                hasFeedback
                                                rules={[
                                                    { min: 6, message: <IntlMessages id="global.password_min_charactor" /> },
                                                    {
                                                        required: true,
                                                        message: <IntlMessages id="global.requiredfield" />,
                                                    },

                                                    ({ getFieldValue }) => ({
                                                        validator(_, value) {
                                                            if (!value || getFieldValue('new_password') === value) {
                                                                return Promise.resolve();
                                                            }
                                                            return Promise.reject(validate({ id: "global.password_not_match" }));
                                                        },
                                                    }),
                                                ]}
                                            >
                                                <Input.Password />
                                            </Form.Item>


                                            <Form.Item>
                                                <Button type="primary" htmlType="submit" loading={loadingChangePW}>
                                                    <IntlMessages id="global.save" />
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </Card>
                                </Col>
                            </Row>



                        </Col>
                    </Row>
                </LayoutContent>


            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        authUser: state.auth.authUser,
        config: state.config,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        changePassword: (data) => dispatch(changePassword(data)),
        updateAuthUser: (data) => dispatch(updateAuthUser(data)),
    }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Profile));