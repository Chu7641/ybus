import React, { useEffect, useRef, useState } from 'react';
import { Modal, Form, Input, DatePicker, Radio, Button, Row, Col } from 'antd';
import BaseSelect from '../../components/Elements/BaseSelect';
import moment from 'moment';
import IntlMessages from "../../components/IntlMessage";
import { useSelector, useDispatch } from 'react-redux';
import doctorApi from '../../api/doctor';


const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

export default function DoctorForm(props) {
    const isMount = useRef(false)
    const { onClose, currentData, open } = props;

    console.log("current", currentData);

    const [form] = Form.useForm();


    const [loading, setLoading] = useState(false)


    useEffect(() => {
        isMount.current = true;


        return () => {
            isMount.current = false
        }
    }, [])


    const handleSubmit = () => {


        setLoading(true);
        //data.birthday = moment(data.birthday).format('YYYY-MM-DD');
        form.validateFields().then(values => {
            let data = { ...values };
            if (currentData) {

                doctorApi.update(currentData.id, data).
                    then(res => {
                        setLoading(false);
                        handleCancel();
                        props.onReload();
                    }).
                    catch(error => setLoading(false));
            } else {
                doctorApi.create(data).
                    then(res => {
                        setLoading(false);
                        handleCancel();
                        props.onReload();
                    }).
                    catch(error => setLoading(false));
            }
        });
    }


    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const handleCancel = () => {
        form.resetFields();
        onClose()
    }
    const handleOk = () => {

        onClose()
    }

    const initialValue = {
        gender: currentData && currentData.gender ? currentData.gender : 1,
        firstname: currentData && currentData.firstname ? currentData.firstname : "",
        lastname: currentData && currentData.lastname ? currentData.lastname : "",
        email: currentData && currentData.email ? currentData.email : "",
        birthday: currentData && currentData.birthday ? moment(currentData.birthday) : moment('2005-01-01', 'YYYY-MM-DD'),
        mobile: currentData && currentData.mobile ? currentData.mobile : "",
        address: currentData && currentData.address ? currentData.address : "",
        alias: currentData && currentData.alias ? currentData.alias : "",
        status: currentData && currentData.status ? currentData.status : false,
    }

    return (
        <Modal
            title={currentData ? <IntlMessages id="global.edit" /> : <IntlMessages id="global.add" />}
            visible={open}
            destroyOnClose={true}
            onCancel={handleCancel}
            width="60%"
            onOk={handleSubmit}


            footer={[
                <Button key="back" type="default" onClick={handleCancel} loading={loading}>
                    {<IntlMessages id="global.cancel" />}
                </Button>,
                <Button key="submit" type="primary" htmlType="submit" onClick={handleSubmit}>
                    {<IntlMessages id="global.save" />}
                </Button>,
            ]}
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
                    message: <IntlMessages id="global.requirefield" />
                }]}>
                    <Input />
                </Form.Item>

                <Form.Item label={<IntlMessages id="global.lastname" />} name="lastname" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requirefield" />
                }]}>
                    <Input />
                </Form.Item>

                <Form.Item label={<IntlMessages id="global.alias" />} name="alias" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requirefield" />
                }]}>
                    <Input />
                </Form.Item>

                <Form.Item label={<IntlMessages id="global.birthday" />} name="birthday" >
                    <DatePicker format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item label={<IntlMessages id="global.mobile" />} name="mobile" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requirefield" />
                }]}>
                    <Input />
                </Form.Item>

                <Form.Item label={<IntlMessages id="global.email" />} name="email" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requirefield" />
                }]}>
                    <Input />
                </Form.Item>

                <Form.Item label={<IntlMessages id="global.address" />} name="address" rules={[{
                    required: false,
                }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="status" label={<IntlMessages id="global.status" />}>
                    <Radio.Group>
                        <Radio value={0}><IntlMessages id="global.inactive" /></Radio>
                        <Radio value={1}><IntlMessages id="global.active" /></Radio>
                    </Radio.Group>
                </Form.Item>


                {/* <Button type="default" onClick={handleCancel} className="mr-2" loading={loading}>
                    {<IntlMessages id="global.cancel" />}
                </Button>
                <Button type="primary" htmlType="submit">
                    {<IntlMessages id="global.save" />}
                </Button> */}

            </Form>

        </Modal>




    )
}
