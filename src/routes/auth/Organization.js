
import { Button, Card, Col, Form, Input, Menu, Row, Select, Tag, Typography, message, List, Spin } from 'antd';
//import moment from "moment";
import React, { Component, useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import IntlMessages from '../../components/IntlMessage';
import PageTitle from '../../components/PageTitle';
import UploadAvatar from '../../components/UploadAvatar';
import LayoutContent from '../../components/LayoutContent';
import clinicApi from '../../api/clinic';
import { useIntl } from 'react-intl'
import moment from 'moment-timezone';
import store from "../../redux/store";
import { GET_CLINIC_DETAIL } from "../../redux/types";

const { Option } = Select;
const { Title, Text } = Typography;



export default function Organization() {

    const timezones = moment.tz.names();

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true)
    const [item, setItem] = useState(null)
    const authUser = useSelector(state => state.auth.authUser);
    const clinic = useSelector(state => state.clinic.clinic);

    const intl = useIntl();

    useEffect(() => {
        if (clinic) setLoading(false);
    }, [clinic]);


    const handleSubmit = (values) => {

        var data = {
            ...values,

        };

        clinicApi.update(clinic.id, data).then((res) => {

            store.dispatch({ type: GET_CLINIC_DETAIL, payload: res });
            message.success({ content: intl.formatMessage({ id: "global.save_success" }) });
            // this.formRef.current.resetFields();
        }).catch(() => {
            message.error({ content: intl.formatMessage({ id: "global.save_failed" }) })
        })
    }





    const initialValue = {

        name: clinic && clinic.name ? clinic.name : "",
        alias: clinic && clinic.alias ? clinic.alias : "",
        address: clinic && clinic.address ? clinic.address : "",
        telephone: clinic && clinic.telephone ? clinic.telephone : "",
        mobile: clinic && clinic.mobile ? clinic.mobile : "",
        email: clinic && clinic.email ? clinic.email : "",
        website: clinic && clinic.website ? clinic.website : "",

    }




    return (
        <>
            <LayoutContent>
                <PageTitle title={<IntlMessages id="global.account_information" />} />

                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        <Card hoverable>

                            {loading ? <Spin></Spin> : <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                                initialValues={initialValue}

                            >
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Form.Item
                                            label={<IntlMessages id="global.name" />}
                                            name="name"
                                            rules={[
                                                { required: true, message: <IntlMessages id="global.requiredfield" /> }
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col >
                                    <Col span={12}>
                                        <Form.Item
                                            label={<IntlMessages id="clinic.alias" />}
                                            name="alias"
                                            rules={[
                                                { required: false, message: <IntlMessages id="global.requiredfield" /> }
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
                                            label={<IntlMessages id="global.telephone" />}
                                            name="telephone"
                                            rules={[
                                                {
                                                    required: false,

                                                }
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={<IntlMessages id="global.address" />}
                                            name="address"
                                            rules={[
                                                {
                                                    required: false,
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
                                            label={<IntlMessages id="global.website" />}
                                            name="website"
                                            rules={[
                                                {
                                                    required: false,
                                                    message: <IntlMessages id="global.requiredfield" />
                                                }
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label={<IntlMessages id="global.license" />}
                                            name="license"
                                            rules={[
                                                {
                                                    required: false,
                                                    message: <IntlMessages id="global.requiredfield" />
                                                }
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>

                                </Row>



                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={loading}>
                                        <IntlMessages id="global.save" />
                                    </Button>
                                </Form.Item>
                            </Form>}
                        </Card>

                    </Col>

                </Row>




            </LayoutContent>


        </>
    )

}

