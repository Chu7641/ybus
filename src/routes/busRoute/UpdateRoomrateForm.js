import React, { useEffect, useRef, useState } from 'react';
import { Switch, Modal, Form, Input, DatePicker, Radio, Button, Space, TimePicker, Select } from 'antd';
import moment from 'moment';
import IntlMessages from "../../components/IntlMessage";
import busApi from '../../api/bus';
import roomrateApi from '../../api/roomrate';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

export default function UpdateRoomratetForm(props) {
    const isMount = useRef(false)
    const { onReload, onClose, currentData } = props;
    console.log(currentData);
    const [form] = Form.useForm();
    const [listBus, setListBus] = useState([]);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        async function getBus() {
            let res = await busApi.getAll();
            // console.log(res.data.list);
            setListBus(res.data.list)
            // let resAgent = await agentApi.getAll();
            // // console.log(resAgent.data.list);
            // setListAgent(resAgent.data.list);
            // let resDesti = await destinationApi.getAll();
            //  console.log(resDesti.data.list);
            // setListDestination(resDesti.data.list);
        }
        getBus();
    }, [])
    const { Option } = Select;
    const bus = listBus.map((res, index) => {
        return (
            <Option value={res.id} key={res.id}>{res.title + '(' + res.seat + ')'}</Option>
        )
    })
    const handleSubmit = (fieldsValue) => {
        const values = {
            ...fieldsValue,
            'start_time': fieldsValue['start_time'].format('HH:mm'),
            'end_time': fieldsValue['end_time'].format('HH:mm'),
        }
        // console.log(values);
        setLoading(true);
        let dataUpdate = { ...values, id: currentData && currentData.id ? currentData.id : "", };
        // console.log(dataUpdate);
       
            roomrateApi.update(dataUpdate).then(res => {
                    setLoading(false);
                    handleCancel()
                    onReload()
                }).catch(error => setLoading(false));
        
    }
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
    const handleCancel = () => {
        form.resetFields();
        onClose()
    }

    const initialValue = {
        adult: currentData && currentData.adult ? currentData.adult : "",
        start_time:currentData && currentData.start ? moment(currentData.start,'HH:mm')  : "",
        end_time:currentData && currentData.end ? moment(currentData.end,'HH:mm')  : "",
        bus_id: currentData && currentData.bus_id ? currentData.bus_id : "",
   
    }
    // console.log(currentData.state);
    return (
        <Modal
            title={ <IntlMessages id="global.edit" />}

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

                <Form.Item label={<IntlMessages id="global.price" />} name="adult" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <Input type="number" suffix="CFA"/>
                </Form.Item>
                <Form.Item
                    label={<IntlMessages id="global.start_time" />} name="start_time" rules={[{
                        required: true,
                        message: <IntlMessages id="global.requiredfield" />
                    }]}>
                    <TimePicker format="HH:mm" />
                </Form.Item>
                <Form.Item
                    label={<IntlMessages id="global.end_time" />} name="end_time" rules={[{
                        required: true,
                        message: <IntlMessages id="global.requiredfield" />
                    }]}>
                    <TimePicker format="HH:mm" />
                </Form.Item>
                <Form.Item
                {...layout}
                    label={<IntlMessages id="global.bus" />} name="bus_id" rules={[{
                        required: true,
                        message: <IntlMessages id="global.requiredfield" />
                    }]}>
                    <Select>
                        {bus}
                        {/* <Option value="normal">Normal</Option>
                        <Option value="regular">Regular</Option> */}

                    </Select>
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
