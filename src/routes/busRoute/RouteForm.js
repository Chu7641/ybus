import React, { useEffect, useRef, useState } from "react";
import {
  Switch,
  Modal,
  Form,
  Input,
  DatePicker,
  Radio,
  Button,
  Space,
  Select,
  TimePicker,
} from "antd";
import IntlMessages from "../../components/IntlMessage";
import busRouteApi from "../../api/busRoute";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import busApi from "../../api/bus";
import agentApi from "../../api/agent";
import moment from "moment";
import destinationApi from "../../api/destination";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const layout2 = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};
const taillayout = {
  labelCol: { span: 24 },
  // wrapperCol: { span: 18 },
};
export default function BusRouteForm(props) {
  const isMount = useRef(false);
  const { onReload, onClose, currentData } = props;
  console.log(currentData);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [listBus, setListBus] = useState([]);
  const [listAgent, setListAgent] = useState([]);
  const [listDestination, setListDestination] = useState([]);

  useEffect(() => {
    async function getBus() {
      let res = await busApi.getAll();
      // console.log(res.data.list);
      setListBus(res.data.list);
      let resAgent = await agentApi.getAll();
      // console.log(resAgent.data.list);
      setListAgent(resAgent.data.list);
      let resDesti = await destinationApi.getAll();
      console.log(resDesti.data.list);
      setListDestination(resDesti.data.list);
    }
    getBus();
  }, []);

  const { Option } = Select;
  const bus = listBus.map((res, index) => {
    return (
      <Option value={res.id} key={res.id}>
        {res.title + "(" + res.seat + ")"}
      </Option>
    );
  });
  const agents = listAgent.map((res, index) => {
    return (
      <Option value={res.id} key={res.id}>
        {res.company}
      </Option>
    );
  });
  const destinations = listDestination.map((res, index) => {
    return (
      <Option value={res.id} key={res.id}>
        {res.title}
      </Option>
    );
  });

  const handleSubmit = (fieldsValue) => {
    const values = {
      ...fieldsValue,
      start_time: fieldsValue["start_time"].format("HH:mm"),
      end_time: fieldsValue["end_time"].format("HH:mm"),
    };
    console.log("Received values of form:", fieldsValue);
    setLoading(true);
    let dataUpdate = {
      ...values,
      id: currentData && currentData.id ? currentData.id : "",
    };
    let data = { ...values };

    console.log(data);

    if (currentData) {
      busRouteApi
        .update(dataUpdate)
        .then((res) => {
          console.log(data);
          setLoading(false);
          handleCancel();
          onReload();
        })
        .catch((error) => setLoading(false));
    } else {
      busRouteApi
        .create(data)
        .then((res) => {
          setLoading(false);
          handleCancel();
          onReload();
        })
        .catch((error) => setLoading(false));
    }
  };
  // const routeNumber=currentData.route.map((i)=>Number(i));
  // console.log(routeNumber);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const initialValue = {
    route:
      currentData && currentData.route
        ? currentData.route.map((i) => Number(i))
        : "",
    type: currentData && currentData.type ? currentData.type : "",
    bus_id: currentData && currentData.bus_id ? currentData.bus_id : "",
    agent_id: currentData && currentData.agent_id ? currentData.agent_id : "",
    start_time:
      currentData && currentData.start_time
        ? moment(currentData.start_time, "HH:mm")
        : "",
    end_time:
      currentData && currentData.end_time
        ? moment(currentData.end_time, "HH:mm")
        : "",
    state: currentData && currentData.state ? currentData.state : "",

    // end_time:currentData && currentData.end_time ? currentData.end_time :  "",
    code: currentData && currentData.code ? currentData.code : "",
    adult: currentData && currentData.adult ? currentData.adult : "",
    group: currentData && currentData.group ? currentData.group : "",
  };
  // console.log(currentData.state);
  return (
    <Modal
      title={
        currentData ? (
          <IntlMessages id="global.edit" />
        ) : (
          <IntlMessages id="global.add" />
        )
      }
      visible={true}
      destroyOnClose={true}
      onCancel={handleCancel}
      footer={null}
      width="60%"
    >
      <Form
        form={form}
        initialValues={initialValue}
        labelAlign="left"
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
      >
        <Form.List name="route">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                // <Space
                //     className="space-atn"
                //   size={1}
                //   key={key}
                //   style={{ display: "inline-flex",width:'100%' }}
                //   align="start"
                // >
                <div className="space-atn">
                  <Form.Item
                  style={{flex:'0 0 100%'}}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    label={name === 0 ? "Departure " : "Bus stop"}
                    name={[name]}
                    fieldKey={[fieldKey]}
                    rules={[
                      {
                        required: true,
                        message: <IntlMessages id="global.requiredfield" />,
                      },
                    ]}
                  >
                    <Select>{destinations}</Select>
                  </Form.Item>
                  <MinusCircleOutlined
                    className='icon-remove'
                    onClick={() => remove(name)}
                  />
                </div>
                // </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  <IntlMessages id="global.add_bus_stop" />
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item
          {...layout}
          label={<IntlMessages id="global.type" />}
          name="type"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <Select allowClear>
            <Option value="normal">NORMAL</Option>
            <Option value="regular">REGULAR</Option>
          </Select>
        </Form.Item>
        <Form.Item
          {...layout}
          label={<IntlMessages id="global.bus" />}
          name="bus_id"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <Select>{bus}</Select>
        </Form.Item>
        <Form.Item
          {...layout}
          label={<IntlMessages id="global.agent" />}
          name="agent_id"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <Select>
            {agents}
            {/* <Option value="normal">Normal</Option>
                        <Option value="regular">Regular</Option> */}
          </Select>
        </Form.Item>
        <Form.Item
          {...layout}
          label={<IntlMessages id="global.start_time" />}
          name="start_time"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <TimePicker format="HH:mm" />
        </Form.Item>
        <Form.Item
          {...layout}
          label={<IntlMessages id="global.end_time" />}
          name="end_time"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <TimePicker format="HH:mm" />
        </Form.Item>
        <Form.Item
          {...layout}
          label={<IntlMessages id="global.code" />}
          name="code"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          {...layout}
          label={<IntlMessages id="global.price" />}
          name="adult"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <Input type="number" suffix="CFA"/>
        </Form.Item>
        <Form.Item
          {...layout}
          label={<IntlMessages id="global.group" />}
          name="group"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          {...layout}
          label={<IntlMessages id="global.state" />}
          name="state"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <Switch
            checkedChildren={<IntlMessages id="global.enable" />}
            unCheckedChildren={<IntlMessages id="global.disable" />}
            defaultChecked={initialValue.state}
          />
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
  );
}
