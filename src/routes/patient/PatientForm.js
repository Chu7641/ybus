import {
    Button,
    Form,
    Input,
    DatePicker,
    Spin,
    Row,
    message,
    Collapse,

} from "antd";
import { withRouter } from "react-router-dom";
import moment from "moment";
import React, { Component, useContext, useEffect, useRef, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import IntlMessages from "../../components/IntlMessage";
// actions
import { getAllDoctor } from '../../redux/actions/DoctorAction';
import store from "../../redux/store";
import { GET_ALL_DOCTORS, GET_PATIENT_DETAIL } from "../../redux/types";
import { updatePatient } from "../../redux/actions/PatientAction";
import DoctorSelect from "../../components/Elements/DoctorSelect";
import { useIntl } from 'react-intl'
import constant from '../../utils/constant';
import JSONField from "../../components/JSONField";
const { Panel } = Collapse;


export default function PatientForm(props) {

    //const formRef = Form.useForm();
    var { patient } = props;
    const [form] = Form.useForm();
    const isMount = useRef(false)
    const [loading, setLoading] = useState(false)
    //const [patient, setPatient] = useState({})
    const [doctors, setDoctors] = useState([])


    //const patientState = useSelector(state => state.patient.patient);
    const dispatch = useDispatch();
    const intl = useIntl();




    useEffect(() => {
        isMount.current = true;
        const filter = {
            page: 1,
            limit: 100,
            keyword: "",
            order_by: 'id',
            order_dir: 'DESC',
            filter_name: ['status'],
            filter_value: [1]
        };

        async function fecthData() {
            if (isMount) {
                let result = await dispatch(getAllDoctor(filter));

                let doctors = result.data;
                setDoctors(doctors);
                setLoading(false);

                if (doctors.length == 1) {

                    form.setFieldsValue({ doctor_id: doctors[0].id });
                }
            }
        }
        fecthData();
        return () => {
            isMount.current = false
        }

    }, []);


    const handleSubmit = values => {
        let data = { ...values };


        data.id = patient.id;
        data.healthindex = JSON.stringify(data.healthindex);

        console.log('values', data);
        setLoading(true);
        updatePatient(data.id, data).
            then(res => {

                setLoading(false);
                message.success({ content: intl.formatMessage({ id: "global.save_success" }) });
                store.dispatch({ type: GET_PATIENT_DETAIL, payload: res });
            }).
            catch(err => {

                setLoading(false);
                message.success({ content: intl.formatMessage({ id: "global.save_failed" }) });

            });

    }

    console.log(patient);
    const initialValue = {
        gender: patient && patient.gender ? patient.gender : 1,
        doctor_id: patient && patient.doctor_id ? patient.doctor_id : null,
        firstname: patient && patient.firstname ? patient.firstname : "",
        lastname: patient && patient.lastname ? patient.lastname : "",
        birthday: patient && patient.birthday ? moment(patient.birthday) : null,
        mobile: patient && patient.mobile ? patient.mobile : "",
        description: patient && patient.description ? patient.description : "",
        healthindex: patient && patient.healthindex ? JSON.parse(patient.healthindex) : [
            { bpm: "", spo2: "", bloodpressure: "", weight: "", height: "" }

        ]
    }

    return (


        <React.Fragment>


            {loading ? <Spin /> :
                < Form
                    form={form}

                    layout="vertical"
                    initialValues={initialValue}
                    onFinish={handleSubmit}
                >

                    <Collapse defaultActiveKey={['1']}>
                        <Panel header="General" key="1">
                            <Form.Item label={<IntlMessages id="global.firstname" />} name="firstname" required
                                rules={[{
                                    required: true,
                                    message: <IntlMessages id="global.requiredfield" />
                                }]}
                            >
                                <Input placeholder="input placeholder" />
                            </Form.Item>
                            <Form.Item
                                label={<IntlMessages id="global.lastname" />}
                                name="lastname"
                                required
                                rules={[{
                                    required: true,
                                    message: <IntlMessages id="global.requiredfield" />
                                }]}
                            >
                                <Input placeholder="input placeholder" />
                            </Form.Item>

                            <Form.Item
                                name="mobile" label={<IntlMessages id="global.mobile"
                                />}
                                rules={[{
                                    required: true,
                                    message: <IntlMessages id="global.requiredfield" />
                                }]}
                            >
                                <Input placeholder="input placeholder" />
                            </Form.Item>

                            <Form.Item
                                name="birthday" label={<IntlMessages id="global.birthday" />}
                            >
                                <DatePicker placeholder="input placeholder" style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item
                                name="doctor_id" label={<IntlMessages id="global.doctor" />} rules={[{
                                    required: true,
                                    message: <IntlMessages id="global.requiredfield" />
                                }]}

                            >

                                <DoctorSelect

                                    defaultActiveFirstOption={true}
                                    options={doctors}
                                    optionValue="id"
                                    optionLabel="alias"
                                    defaultText={<IntlMessages id="global.select_doctor" />}

                                />

                            </Form.Item>
                        </Panel>
                        <Panel header="Notes" key="2">

                            <JSONField json={constant.healthIndex}></JSONField>

                        </Panel>

                    </Collapse>




                    <Form.Item>
                        <Row justify="center">
                            <Button loading={loading} htmlType="submit" type="primary">{<IntlMessages id="global.save" />}</Button>
                        </Row>
                    </Form.Item>
                </Form>
            }


        </React.Fragment >
    );
}