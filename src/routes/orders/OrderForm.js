import React, { useEffect, useRef, useState } from 'react';
import { Modal, Form, Input, DatePicker, Radio, Button, Row, Col, Space, Select, message, InputNumber } from 'antd';
import BaseSelect from '../../components/Elements/BaseSelect';
import moment from 'moment';
import IntlMessages from "../../components/IntlMessage";
import { useSelector, useDispatch } from 'react-redux';
import patientApi from "../../api/patient";
import serviceApi from "../../api/service";
import supplierApi from "../../api/supplier";
import { useIntl } from 'react-intl'
import orderApi from '../../api/order';
import JSelect from '../../components/Elements/JSelect';
const { Option } = Select;
const { TextArea } = Input;


const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

export default function OrderForm(props) {
    const isMount = useRef(false)
    const { onClose, currentData, open } = props;


    const [form] = Form.useForm();

    const intl = useIntl();

    const [loading, setLoading] = useState(false)
    const [patients, setPatients] = useState([])
    const [suppliers, setSuppliers] = useState([])
    const [services, setServices] = useState([])


    useEffect(() => {
        isMount.current = true;
        async function fetchData() {

            if (isMount) {
                var filter = {
                    page: 1,
                    limit: 1000,
                    keyword: "",
                    order_by: 'id',
                    order_dir: 'DESC',


                };
                setLoading(true);
                let items = await patientApi.getAll(filter);
                let services = await serviceApi.getAll(filter);
                let suppliers = await supplierApi.getAll(filter);

                setServices(services.data);
                setSuppliers(suppliers.data);
                setPatients(items.data);
                setLoading(false);

            }
        }
        fetchData();
        return () => {
            isMount.current = false
        }

    }, [])



    const handleSubmit = () => {

        setLoading(true);
        console.log('handel submit');
        form.validateFields().then(values => {

            console.log('values', values);

            let data = { ...values };

            if (currentData) {
                orderApi.update(currentData.id, data).
                    then(res => {
                        setLoading(false);
                        message.success({ content: intl.formatMessage({ id: "global.save_success" }) });
                        handleCancel()
                        props.onReload()
                    }).
                    catch(() => {
                        setLoading(false);
                        message.error({ content: intl.formatMessage({ id: "global.save_failed" }) });

                    })

            } else {
                orderApi.create(data).
                    then(res => {
                        setLoading(false);
                        handleCancel();
                        props.onReload()
                    }).
                    catch(() => {
                        setLoading(false);
                        message.error({ content: intl.formatMessage({ id: "global.save_failed" }) });

                    })
            }
        }).catch(error => {
            console.log(error)
        });
    }


    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const handleCancel = () => {
        form.resetFields();
        onClose()
    }

    const disabledDate = (current) => {
        return current && current <= moment().endOf('day');
    }

    const initialValue = {
        patient_id: currentData && currentData.patient_id ? currentData.patient_id : "",
        service_id: currentData && currentData.service_id ? currentData.service_id : "",
        supplier_id: currentData && currentData.supplier_id ? currentData.supplier_id : "",
        ordered_at: currentData && currentData.ordered_at ? currentData.ordered_at : moment(),
        notes: currentData && currentData.notes ? currentData.notes : "",
        description: currentData && currentData.description ? currentData.description : "",
        qty: currentData && currentData.qty ? (currentData.qty) : 1,
    }


    return (
        <Modal
            title={currentData ? <IntlMessages id="global.edit" /> : <IntlMessages id="global.create" />}
            visible={open}
            destroyOnClose={true}
            onCancel={handleCancel}

            width="60%"
            footer={[
                <Button key="back" type="default" onClick={handleCancel} >
                    {<IntlMessages id="global.cancel" />}
                </Button>,
                <Button key="submit" type="primary" htmlType="submit" loading={loading} onClick={handleSubmit}>
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

                <Form.Item
                    name="patient_id" label={<IntlMessages id="global.patient" />} rules={[{
                        required: true,
                        message: <IntlMessages id="global.requiredfield" />
                    }]}

                >

                    <Select

                        showSearch
                        placeholder="Select a person"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }

                    >
                        {patients.map((option, index) => {

                            return (
                                <Option
                                    key={`${option.id}_${index}`}
                                    value={option.id}
                                >
                                    {option.fullname}
                                </Option>
                            );
                        })}
                    </Select>

                </Form.Item>


                <Form.Item
                    name="service_id" label={<IntlMessages id="global.service" />} rules={[{
                        required: true,
                        message: <IntlMessages id="global.requiredfield" />
                    }]}

                >

                    <Select
                        showSearch
                        placeholder={intl.formatMessage({ id: "global.select_service" })}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {services.map((option, index) => {

                            return (
                                <Option
                                    key={`${option.id}_${index}`}
                                    value={option.id}
                                >
                                    {option.name}
                                </Option>
                            );
                        })}
                    </Select>



                </Form.Item>

                <Form.Item label={<IntlMessages id="global.qty" />} name="qty" rules={[{
                    required: false,
                }]}>
                    <InputNumber />
                </Form.Item>


                <Form.Item
                    name="supplier_id" label={<IntlMessages id="global.supplier" />} rules={[{
                        required: true,
                        message: <IntlMessages id="global.requiredfield" />
                    }]}

                >

                    <Select
                        showSearch
                        placeholder={intl.formatMessage({ id: "global.select_supplier" })}

                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }

                    >
                        {suppliers.map((option, index) => {

                            return (
                                <Option
                                    key={`${option.id}_${index}`}
                                    value={option.id}
                                >
                                    {option.name}
                                </Option>
                            );
                        })}
                    </Select>


                </Form.Item>




                <Form.Item label={<IntlMessages id="order.ordered_at" />} name="ordered_at" rules={[{
                    required: true,
                }]}>
                    <DatePicker

                        format="DD-MM-YYYY HH:mm"
                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm') }}
                    />
                </Form.Item>


                <Form.Item label={<IntlMessages id="order.sample_at" />} name="sample_at" rules={[{
                    required: true,
                }]}>
                    <DatePicker
                        disabledDate={disabledDate}
                        format="DD-MM-YYYY"

                    />
                </Form.Item>

                <Form.Item label={<IntlMessages id="order.delivery_at" />} name="delivery_at" rules={[{
                    required: true,
                }]}>
                    <DatePicker

                        disabledDate={disabledDate}
                        format="DD-MM-YYYY"

                    />
                </Form.Item>

                <Form.Item label={<IntlMessages id="global.description" />} name="description" rules={[{
                    required: false,
                }]}>
                    <TextArea rows={3} />
                </Form.Item>

                <Form.Item label={<IntlMessages id="global.notes" />} name="notes" rules={[{
                    required: false,
                }]}>
                    <Input />
                </Form.Item>


            </Form>

        </Modal>




    )
}
