import React, { useEffect, useRef, useState } from 'react';
import { Switch, Modal, Form, Input, Select, DatePicker, Radio, Button, Space } from 'antd';
import moment from 'moment';
import IntlMessages from "../../components/IntlMessage";
import patientApi from '../../api/patient';
import agentApi from '../../api/agent';
import busRouteGroupApi from '../../api/busRouteGroup';
import destinationApi from '../../api/destination';
import { filter, find } from 'lodash';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

export default function RouteGroupForm(props) {
    const isMount = useRef(false)
    const { onReload, onClose, currentData } = props;
    const [listDestination, setListDestination] = useState([]);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const { Option } = Select;

    useEffect(() => {
        async function getDestinations() {
            let result = await destinationApi.getAll();
            console.log(result.data.list);
            setListDestination(result.data.list)
        }

        getDestinations();
    }, [])
    const listDest = listDestination.map((res, index) => {
        return (
            <Option key={res.title}>{res.title + ' - ' + res.code}</Option>
        )
    })
    console.log(listDest);
    const handleSubmit = (values) => {
        console.log(values);
        setLoading(true);

        const coppyItem = []
        let dataDestination = values.destinations;
        console.log(dataDestination);
        for (let i = 0; i < listDestination.length; i++) {
            for (let j = 0; j < dataDestination.length; j++) {
                if (dataDestination[j] == listDestination[i].title)
                    coppyItem.push(listDestination[i].id)
            }
        }
        console.log(coppyItem);
        let dataUpdate = {
            name: values.name,
            code: values.code,
            // from: values.from,
            // to: values.to,
            dest_ids: coppyItem,
            id: currentData && currentData.id ? currentData.id : "",
        };
        let data = {
            name: values.name,
            code: values.code,
            // from: values.from,
            // to: values.to,
            dest_ids: coppyItem,
        };
        console.log(data);
        if (currentData) {
            busRouteGroupApi.update(dataUpdate).
                then(res => {
                    console.log(data);
                    setLoading(false);
                    handleCancel()
                    onReload()
                }).
                catch(error => setLoading(false));
        } else {
            busRouteGroupApi.create(data).
                then(res => {
                    setLoading(false);
                    handleCancel()
                    onReload()
                }).
                catch(error => setLoading(false));
        }
    }
    // function disabledDate(current) {
    //     // Can not select days before today and today
    //     return current && current > moment().endOf('day');
    // }

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const handleCancel = () => {
        form.resetFields();
        onClose()
    }

    const initialValue = {
        name: currentData && currentData.name ? currentData.name : "",
        code: currentData && currentData.code ? currentData.code : "",
        from: currentData && currentData.from ? currentData.from : "",
        to: currentData && currentData.to ? currentData.to : "",
        destinations: currentData && currentData.destinations ? currentData.destinations.map((res, index) => {
            return (
                res.title
            )
        }) : null
    }
    // console.log(currentData.destinations);


    // console.log(currentData.state);
    return (
        <Modal
            title={currentData ? <IntlMessages id="global.edit" /> : <IntlMessages id="global.add" />}

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

                <Form.Item label={<IntlMessages id="global.name" />} name="name" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <Input />
                </Form.Item>

                <Form.Item label={<IntlMessages id="global.code" />} name="code" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <Input />
                </Form.Item>

                <Form.Item label={<IntlMessages id="global.from" />} name="from" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <Input />
                </Form.Item>

                <Form.Item label={<IntlMessages id="global.to" />} name="to" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <Input />
                </Form.Item>
                <Form.Item label={<IntlMessages id="global.destinations" />} name="destinations" rules={[{
                    required: true,
                    message: <IntlMessages id="global.requiredfield" />
                }]}>
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Please select"
                   
                    >
                        {listDest}
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
