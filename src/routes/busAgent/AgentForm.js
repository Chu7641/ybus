import React, { useEffect, useRef, useState } from 'react';
import { Switch, Modal, Form, Input, DatePicker, Radio, Button, Space, Row, Col } from 'antd';
import moment from 'moment';
import IntlMessages from "../../components/IntlMessage";
import patientApi from '../../api/patient';
import agentApi from '../../api/agent';

const { TextArea } = Input;
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};

export default function AgentForm(props) {
    const isMount = useRef(false)
    const { onReload, onClose, currentData } = props;
    console.log(currentData);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        isMount.current = true;
    }, [])

    const handleSubmit = (values) => {
        console.log(values);
        setLoading(true);
        let dataUpdate = { ...values, id: currentData && currentData.id ? currentData.id : "", };
        let data = { ...values };

        //  console.log(data);
        // data.birthday = moment(data.birthday).format('YYYY-MM-DD');

        if (currentData) {
            agentApi.update(dataUpdate).
                then(res => {
                    console.log(data);
                    setLoading(false);
                    handleCancel()
                    onReload()
                }).
                catch(error => setLoading(false));
        } else {
            agentApi.create(data).
                then(res => {
                    setLoading(false);
                    handleCancel()
                    onReload()
                }).
                catch(error => setLoading(false));
        }
    }
    function disabledDate(current) {
        // Can not select days before today and today
        return current && current > moment().endOf('day');
    }

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const handleCancel = () => {
        form.resetFields();
        onClose()
    }

    const initialValue = {
        firstname: currentData && currentData.firstname ? currentData.firstname : "",
        lastname: currentData && currentData.lastname ? currentData.lastname : "",
        company: currentData && currentData.company ? currentData.company : "",
        telephone: currentData && currentData.telephone ? currentData.telephone : "",
        mobile: currentData && currentData.mobile ? currentData.mobile : "",
        state: currentData && currentData.state ? currentData.state : "",
        brandname: currentData && currentData.brandname ? currentData.brandname : "",
        alias: currentData && currentData.alias ? currentData.alias : "",
        desc: currentData && currentData.desc ? currentData.desc : "",
        address: currentData && currentData.address ? currentData.address : "",
        email: currentData && currentData.email ? currentData.email : "",
        website: currentData && currentData.website ? currentData.website : "",
        is_ready: currentData && currentData.is_ready ? currentData.is_ready : "",
        ordering : currentData && currentData.ordering  ? currentData.ordering  : "",
        message_offline_ready : currentData && currentData.message_offline_ready ? currentData.message_offline_ready : "",
        is_ready_time  : currentData && currentData.is_ready_time ? currentData.is_ready_time : "",
        message_offline_time : currentData && currentData.message_offline_time ? currentData.message_offline_time : "",
        time_limit : currentData && currentData.time_limit ? currentData.time_limit : "",


    }
    // console.log(currentData.state);
    return (
        <Modal
            title={currentData ? <IntlMessages id="global.edit" /> : <IntlMessages id="global.add" />}

            visible={true}
            destroyOnClose={true}
            onCancel={handleCancel}
            footer={null}
            width="60%"
        >
            <Form
                {...layout}
                form={form}
                initialValues={initialValue}
                labelAlign="left"
                onFinish={handleSubmit}
                onFinishFailed={onFinishFailed}

            >

                <Form.Item label={<IntlMessages id="global.firstname" />} name="firstname" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <Input />
                </Form.Item>

                <Form.Item label={<IntlMessages id="global.lastname" />} name="lastname" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <Input />
                </Form.Item>

                <Form.Item label={<IntlMessages id="global.company" />} name="company" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <Input />
                </Form.Item>

                <Form.Item label={<IntlMessages id="global.brandname" />} name="brandname" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <Input />
                </Form.Item>
                <Form.Item label={<IntlMessages id="global.alias" />} name="alias" rules={[{
                    required: false,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <Input />
                </Form.Item>
                <Form.Item label={<IntlMessages id="global.description" />} name="desc" rules={[{
                    required: false,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <Input />
                </Form.Item>
                <Form.Item label={<IntlMessages id="global.address" />} name="address" rules={[{
                    required: false,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <Input />
                </Form.Item>
                <Form.Item label={<IntlMessages id="global.email" />} name="email" rules={[{
                    type: 'email',
                    required: true,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <Input />
                </Form.Item>

                <Form.Item label={<IntlMessages id="global.telephone" />} name="telephone" rules={[{
                    required: false,
                }]}>
                    <Input />
                </Form.Item>

                <Form.Item label={<IntlMessages id="global.mobile" />} name="mobile" rules={[{
                    required: false,
                }]}>
                    <Input />
                </Form.Item>
                <Form.Item label={<IntlMessages id="global.website" />} name="website" rules={[{
                    required: false,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <Input />
                </Form.Item>
                <Form.Item label={<IntlMessages id="global.agent_order" />} name="ordering" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <Input type="number" />
                </Form.Item>


                <Form.Item label={<IntlMessages id="global.state" />} name="state" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <Switch checkedChildren={<IntlMessages id="global.enable" />} unCheckedChildren={<IntlMessages id="global.disable" />}
                        defaultChecked={initialValue.state}
                    />
                </Form.Item>
                <Row>
                    <Col span={8}>
                        <Form.Item labelCol={{ span: 12 }}
                            wrapperCol={{ span: 12 }} label={<IntlMessages id="global.ready_status" />} name="is_ready" rules={[{
                                required: true,
                                message: <IntlMessages id="global.requiredfield" />
                            }]}>
                            <Switch checkedChildren={<IntlMessages id="global.enable" />} unCheckedChildren={<IntlMessages id="global.disable" />}
                                defaultChecked={initialValue.state}
                            />
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }} label={<IntlMessages id="global.message_off" />} name="message_offline_ready" rules={[{
                                required: false,
                                message: <IntlMessages id="global.requiredfield" />
                            }]}>
                            <TextArea rows={2} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={8}>
                        <Form.Item labelCol={{ span: 12 }}
                            wrapperCol={{ span: 12 }} label={<IntlMessages id="global.time_limit_status" />} name="is_ready_time" rules={[{
                                required: true,
                                message: <IntlMessages id="global.requiredfield" />
                            }]}>
                            <Switch checkedChildren={<IntlMessages id="global.enable" />} unCheckedChildren={<IntlMessages id="global.disable" />}
                                defaultChecked={initialValue.state}
                            />
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }} label={<IntlMessages id="global.message_off_time" />} name="message_offline_time" rules={[{
                                required: false,
                                message: <IntlMessages id="global.requiredfield" />
                            }]}>
                            <TextArea rows={2} />
                        </Form.Item>
                    </Col>
                </Row>



                <Form.Item label={<IntlMessages id="global.time_limit" />} name="time_limit" rules={[{
                     required: false,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <Input />
                </Form.Item>
                <div style={{ textAlign: "end" }}>
                    <Space>
                        <Button type="default" onClick={handleCancel} loading={loading}>
                            <IntlMessages id="global.cancel" />
                        </Button>
                        <Button type="primary" htmlType="submit">
                            <IntlMessages id="global.save" />
                        </Button>
                    </Space>
                </div>
            </Form>

        </Modal>




    )
}
