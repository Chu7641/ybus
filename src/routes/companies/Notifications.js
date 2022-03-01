/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Divider,
  Space,
  Form,
  Input,
  Switch,
  Select,
  Button,
  TimePicker,
  DatePicker,
  Row,
  Col,
  Radio,
  message,
  Descriptions,
} from "antd";
import IntlMessages from "../../components/IntlMessage";
import agentApi from "../../api/agent";
import { useIntl } from "react-intl";
import { render } from "less";
import TextArea from "antd/lib/input/TextArea";
Notifications.propTypes = {};
const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 8 },
};
const tailLayout = {
  wrapperCol: { offset: 16, span: 16 },
};
const { Option } = Select;

function Notifications(props) {
  const intl = useIntl();
  const [notification_form] = Form.useForm();
  const [dataForm1] = Form.useForm();
  const [dataForm2] = Form.useForm();
  const [dataForm3] = Form.useForm();
  const [dataForm4] = Form.useForm();
  const [dataForm5] = Form.useForm();
  const [dataForm6] = Form.useForm();

  const [gate_form] = Form.useForm();
  const [dataTest1, setDataTest1] = useState();
  // const [dataTest2, setDataTest2] = useState();
  // const [dataTest3, setDataTest3] = useState();
  // const [dataTest4, setDataTest4] = useState();
  // const [dataTest5, setDataTest5] = useState();
  // const [dataTest6, setDataTest6] = useState();

  const [loadings, setLoadings] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const { currentData, agentId } = props;
  console.log(currentData);
  const [valueFee, setValueFee] = React.useState(
    currentData.sms_is_gateway_default ? currentData.sms_is_gateway_default : 0
  );

  console.log(currentData.test_data);
  const test_data =
    currentData && currentData.test_data ? currentData.test_data : [];
  useEffect(() => {
    test_data.map((res, index) => {
      if (res.order == 1) {
        dataForm1.setFieldsValue({
          id:test_data[index].id,
          agent_id:test_data[index].agent_id,
          phone_number: test_data[index].phone,
          order_ref: test_data[index].order_ref,
        });
      } else if (res.order == 2) {
        dataForm2.setFieldsValue({
          id:test_data[index].id,
          agent_id:test_data[index].agent_id,
          phone_number: test_data[index].phone,
          order_ref: test_data[index].order_ref,
        });
      } else if (res.order == 3) {
        dataForm3.setFieldsValue({
          id:test_data[index].id,
          agent_id:test_data[index].agent_id,
          phone_number: test_data[index].phone,
          order_ref: test_data[index].order_ref,
        });
      } else if (res.order == 4) {
        dataForm4.setFieldsValue({
          id:test_data[index].id,
          agent_id:test_data[index].agent_id,
          phone_number: test_data[index].phone,
          order_ref: test_data[index].order_ref,
        });
      } else if (res.order == 5) {
        dataForm5.setFieldsValue({
          id:test_data[index].id,
          agent_id:test_data[index].agent_id,
          phone_number: test_data[index].phone,
          order_ref: test_data[index].order_ref,
        });
      } else if (res.order == 6) {
        dataForm6.setFieldsValue({
          id:test_data[index].id,
          agent_id:test_data[index].agent_id,
          phone_number: test_data[index].phone,
          order_ref: test_data[index].order_ref,
        });
      }
      console.log(test_data[index]);
    });
  }, []);
  const smsVar = () => {
    let list = currentData && currentData.sms_vars ? currentData.sms_vars : "";
    // console.log(Object.values(list).length%6);
    return (
      <Descriptions
        column={{ sm: 2, md: Math.ceil(Object.values(list).length / 8) }}
      >
        {Object.keys(list).map((res, index) => {
          return (
            <Descriptions.Item label={res}>
              {Object.values(list)[index]}
            </Descriptions.Item>
          );
        })}
      </Descriptions>
    );
  };
  const handleChangeFee = (e) => {
    setValueFee(e.target.value);
    props.setIsUnsaved(true);
  };
  const handleSubmit = () => {
    let vals = notification_form.getFieldValue();
    let gate_data = gate_form.getFieldValue();
    let data = {
      // sms_vars: vals.sms_vars,
      sms_is_gateway_default: vals.sms_is_gateway_default,
      sms_operator_app: vals.sms_operator_app,
      sms_user_app: vals.sms_user_app,
      sms_sender_id: vals.sms_sender_id,
      sms_gateway: vals.sms_is_gateway_default == 0 ? 10 : gate_data.fee_custom,
      id: agentId,
      test_data: [
        {
          order: 1,
          order_ref: dataForm1.getFieldValue().order_ref,
          phone: dataForm1.getFieldValue().phone_number,
        },
        {
          order: 2,
          order_ref: dataForm2.getFieldValue().order_ref,
          phone: dataForm2.getFieldValue().phone_number,
        },
        {
          order: 3,
          order_ref: dataForm3.getFieldValue().order_ref,
          phone: dataForm3.getFieldValue().phone_number,
        },
        {
          order: 4,
          order_ref: dataForm4.getFieldValue().order_ref,
          phone: dataForm4.getFieldValue().phone_number,
        },
        {
          order: 5,
          order_ref: dataForm5.getFieldValue().order_ref,
          phone: dataForm5.getFieldValue().phone_number,
        },
        {
          
          order: 6,
          order_ref: dataForm6.getFieldValue().order_ref,
          phone: dataForm6.getFieldValue().phone_number,
        },
      ],
    };
    agentApi
      .update(data)
      .then((res) => {
        props.setIsUnsaved(false);
        message.success({
          content: intl.formatMessage({ id: "global.update_success" }),
        });
      })
      .catch((error) => console.log(error));
  };

  const initialValuesgateForm = {
    fee_custom:
      currentData && currentData.sms_gateway ? currentData.sms_gateway : "",
  };
  const initialValue = {
    sms_vars: currentData && currentData.sms_vars ? currentData.sms_vars : "",
    sms_is_gateway_default:
      currentData && currentData.sms_is_gateway_default
        ? currentData.sms_is_gateway_default
        : 0,
    sms_sender_id:
      currentData && currentData.sms_sender_id ? currentData.sms_sender_id : "",
    sms_operator_app:
      currentData && currentData.sms_operator_app
        ? currentData.sms_operator_app
        : "",
    sms_user_app:
      currentData && currentData.sms_user_app ? currentData.sms_user_app : "",
  };

  const onFinishFailed = () => {
    message.error({
      content: intl.formatMessage({ id: "global.required_field_not_filled" }),
    });
  };
  const handleSubmitFormUserApp1 = (values, index) => {
    console.log(values, index);
    let oldArr = [false, false, false, false, false, false];
    let newArr = [...oldArr];
    newArr[index] = true;
    setLoadings(newArr);

    let data = {
      agent_id: agentId,
      phone_number: values.phone_number,
      order_ref: values.order_ref,
      type: "USER_APP",
    };
    console.log(data);
    agentApi
      .sendSMS(data)
      .then((res) => {
        props.setIsUnsaved(false);
        console.log(res.data);
        if (res.data != "OK")
          message.error({
            content: intl.formatMessage({
              id: "global.message_has_not_been_sent",
            }),
          });
        else if (res.data == "OK") {
          message.success({
            content: intl.formatMessage({ id: "global.message_has_been_sent" }),
          });
        }
        setLoadings(oldArr);
      })
      .catch((error) => console.log(error));
  };

  const handleSubmitFormOperatorApp1 = (values, index) => {
    let oldArr = [false, false, false, false, false, false];
    let newArr = [...oldArr];
    newArr[index] = true;
    setLoadings(newArr);

    let data = {
      agent_id: agentId,
      phone_number: values.phone_number,
      order_ref: values.order_ref,
      type: "OPERATOR_APP",
    };
    // setLoading(true)
    agentApi
      .sendSMS(data)
      .then((res) => {
        props.setIsUnsaved(false);
        console.log(res.data);
        if (res.data == "Fail")
          message.error({
            content: intl.formatMessage({
              id: "global.message_has_not_been_sent",
            }),
          });
        else if (res.data == "Success") {
          message.success({
            content: intl.formatMessage({ id: "global.message_has_been_sent" }),
          });
        }
        setLoadings(oldArr);
      })
      .catch((error) => console.log(error));
  };
  const dataTest2 = {
    phone_number: "01233654",
    order_ref: 665521,
  };
  console.log(dataTest1, initialValue);
  React.useEffect(() => {
    setValueFee(currentData.sms_is_gateway_default);
    notification_form.resetFields();
    notification_form.setFieldsValue(initialValue);
    gate_form.resetFields();
    gate_form.setFieldsValue(initialValuesgateForm);
  }, [agentId]);
  React.useEffect(() => {
    if (props.activeTab == "notifications") {
      // notification_form.resetFields();
      // notification_form.setFieldsValue(initialValue);
      // gate_form.resetFields();
      // gate_form.setFieldsValue(initialValuesgateForm);
      props.setHandleSave(() => {
        handleSubmit();
      });
    }
  }, [props.activeTab]);
  return (
    <div>
      <Divider orientation="left">
        <IntlMessages id="global.sms_notifications" />
      </Divider>
      <Form
        {...layout}
        form={notification_form}
        initialValues={initialValue}
        labelAlign="left"
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
        onFieldsChange={() => {
          props.setIsUnsaved(true);
        }}
      >
        <Row>
          <Col span={6}>
            <Form.Item
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
              label="Gateway"
              name="sms_is_gateway_default"
              rules={[
                {
                  required: false,
                  message: <IntlMessages id="global.requiredfield" />,
                },
              ]}
            >
              <Radio.Group
                onChange={(e) => {
                  setValueFee(e.target.value);
                }}
                defaultChecked={!!initialValue.sms_is_gateway_default}
                checked={0}
              >
                <Space direction="vertical">
                  <Radio value={0}>Default</Radio>
                  <Radio value={1}>Custom</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              wrapperCol={{ span: 9 }}
              rules={[
                {
                  required: true,
                  message: <IntlMessages id="global.requiredfield" />,
                },
              ]}
            >
              <Form form={gate_form} initialValues={initialValuesgateForm}>
                <Form.Item>
                  {/* <Select
                    disabled={valueFee == 0 ? false : true}
                    defaultValue={currentData.sms_gateway_default}
                  >
                    <Option value="1">infobip</Option>
                    <Option value="2">RouteSMS</Option>
                    <Option value="3">Expresso</Option>
                  </Select> */}
                  <Input
                    disabled={true}
                    // disabled={valueFee == 0 ? false : true}
                    value={
                      currentData.sms_gateway_default == 1
                        ? "inforbip"
                        : currentData.sms_gateway_default == 2
                        ? "RouteSMS"
                        : "Expresso"
                    }
                  />
                </Form.Item>
                <Form.Item name="fee_custom">
                  <Select
                    disabled={valueFee == 0 ? true : false}
                    defaultValue="1"
                  >
                    <Option value="1">infobip</Option>
                    <Option value="2">RouteSMS</Option>
                    <Option value="3">Expresso</Option>
                  </Select>
                  {/* <Input disabled={valueFee == 0 ? true : false} /> */}
                </Form.Item>
              </Form>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 7 }}
          label={<IntlMessages id="global.senderID" />}
          name="sms_sender_id"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Row>
          <Col span={10}>
            <Form.Item
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 7 }}
              label={<IntlMessages id="global.user_app" />}
              name="sms_user_app"
              rules={[
                {
                  required: true,
                  message: <IntlMessages id="global.requiredfield" />,
                },
              ]}
            >
              <TextArea rows={5} />
            </Form.Item>
          </Col>
          <Col span={14}>
            <div style={{ paddingLeft: "20px", marginBottom: "20px" }}>
              <Form
                form={dataForm1}
                onFinish={(values) => handleSubmitFormUserApp1(values, 0)}
                layout="inline"
              >
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: <IntlMessages id="global.requiredfield" />,
                    },
                  ]}
                  name="phone_number"
                >
                  <Input placeholder="Phone Number" />
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: <IntlMessages id="global.requiredfield" />,
                    },
                  ]}
                  name="order_ref"
                >
                  <Input placeholder="Order Reference" />
                </Form.Item>
                <Form.Item>
                  <Button
                    loading={loadings[0]}
                    type="primary"
                    htmlType="submit"
                  >
                    <IntlMessages id="global.send" />
                  </Button>
                </Form.Item>
              </Form>
              <Form
                form={dataForm2}
                // initialValues={dataTest2}
                onFinish={(values) => handleSubmitFormUserApp1(values, 1)}
                layout="inline"
              >
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: <IntlMessages id="global.requiredfield" />,
                    },
                  ]}
                  name="phone_number"
                >
                  <Input placeholder="Phone Number" />
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: <IntlMessages id="global.requiredfield" />,
                    },
                  ]}
                  name="order_ref"
                >
                  <Input placeholder="Order Reference" />
                </Form.Item>
                <Form.Item>
                  <Button
                    loading={loadings[1]}
                    type="primary"
                    htmlType="submit"
                  >
                    <IntlMessages id="global.send" />
                  </Button>
                </Form.Item>
              </Form>
              <Form
                form={dataForm3}
                // initialValues={dataTest3}
                onFinish={(values) => handleSubmitFormUserApp1(values, 2)}
                layout="inline"
              >
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: <IntlMessages id="global.requiredfield" />,
                    },
                  ]}
                  name="phone_number"
                >
                  <Input placeholder="Phone Number" />
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: <IntlMessages id="global.requiredfield" />,
                    },
                  ]}
                  name="order_ref"
                >
                  <Input placeholder="Order Reference" />
                </Form.Item>
                <Form.Item>
                  <Button
                    loading={loadings[2]}
                    type="primary"
                    htmlType="submit"
                  >
                    <IntlMessages id="global.send" />
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <Form.Item
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 7 }}
              label={<IntlMessages id="global.operator_app" />}
              name="sms_operator_app"
              rules={[
                {
                  required: true,
                  message: <IntlMessages id="global.requiredfield" />,
                },
              ]}
            >
              <TextArea rows={5} />
            </Form.Item>
          </Col>
          <Col span={14}>
            <div style={{ paddingLeft: "20px", marginBottom: "20px" }}>
              <Form
                form={dataForm4}
                // initialValues={dataTest4}
                onFinish={(values) => handleSubmitFormOperatorApp1(values, 3)}
                layout="inline"
              >
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: <IntlMessages id="global.requiredfield" />,
                    },
                  ]}
                  name="phone_number"
                >
                  <Input placeholder="Phone Number" />
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: <IntlMessages id="global.requiredfield" />,
                    },
                  ]}
                  name="order_ref"
                >
                  <Input placeholder="Order Reference" />
                </Form.Item>
                <Form.Item>
                  <Button
                    loading={loadings[3]}
                    type="primary"
                    htmlType="submit"
                  >
                    <IntlMessages id="global.send" />
                  </Button>
                </Form.Item>
              </Form>
              <Form
                form={dataForm5}
                // initialValues={dataTest5}
                onFinish={(values) => handleSubmitFormOperatorApp1(values, 4)}
                layout="inline"
              >
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: <IntlMessages id="global.requiredfield" />,
                    },
                  ]}
                  name="phone_number"
                >
                  <Input placeholder="Phone Number" />
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: <IntlMessages id="global.requiredfield" />,
                    },
                  ]}
                  name="order_ref"
                >
                  <Input placeholder="Order Reference" />
                </Form.Item>
                <Form.Item>
                  <Button
                    loading={loadings[4]}
                    type="primary"
                    htmlType="submit"
                  >
                    <IntlMessages id="global.send" />
                  </Button>
                </Form.Item>
              </Form>
              <Form
                form={dataForm6}
                // initialValues={dataTest6}
                onFinish={(values) => handleSubmitFormOperatorApp1(values, 5)}
                layout="inline"
              >
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: <IntlMessages id="global.requiredfield" />,
                    },
                  ]}
                  name="phone_number"
                >
                  <Input placeholder="Phone Number" />
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: <IntlMessages id="global.requiredfield" />,
                    },
                  ]}
                  name="order_ref"
                >
                  <Input placeholder="Order Reference" />
                </Form.Item>
                <Form.Item>
                  <Button
                    loading={loadings[5]}
                    type="primary"
                    htmlType="submit"
                  >
                    <IntlMessages id="global.send" />
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
        <Form.Item
          labelCol={{ span: 3 }}
          wrapperCol={{
            md: { span: 20 },
            xl: { span: 12 },
            lg: { span: 12 },
            sm: { span: 20 },
          }}
          label={<IntlMessages id="global.list_of_variables" />}
          rules={[
            {
              required: false,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
          name="sms_vars"
        >
          {smsVar()}
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Space>
            <Button type="default">
              <IntlMessages id="global.cancel" />
            </Button>
            <Button type="primary" htmlType="submit">
              <IntlMessages id="global.save" />
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Notifications;
