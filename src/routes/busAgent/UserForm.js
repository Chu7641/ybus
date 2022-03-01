import React, { useState } from 'react';
import { message, Modal, Select, Space } from 'antd';
import {
  Form,
  Input,
  Switch,
  Button
} from 'antd';
import IntlMessages from "../../components/IntlMessage";
import { useIntl } from 'react-intl';
import agentApi from '../../api/agent';



const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8   ,
  },
};


export default function UserForm(props){
    const {open,onClose, onReload, currentData} = props ;
    const [form] = Form.useForm();
    const intl = useIntl();
    console.log(currentData)
    // let data = {
    //   ...currentData,
    //   company: currentData.agent_info.company
    // }

    const handleCancel = () => {
      onClose();
    };


    const handleOk = () => {
         let data = form.getFieldValue();
         console.log(data);
      
        agentApi.update(data)
          .then(res => {
            
            if(res.status_code === 200 ){
              message.success({content:  intl.formatMessage({ id: "global.edit_success" }) })
              handleCancel();
              onReload();
              

            }
          })
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
          initialValues={currentData}
          onFinish = {handleOk}
        >
          <Form.Item label={<IntlMessages id="global.username" /> } name={'username'} rules={[
            {
            required: true,
            },
        ]}>
            <Input />
          </Form.Item>
       
          <Form.Item label={<IntlMessages id="global.password" /> } name={'password'} rules={[
            {
            required: true,
            },
        ]}>
            <Input.Password placeholder="input password" />
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