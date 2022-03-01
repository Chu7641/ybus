import React, { useEffect, useRef, useState } from 'react';
import { Switch, Modal, Form, Input, DatePicker, Radio, Button, Space, TimePicker, Select } from 'antd';
import moment from 'moment';
import IntlMessages from "../../components/IntlMessage";
import roomrateApi from '../../api/roomrate';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

export default function CreateRoomrateForm(props) {
    const isMount = useRef(false)
    const { onReload, onClose, currentData } = props;
    // console.log(currentData);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        isMount.current = true;
    }, [])
    const { Option } = Select;

    const handleSubmit = (fieldsValue) => {
        const values = {
            ...fieldsValue,
            'start_date': fieldsValue['start_date'].format('YYYY-MM-DD'),
            'end_date': fieldsValue['end_date'].format('YYYY-MM-DD'),
        }
        // console.log(values);
        setLoading(true);
        let dataUpdate = { ...values, id: currentData && currentData.id ? currentData.id : "", };
        let data = { ...values,group:currentData.group };

        //   console.log(data);
        // if (currentData) {
            roomrateApi.create(data).
                then(res => {
                    // console.log(data);
                    setLoading(false);
                    handleCancel()
                    onReload()
                }).
                catch(error => setLoading(false));
        // } else {
        //     agentApi.create(data).
        //         then(res => {
        //             setLoading(false);
        //             handleCancel()
        //             onReload()
        //         }).
        //         catch(error => setLoading(false));
        // }
    }

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const handleCancel = () => {
        form.resetFields();
        onClose()
    }

    // const initialValue = {
    //     firstname: currentData && currentData.firstname ? currentData.firstname : "",
    //     lastname: currentData && currentData.lastname ? currentData.lastname : "",
    //     company: currentData && currentData.company ? currentData.company : "",
    //     telephone: currentData && currentData.telephone ? currentData.telephone : "",
    //     mobile: currentData && currentData.mobile ? currentData.mobile : "",
    //     state: currentData && currentData.state ? currentData.state : "",
    //     brandname: currentData && currentData.brandname ? currentData.brandname : "",
    //     alias: currentData && currentData.alias ? currentData.alias : "",
    //     desc: currentData && currentData.desc ? currentData.desc : "",
    //     address: currentData && currentData.address ? currentData.address : "",
    //     email: currentData && currentData.email ? currentData.email : "",
    //     website: currentData && currentData.website ? currentData.website : "",




    // }
    // console.log(currentData.state);
    return (
        <Modal
            title={ <IntlMessages id="global.add" />}

            visible={true}
            destroyOnClose={true}
            onCancel={handleCancel}
            footer={null}
            width="60%"
        >
            <Form
                {...layout}
                form={form}
                //  initialValues={initialValue}
                labelAlign="left"
                onFinish={handleSubmit}
                onFinishFailed={onFinishFailed}

            >

              
                <Form.Item
                    label={<IntlMessages id="property.start_date" />} name="start_date" rules={[{
                        required: true,
                        message: <IntlMessages id="global.requiredfield" />
                    }]}>
                    <DatePicker format='YYYY-MM-DD'/>
                </Form.Item>
                <Form.Item
                    label={<IntlMessages id="property.end_date" />} name="end_date" rules={[{
                        required: true,
                        message: <IntlMessages id="global.requiredfield" />
                    }]}>
                    <DatePicker format='YYYY-MM-DD'/>
                </Form.Item>
                <Form.Item label={<IntlMessages id="global.days" />} name="days" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Please select"

                    >
                        <Option value='0' key='0'>Sunday</Option>
                        <Option value='1' key='1'>Monday</Option>
                        <Option value='2' key='2'>Tuesday</Option>
                        <Option value='3' key='3'>Wednesday</Option>
                        <Option value='4' key='4'>Thursday</Option>
                        <Option value='5' key='5'>Friday</Option>
                        <Option value='6' key='6'>Saturday</Option>

                    </Select>
                </Form.Item>
                {/* <Form.Item label={<IntlMessages id="global.state" />} name="state" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <Switch checkedChildren={<IntlMessages id="global.show" />} unCheckedChildren={<IntlMessages id="global.hidden" />}
                        defaultChecked={initialValue.state}
                        />
                </Form.Item> */}
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
