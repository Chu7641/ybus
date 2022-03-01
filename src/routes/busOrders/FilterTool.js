import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Form, Input, Button, Select, Radio } from 'antd';
import IntlMessages from "../../components/IntlMessage";
import agentApi from '../../api/agent';


FilterTool.propTypes = {

};


function FilterTool(props) {
    const [listAgent, setListAgent] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const { RangePicker } = DatePicker;


    useEffect(() => {
        async function getData() {
            // let res = await busApi.getAll();
            // console.log(res.data.list);
            // setListBus(res.data.list)
            let resAgent = await agentApi.getAll();
            // console.log(resAgent.data.list);
            setListAgent(resAgent.data.list);
            // let resDesti = await destinationApi.getAll();
            // console.log(resDesti.data.list);
            // setListDestination(resDesti.data.list);
        }
        getData();
    }, [])
    const { Option } = Select;
    const sendData = (data) => {
        props.getFilterData(data)
    }
    const agents = listAgent.map((res, index) => {
        return (
            <Option value={res.id} key={res.id}>{res.company}</Option>
        )
    })
    const onFinish = (values) => {

        // console.log(values);
        sendData(values);
    }
    return (
        <div>
            <Form onFinish={onFinish} layout="inline" >
                <Form.Item
                    style={{ width: "100%" }}
                    name="type" rules={[{
                        required: false,
                        message: <IntlMessages id="global.requiredfield" />
                    }]}>

                    <Radio.Group defaultValue="depart">
                        <Radio value="depart">{<IntlMessages id="global.depart_date" />}</Radio>
                        <Radio value="booking">{<IntlMessages id="global.created" />}</Radio>


                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name="date_range"
                    rules={[
                        {
                            required: false,
                            message: <IntlMessages id="global.requiredfield" />
                        },
                    ]}
                >
                    <RangePicker allowClear />
                </Form.Item>
                <Form.Item
                    name="agent_id" rules={[{
                        required: false,
                        message: <IntlMessages id="global.requiredfield" />
                    }]}>

                    <Select allowClear placeholder={<IntlMessages id="global.agent" />} >
                        {agents}


                    </Select>
                </Form.Item>
                <Form.Item
                    name="order_status"
                    rules={[
                        {
                            message: <IntlMessages id="global.requiredfield" />
                        },
                    ]}
                >
                    <Select placeholder={<IntlMessages id="global.order_status" />} allowClear >
                        <Option key='PENDING' value="PENDING">{<IntlMessages id="status.pending" />}</Option>
                        <Option key='CONFIRMED' value="CONFIRMED">{<IntlMessages id="status.confirmed" />}</Option>
                        <Option key='CANCELLED' value="CANCELLED">{<IntlMessages id="status.cancelled" />}</Option>

                    </Select>
                </Form.Item>
                <Form.Item
                    name="pay_status"
                    rules={[
                        {
                            message: <IntlMessages id="global.requiredfield" />
                        },
                    ]}
                >
                    <Select placeholder={<IntlMessages id="global.payment_status" />} allowClear >
                        <Option key='PENDING' value="PENDING">{<IntlMessages id="status.pending" />}</Option>
                        <Option key='SUCCESS' value="SUCCESS">{<IntlMessages id="status.success" />}</Option>
                    </Select>
                </Form.Item>
                <Form.Item shouldUpdate>
                    {() => (
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            <IntlMessages id="global.search" />
                        </Button>
                    )}
                </Form.Item>
            </Form>
        </div>
    );
}

export default FilterTool;