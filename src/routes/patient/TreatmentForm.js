import React, { useEffect, useRef, useState } from 'react';
import { Modal, Form, Input, DatePicker, Radio, Button, Row, Col, Select, InputNumber, Space } from 'antd';
import BaseSelect from '../../components/Elements/BaseSelect';
import { getAllService } from '../../redux/actions/ServiceAction';
//import { getAllDoctor } from '../../redux/actions/DoctorAction';
import { createTreatment, updateTreatment } from '../../redux/actions/TreatmentAction';
import moment from 'moment';
import IntlMessages from "../../components/IntlMessage";
import { useSelector, useDispatch } from 'react-redux';
const { Option } = Select;
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

export default function TreatmentForm(props) {
    const isMount = useRef(false)
    const { onClose, currentData, open } = props;


    const [form] = Form.useForm();



    const [loading, setLoading] = useState(false)
    const [services, setServices] = useState([]);
    const doctors = useSelector(state => state.doctor.list);

    const dispatch = useDispatch();

    useEffect(() => {
        isMount.current = true;
        const filter = {
            page: 1,
            limit: 100,
            keyword: "",
            order_by: 'id',
            order_dir: 'DESC',
        }
        async function fecthData() {
            if (isMount) {
                let services = await (getAllService(filter));
                setServices(services.data);
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

        data.patient_id = props.patient_id;
        console.log('submit', currentData);
        if (currentData) {
            dispatch(updateTreatment(currentData.id, data)).
                then(res => {
                    setLoading(false);
                    handleCancel()
                    props.onReload()
                }).
                catch(error => setLoading(false));
        } else {
            createTreatment(data).
                then(res => {
                    setLoading(false);
                    handleCancel();
                    props.onReload()
                }).
                catch(error => setLoading(false));
        }
    }

    console.log("current", currentData);

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const handleCancel = () => {
        form.resetFields();
        onClose()
    }

    const initialValue = {
        doctor_id: currentData && currentData.doctor_id ? currentData.doctor_id : "",
        assistant_id: currentData && currentData.assistant_id ? currentData.assistant_id : null,
        service_id: currentData && currentData.service_id ? currentData.service_id : "",
        clinic_id: currentData && currentData.clinic_id ? currentData.clinic_id : "",
        price: currentData && currentData.price ? currentData.price : null,
        notes: currentData && currentData.notes ? currentData.notes : "",
        treated_at: currentData && currentData.birthday ? moment(currentData.treated_at) : moment(),
    }

    const onChangeServices = (v) => {
        for (let i = 0; i < services.length; i++) {
            if (services[i].id == v) {
                let price = services[i].price;
                form.setFieldsValue({ price: price })
            }
        }
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

                <Form.Item
                    name="service_id" label={<IntlMessages id="global.service" />}
                    rules={[{
                        required: true,
                        message: <IntlMessages id="global.requiredfield" />
                    }]}
                >

                    <Select
                        showSearch
                        style={{ width: "100%" }}
                        optionFilterProp="children"
                        onChange={onChangeServices}

                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {services.map((item, index) => {

                            return <Option value={item.id} key={index}>
                                {item.name}
                            </Option>

                        })}

                    </Select>

                </Form.Item>

                <Form.Item label={<IntlMessages id="global.price" />} name="price" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <InputNumber formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} style={{ width: "100%" }} />
                </Form.Item>


                <Form.Item
                    name="doctor_id" label={<IntlMessages id="global.doctor" />} rules={[{
                        required: true,
                        message: <IntlMessages id="global.requirefield" />
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
                    name="assistant_id" label={<IntlMessages id="global.assistant" />}

                >
                    <BaseSelect
                        options={doctors}
                        optionValue="id"
                        optionLabel="alias"
                        defaultText={<IntlMessages id="global.select_doctor" />}

                    />

                </Form.Item>

                <Form.Item label={<IntlMessages id="global.notes" />} name="notes" rules={[{
                    required: false,
                }]}>
                    <Input />
                </Form.Item>

                <Form.Item label={<IntlMessages id="global.treated_at" />} name="treated_at" rules={[{
                    required: true,
                }]}>
                    <DatePicker

                        format="DD-MM-YYYY HH:mm"
                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm') }}
                    />
                </Form.Item>





                <Form.Item {...tailLayout}>

                    <Space>

                        <Button type="default" onClick={handleCancel} className="mr-2" >
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
