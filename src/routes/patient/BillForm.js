import React, { useEffect, useRef, useState } from 'react';
import { Modal, Form, Input, DatePicker, Radio, Button, Row, Col, Space, InputNumber } from 'antd';
import BaseSelect from '../../components/Elements/BaseSelect';
import { getAllService } from '../../redux/actions/ServiceAction';
import billApi from '../../api/bill';
import moment from 'moment';
import IntlMessages from "../../components/IntlMessage";
import { useSelector, useDispatch } from 'react-redux';
import PaymentMethod from '../../components/PaymentMethod';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

export default function BillForm(props) {
    const isMount = useRef(false)
    const { onClose, currentData, open } = props;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)

    const doctors = useSelector(state => state.doctor.list);
    const patient = useSelector(state => state.patient.patient);

    const dispatch = useDispatch();

    useEffect(() => {
        isMount.current = true;
        const filter = {
            page: 1,
            limit: 10,
            keyword: "",
            order_by: 'id',
            order_dir: 'DESC',
        }
        async function fecthData() {
            if (isMount) {
                //let services = await (getAllService(filter));
                //setServices(services.data);
            }
        }

        fecthData()

        return () => {
            isMount.current = false
        }
    }, [])



    const handleSubmit = (values) => {

        setLoading(true);
        let data = { ...values };

        data.patient_id = patient.id;
        if (currentData) {
            billApi.update(currentData.id, data).
                then(res => {
                    setLoading(false);
                    handleCancel()
                    props.onReload()
                }).
                catch(error => setLoading(false));
        } else {
            billApi.create(data).
                then(res => {
                    setLoading(false);
                    handleCancel();
                    props.onReload()
                }).
                catch(error => setLoading(false));
        }
    }


    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const handleCancel = () => {
        form.resetFields();
        onClose()
    }

    const initialValue = {
        doctor_id: currentData && currentData.doctor_id ? currentData.doctor_id : patient.doctor_id,
        amount: currentData && currentData.amount ? currentData.amount : null,
        notes: currentData && currentData.notes ? currentData.notes : "",
        description: currentData && currentData.description ? currentData.description : "",
        billed_date: currentData && currentData.billed_date ? moment(currentData.billed_date) : moment(),
        status: currentData && currentData.status ? currentData.status : false,
    }

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };

    return (
        <Modal
            title={currentData ? <IntlMessages id="global.edit" /> : <IntlMessages id="global.add" />}
            visible={open}
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


                <Form.Item label={<IntlMessages id="bill.amount" />} name="amount" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <InputNumber formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label={<IntlMessages id="bill.billed_date" />} name="billed_date" rules={[{
                    required: true,
                }]}>
                    <DatePicker

                        format="DD-MM-YYYY HH:mm"
                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm') }}
                    />
                </Form.Item>


                <Form.Item
                    name="doctor_id" label={<IntlMessages id="global.doctor" />} rules={[{
                        required: true,
                        message: <IntlMessages id="global.requiredfield" />
                    }]}

                >

                    <BaseSelect
                        options={doctors}
                        optionValue="id"
                        optionLabel="alias"
                        defaultText={<IntlMessages id="global.select_doctor" />}

                    />

                </Form.Item>

                <Form.Item
                    name="method" label={<IntlMessages id="global.payment_method" />}

                >
                    <PaymentMethod></PaymentMethod>


                </Form.Item>

                <Form.Item label={<IntlMessages id="global.description" />} name="description" rules={[{
                    required: false,
                }]}>
                    <Input />
                </Form.Item>

                <Form.Item label={<IntlMessages id="global.notes" />} name="notes" rules={[{
                    required: false,
                }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="status" label={<IntlMessages id="global.status" />}>
                    <Radio.Group>
                        <Radio value={false}><IntlMessages id="global.notpaid" /></Radio>
                        <Radio value={true}><IntlMessages id="global.paid" /></Radio>

                    </Radio.Group>
                </Form.Item>

                <Form.Item {...tailLayout}>

                    <Space>
                        <Button type="default" onClick={handleCancel} >
                            {<IntlMessages id="global.cancel" />}
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {<IntlMessages id="global.save" />}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>

        </Modal>


    )
}
