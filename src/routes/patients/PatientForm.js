import React, { useEffect, useRef, useState } from 'react';
import { Modal, Form, Input, DatePicker, Radio, Button, Space } from 'antd';
import moment from 'moment';
import IntlMessages from "../../components/IntlMessage";
import patientApi from '../../api/patient';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

export default function PatientForm(props) {
    const isMount = useRef(false)
    const { onClose, currentData } = props;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        isMount.current = true;
    }, [])

    const handleSubmit = (values) => {

        setLoading(true);
        let data = { ...values };
        data.birthday = moment(data.birthday).format('YYYY-MM-DD');

        if (currentData) {
            patientApi.update(currentData.id, data).
                then(res => {
                    setLoading(false);
                    handleCancel()
                    props.onReload()
                }).
                catch(error => setLoading(false));
        } else {
            patientApi.create(data).
                then(res => {
                    setLoading(false);
                    handleCancel()
                    props.onReload()
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
        gender: currentData && currentData.gender ? currentData.gender : 1,
        firstname: currentData && currentData.firstname ? currentData.firstname : "",
        lastname: currentData && currentData.lastname ? currentData.lastname : "",
        birthday: currentData && currentData.birthday ? moment(currentData.birthday) : moment().subtract(5, 'years'),
        mobile: currentData && currentData.mobile ? currentData.mobile : "",
        address: currentData && currentData.address ? currentData.address : "",
        story: currentData && currentData.story ? currentData.story : "",
        description: currentData && currentData.description ? currentData.description : ""
    }

    return (
        <Modal
            title={currentData ? "Sửa bệnh nhân" : "Thêm bệnh nhân"}
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

                <Form.Item label={<IntlMessages id="global.birthday" />} name="birthday" >
                    <DatePicker

                        disabledDate={disabledDate}
                        format="DD/MM/YYYY" />
                </Form.Item>
                <Form.Item label={<IntlMessages id="global.gender" />} name="gender" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <Radio.Group
                    >
                        <Radio value={1}><IntlMessages id="global.male" /></Radio>
                        <Radio value={0}><IntlMessages id="global.female" /></Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label={<IntlMessages id="global.mobile" />} name="mobile" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <Input />
                </Form.Item>

                <Form.Item label={<IntlMessages id="global.address" />} name="address" rules={[{
                    required: false,
                }]}>
                    <Input />
                </Form.Item>

                <Form.Item label={<IntlMessages id="global.story" />} name="story" rules={[{
                    required: false,
                }]}>
                    <Input />
                </Form.Item>

                <Form.Item label={<IntlMessages id="global.description" />} name="description" rules={[{
                    required: false,
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
