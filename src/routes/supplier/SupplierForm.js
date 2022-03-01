import React, { useEffect, useRef, useState } from 'react';
import { Modal, Form, Input, DatePicker, Button, Radio, Switch, Select } from 'antd';
import BaseSelect from '../../components/Elements/BaseSelect';
import { createSupplier, updateSupplier } from '../../redux/actions/SuppliersAction';
import moment from 'moment';
import IntlMessages from "../../components/IntlMessage";
import Checkbox from 'antd/lib/checkbox/Checkbox';
const { Option } = Select;


const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};


export default function SupplierForm(props) {
    const isMount = useRef(false)
    const { onClose, currentData, open } = props;
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

        form.validateFields().then(values => {
            let data = { ...values };
            data.patient_id = props.patient_id;

            if (currentData) {
                (updateSupplier(currentData.id, data)).
                    then(() => {
                        setLoading(false);
                        handleCancel()
                        props.onReload()
                    }).
                    catch(() => setLoading(false));
            } else {
                createSupplier(data).
                    then(() => {
                        setLoading(false);
                        handleCancel();
                        props.onReload()
                    }).
                    catch(() => setLoading(false));
            }
        });
    }

    console.log("current", currentData);

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const handleCancel = () => {
        form.resetFields();
        onClose()
    }

    let initialValue = {
        clinic_id: currentData && currentData.clinic_id ? currentData.clinic_id : "",
        name: currentData && currentData.name ? currentData.name : "",
        email: currentData && currentData.email ? currentData.email : "",
        mobile: currentData && currentData.mobile ? currentData.mobile : "",
        description: currentData && currentData.description ? currentData.description : "",
        website: currentData && currentData.website ? currentData.website : "",
        contact_name: currentData && currentData.contact_name ? currentData.contact_name : "",
        address: currentData && currentData.address ? currentData.address : ""
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

                <Form.Item label={<IntlMessages id="global.suppliers" />} name="name" rules={[{
                    required: false,
                }]}>
                    <Input />
                </Form.Item>
                <Form.Item label={<IntlMessages id="global.contact_name" />} name="contact_name" rules={[{
                    required: false,
                }]}>
                    <Input />
                </Form.Item>

                <Form.Item label={<IntlMessages id="global.email" />} name="email" rules={[{
                    required: false,
                    message: <IntlMessages id="global.requirefield" />
                }, {
                    type: 'email',
                    message:<IntlMessages id="global.requirefield" />
                }]}>
                    <Input />
                </Form.Item>


                <Form.Item label={<IntlMessages id="global.mobile" />} name="mobile" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requirefield" />
                }]}>
                    <Input />
                </Form.Item>


                <Form.Item label={<IntlMessages id="global.website" />} name="website" rules={[{
                    required: false,
                    message: <IntlMessages id="global.requirefield" />
                }]}>
                   <Input />
                </Form.Item>



                <Form.Item label={<IntlMessages id="global.address" />} name="address" rules={[{
                    required: false,
                }]}>

                    <Input />

                </Form.Item>

                <Form.Item label={<IntlMessages id="global.description" />} name="description" rules={[{
                    required: false,
                }]}>
                    <Input />
                </Form.Item>

              




            </Form>

        </Modal>




    )
}
