import React, { useEffect, useRef, useState } from 'react';
import { Modal, Form, Input, DatePicker, Radio, Button, Row, Col, Space, Select, message } from 'antd';
import BaseSelect from '../../components/Elements/BaseSelect';
import { createAppointment, updateAppointment } from '../../redux/actions/AppointmentAction';
import moment from 'moment';
import IntlMessages from "../../components/IntlMessage";
import { useSelector, useDispatch } from 'react-redux';
import patientApi from "../../api/patient";
import doctorApi from "../../api/doctor";
import { useIntl } from 'react-intl'
import appointmentApi from '../../api/appointment';
import status from '../../utils/status';
const { Option } = Select;
const { TextArea } = Input;


const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

export default function AppointmentForm(props) {
    const isMount = useRef(false)
    const { onClose, currentData, open } = props;


    const [form] = Form.useForm();

    const intl = useIntl();

    const [loading, setLoading] = useState(false)
    const [patients, setPatients] = useState([])
    const [doctors, setDoctors] = useState([])


    useEffect(() => {
        isMount.current = true;
        async function fetchData() {

            if (isMount) {
                var filter = {
                    page: 1,
                    limit: 100,
                    keyword: "",
                    order_by: 'id',
                    order_dir: 'DESC',

                };
                setLoading(true);
                let items = await patientApi.getAll(filter);

                doctorApi.getAll({ ...filter, limit: 50 }).then(res => {
                    res.data.map(item => {
                        item.title = item.alias;
                    })
                    setDoctors(res.data);
                });

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
        form.validateFields().then(values => {
            let data = { ...values };

            if (currentData) {
                appointmentApi.update(currentData.id, data).
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
                appointmentApi.create(data).
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
        });
    }


    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const handleCancel = () => {
        form.resetFields();
        onClose()
    }

    const initialValue = {
        patient_id: currentData && currentData.patient_id ? currentData.patient_id : "",
        doctor_id: currentData && currentData.doctor_id ? currentData.doctor_id : "",
        duration: currentData && currentData.duration ? currentData.duration : 15,
        notes: currentData && currentData.notes ? currentData.notes : "",
        status: currentData && currentData.status ? currentData.status : "confirmed",
        description: currentData && currentData.description ? currentData.description : "",
        scheduled_date: currentData && currentData.scheduled_date ? moment(currentData.scheduled_date) : moment(),
    }


    return (
        <Modal
            title={currentData ? <IntlMessages id="global.edit" /> : <IntlMessages id="global.create" />}
            visible={open}
            destroyOnClose={true}
            onCancel={handleCancel}

            width="60%"
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

                <Form.Item
                    name="patient_id" label={<IntlMessages id="global.patient" />} rules={[{
                        required: true,
                        message: <IntlMessages id="global.requiredfield" />
                    }]}

                >

                    <BaseSelect
                        placeholder={intl.formatMessage({ id: "global.select_patient" })}
                        options={patients}
                        optionValue="id"
                        optionLabel="fullname"
                    //defaultText={<IntlMessages id="global.select_patient" />}

                    />

                </Form.Item>


                <Form.Item label={<IntlMessages id="appointment.scheduled_date" />} name="scheduled_date" rules={[{
                    required: true,
                }]}>
                    <DatePicker

                        format="DD-MM-YYYY HH:mm"
                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm') }}
                    />
                </Form.Item>

                <Form.Item
                    name="duration" label={<IntlMessages id="global.duration" />} rules={[{
                        required: true,
                        message: <IntlMessages id="global.requiredfield" />
                    }]}

                >
                    <Select>
                        <Option value="5">5</Option>
                        <Option value="15">15</Option>
                        <Option value="20">20</Option>
                        <Option value="30">30</Option>
                        <Option value="45">45</Option>
                        <Option value="60">60</Option>

                    </Select>


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

                <Form.Item label={<IntlMessages id="global.status" />} name="status" rules={[{
                    required: false,
                }]}>

                    <Radio.Group>
                        {Object.keys(status.appointmentStatus).map((item, index) => {
                            let key = "appointment.status_" + item;
                            return (<Radio value={item} key={index}>{<IntlMessages id={key} />}  </Radio>)

                        })}

                    </Radio.Group>

                </Form.Item>





            </Form>

        </Modal>




    )
}
