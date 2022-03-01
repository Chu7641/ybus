import React, { useEffect, useState } from 'react';
import { message, Modal, Select, Space } from 'antd';
import {
  Form,
  Input,
  Switch,
  Button
} from 'antd';
import IntlMessages from "../../components/IntlMessage";
import busApi from '../../api/bus';
import { Option } from 'antd/lib/mentions';
import { useIntl } from 'react-intl';
import agentApi from '../../api/agent';



const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};


export default function BusForm(props){
    const {open,onClose, onReload, currentData, agentID, seatID} = props ;
    const [form] = Form.useForm();
    const [keyAgentID,setKeyAgentID] = useState();
    const [keySeatID,setKeySeatID] = useState();
    const intl = useIntl();
    const [listAgent,setListAgent]=useState([]);
    console.log(agentID,seatID);
    
    let data = {
      ...currentData,
    }
    if(currentData){
      data = {
        ...currentData,
      //  company: currentData.agent_info.company
      }
    }

    const handleCancel = () => {
      onClose();
    };

    const handleSelectAgentChange = (key) => {
      setKeyAgentID(key);
    }

    const handleSelectSeatChange = (key) => {
      setKeySeatID(key);
    }

    useEffect(() => {
      async function getBus() {
          let resAgent = await agentApi.getAll();
          // console.log(resAgent.data.list);
          setListAgent(resAgent.data.list);
          // let resDesti = await destinationApi.getAll();
          // console.log(resDesti.data.list);
          // setListDestination(resDesti.data.list);
      }
      getBus();
  }, [])
  const agents = listAgent.map((res, index) => {
    return (
        <Option value={res.id} key={res.id}>{res.company}</Option>
    )
})
    const handleOk = (values) => {
        // console.log(values);
        delete values.company;
        delete values.seatTempleteTitle;
        onReload(true);
        let dataUpdate = { 
          ...values,
          id: currentData && currentData.id ? currentData.id : "",
          seattemplate_id: keySeatID };
        let data = { 
          ...values,
          seattemplate_id: keySeatID};
      console.log(data);
      console.log(dataUpdate);
        if (currentData) {
          busApi.update(dataUpdate).
              then(res => {
                  // console.log(data);
                  message.success({ content: intl.formatMessage({ id: "global.edit_success" }) })
                  handleCancel()
                  onReload()
              })
      } else {
          busApi.create(data).
              then(res => {
                message.success({ content: intl.formatMessage({ id: "global.created" }) })
                  handleCancel()
                  onReload()
              })
      }
    }
    

    return(
        <>
      <Modal title={currentData ? <IntlMessages id="global.edit" /> : <IntlMessages id="global.add" />} visible={open} onCancel={handleCancel} footer={null} width="60%">
        <Form
          form={form}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          initialValues={data}
          onFinish = {handleOk}
        >
          <Form.Item label={<IntlMessages id="global.title" /> } name={'title'} rules={[
            {
            required: true,
            },
        ]}>
            <Input />
          </Form.Item>
          <Form.Item
                    label={<IntlMessages id="global.agent" />} name="agent_id" rules={[{
                        required: true,
                        message: <IntlMessages id="global.requiredfield" />
                    }]}>
                    <Select  >
                        {agents}
                        {/* <Option value="normal">Normal</Option>
                        <Option value="regular">Regular</Option> */}

                    </Select>
                </Form.Item>

          <Form.Item label={<IntlMessages id="car.template_seat" /> } name = {'seatTempleteTitle'} rules={[
            {
            required: true,
            },
        ]}>
            <Select onChange={handleSelectSeatChange}>
              {seatID.map(seat => (
                <Select.Option key={seat.id}>{seat.title}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label={<IntlMessages id="car.seat" /> } name = {'seat'} rules={[
            {
            required: true,
            },
        ]}>
            <Input />
          </Form.Item>
          <Form.Item label={<IntlMessages id="global.code" /> } name={'code'} rules={[
            {
            required: true,
            },
        ]}>
            <Input />
          </Form.Item>
          <Form.Item  wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>

            <Space>
                <Button type="default" onClick={handleCancel} >
                    {<IntlMessages id="global.cancel" />}
                </Button>
                <Button type="primary" htmlType="submit"  >
                    {<IntlMessages id="global.save" />}
                </Button>
            </Space>
            </Form.Item>
            </Form>
      </Modal>
        </>
    )
}