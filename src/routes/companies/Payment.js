import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Radio,
  Row,
  Space,
  Switch,
} from "antd";
import moment from "moment";
import { stringify } from "qs";
import { Field } from "rc-field-form";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import agentApi from "../../api/agent";
import IntlMessages from "../../components/IntlMessage";

Payment.propTypes = {};
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 },
};
function Payment(props) {
  const { currentData, agentId } = props;
  console.log(currentData);
  const currentDataMethod1 = currentData.payment_methods[0];
  const currentDataMethod2 = currentData.payment_methods[1];
  console.log(currentDataMethod1);
  const intl = useIntl();
  const [valueFee, setValueFee] = useState(0);
  const [valueFee2, setValueFee2] = useState(0);
  const [payment_method_1] = Form.useForm();
  const [payment_method_2] = Form.useForm();
  const [fee_form_1] = Form.useForm();
  const [fee_form_2] = Form.useForm();

  // console.log(currentData.payment_methods == []);
  const handleSubmit = async () => {
    // console.log(payment_method_1.submit());
    payment_method_1.submit();
    payment_method_2.submit();
    let dataForm = payment_method_1.getFieldValue();
    let dataForm2 = payment_method_2.getFieldValue();
    let feeData1 = fee_form_1.getFieldValue();
    let feeData2 = fee_form_2.getFieldValue();
    let data =
      currentData.payment_methods.length != 0
        ? {
            payment_methods: [
              {
                id: dataForm.id,
                display: dataForm.display,
                status: dataForm.status == 1 || dataForm.status == true ? 1 : 0,
                method: dataForm.method,
                field: JSON.stringify(dataForm.field),
                gateway_url: dataForm.gateway_url,
                is_fee_default: dataForm.is_fee_default,
                fee: dataForm.is_fee_default == 0 ? 10 : feeData1.fee_custom,
              },

              {
                id: dataForm2.id,
                display: dataForm2.display,
                status:
                  dataForm2.status == 1 || dataForm2.status == true ? 1 : 0,
                method: dataForm2.method,
                field: JSON.stringify(dataForm2.field),
                gateway_url: dataForm2.gateway_url,
                is_fee_default: dataForm2.is_fee_default,
                fee: dataForm2.is_fee_default == 0 ? 10 : feeData2.fee_custom,
              },
            ],
          }
        : {
            payment_methods: [
              {
                // id: dataForm.id,
                display: dataForm.display,
                status: dataForm.status == 1 || dataForm.status == true ? 1 : 0,
                method: dataForm.method,
                field: JSON.stringify(dataForm.field),
                gateway_url: dataForm.gateway_url,
                is_fee_default: dataForm.is_fee_default,
                fee: dataForm.is_fee_default == 0 ? 10 : feeData1.fee_custom,
              },

              {
                // id: dataForm2.id,
                display: dataForm2.display,
                status:
                  dataForm2.status == 1 || dataForm2.status == true ? 1 : 0,
                method: dataForm2.method,
                field: JSON.stringify(dataForm2.field),
                gateway_url: dataForm2.gateway_url,
                is_fee_default: dataForm2.is_fee_default,
                fee: dataForm2.is_fee_default == 0 ? 10 : feeData2.fee_custom,
              },
            ],
          };
    console.log(data);
    payment_method_1.validateFields().then(async () => {
      payment_method_2.validateFields().then(async () => {
        await agentApi
          .updatePaymentMethod(agentId, data)
          .then((res) => {
            props.setIsUnsaved(false);
            message.success({
              content: intl.formatMessage({ id: "global.update_success" }),
            });
            console.log(currentData);
          })
          .catch((error) => {
            // payment_method_1.submit();
            console.log(error);
          });
      });
    });
  };

  const onFinishFailed = (values, errorFields, outOfDate) => {
    console.log(values);
    values.errorFields.length !== 0
      ? message.error({
          content: intl.formatMessage({
            id: "global.required_field_not_filled",
          }),
        })
      : console.log(values);
  };

  React.useEffect(() => {
    setValueFee(currentDataMethod1.is_fee_default);
    setValueFee2(currentDataMethod2.is_fee_default);

    fee_form_1.resetFields();
    fee_form_1.setFieldsValue(initialValuesFeeForm1);
    fee_form_2.resetFields();
    fee_form_2.setFieldsValue(initialValuesFeeForm2);
    payment_method_1.resetFields();
    payment_method_1.setFieldsValue(initialValues1);
    payment_method_2.resetFields();
    payment_method_2.setFieldsValue(initialValues2);
  }, [agentId]);

  React.useEffect(() => {
    if (props.activeTab == "payment") {
      // setValueFee(currentDataMethod1.is_fee_default);
      // setValueFee2(currentDataMethod2.is_fee_default);
      // fee_form_1.resetFields();
      // fee_form_1.setFieldsValue(initialValuesFeeForm1);
      // fee_form_2.resetFields();
      // fee_form_2.setFieldsValue(initialValuesFeeForm2);
      // payment_method_1.resetFields();
      // payment_method_1.setFieldsValue(initialValues1);
      // payment_method_2.resetFields();
      // payment_method_2.setFieldsValue(initialValues2);
      props.setHandleSave(() => { handleSubmit() })
    }
  }, [props.activeTab]);
  const initialValuesFeeForm1 = {
    fee_custom:
      currentDataMethod1 && currentDataMethod1.fee
        ? currentDataMethod1.fee
        : "",
  };
  const initialValuesFeeForm2 = {
    fee_custom:
      currentDataMethod2 && currentDataMethod2.fee
        ? currentDataMethod2.fee
        : "",
  };

  const initialValues1 = {
    agent_id:
      currentDataMethod1 && currentDataMethod1.agent_id
        ? currentDataMethod1.agent_id
        : "",
    display:
      currentDataMethod1 && currentDataMethod1.display
        ? currentDataMethod1.display
        : "",
    field:
      currentDataMethod1 && currentDataMethod1.field
        ? JSON.parse(currentDataMethod1.field)
        : "",
    gateway_url:
      currentDataMethod1 && currentDataMethod1.gateway_url
        ? currentDataMethod1.gateway_url
        : "",
    id:
      currentDataMethod1 && currentDataMethod1.id ? currentDataMethod1.id : "",
    is_fee_default:
      currentDataMethod1 && currentDataMethod1.is_fee_default
        ? currentDataMethod1.is_fee_default
        : 0,
    method:
      currentDataMethod1 && currentDataMethod1.method
        ? currentDataMethod1.method
        : "",
    fee:
      currentDataMethod1 && currentDataMethod1.sale_is_fee_default == 1
        ? currentDataMethod1 && currentDataMethod1.sale_fee
          ? currentDataMethod1.sale_fee
          : ""
        : "10",
    status:
      currentDataMethod1 && currentDataMethod1.status
        ? currentDataMethod1.status
        : "",
  };
  const initialValues2 = {
    agent_id:
      currentDataMethod2 && currentDataMethod2.agent_id
        ? currentDataMethod2.agent_id
        : "",
    display:
      currentDataMethod2 && currentDataMethod2.display
        ? currentDataMethod2.display
        : "",
    field:
      currentDataMethod2 && currentDataMethod2.field
        ? JSON.parse(currentDataMethod2.field)
        : "",
    gateway_url:
      currentDataMethod2 && currentDataMethod2.gateway_url
        ? currentDataMethod2.gateway_url
        : "",
    id:
      currentDataMethod2 && currentDataMethod2.id ? currentDataMethod2.id : "",
    is_fee_default:
      currentDataMethod2 && currentDataMethod2.is_fee_default
        ? currentDataMethod2.is_fee_default
        : 0,
    method:
      currentDataMethod2 && currentDataMethod2.method
        ? currentDataMethod2.method
        : "",
    fee:
      currentDataMethod2 && currentDataMethod2.sale_is_fee_default == 1
        ? currentDataMethod2 && currentDataMethod2.sale_fee
          ? currentDataMethod2.sale_fee
          : ""
        : "10",
    status:
      currentDataMethod2 && currentDataMethod2.status
        ? currentDataMethod2.status
        : "",
  };

  return (
    <div>
      <Divider orientation="left">
        <IntlMessages id="global.payment_method" />
      </Divider>
      <Form
        // {...layout}
        form={payment_method_1}
        initialValues={initialValues1}
        labelAlign="left"
        onFinishFailed={onFinishFailed}
        onFieldsChange={() => {
          props.setIsUnsaved(true);
        }}
      >
        <Form.Item
          {...layout}
          label={<IntlMessages id="global.payment_method_name" />}
          name="method"
          // name={[name, "method"]}
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
          label={<IntlMessages id="global.payment_method_display_name" />}
          name="display"
          // name={[name, "method"]}
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
          label={<IntlMessages id="global.enable_disable" />}
          name="status"
          // name={[name, "status"]}
          rules={[
            {
              required: false,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <Switch
            checkedChildren={<IntlMessages id="global.enable" />}
            unCheckedChildren={<IntlMessages id="global.disable" />}
            defaultChecked={
              currentDataMethod1 ? !!currentDataMethod1.status : 0
            }
          />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          label={<IntlMessages id="global.payment_method_field" />}
          name="field"
          // name={[name, "field"]}
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          {/* <Form form={listField} autoComplete="off"> */}
          <Form.List
          
           name="field">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                   <div className="space-atn"
                    key={key}
                    style={{alignItems:'baseline'}}
                  >
                    <Form.Item
                      name={[name, "fieldName"]}
                      rules={[
                        { required: true, message: "Missing field name" },
                      ]}
                    >
                      <Input placeholder="Field name" />
                    </Form.Item>
                    <Form.Item
                    style={{flex:'0 0 65%',marginLeft:'2%'}}
                    wrapperCol={{ span:23}}
                      name={[name, "value"]}
                      rules={[
                        { required: true, message: "Missing field value" },
                      ]}
                    >
                      <Input placeholder="Field value" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          {/* </Form> */}
        </Form.Item>

        <Form.Item
          {...layout}
          label={<IntlMessages id="global.gateway_url" />}
          name="gateway_url"
          // name={[name, "gateway_url"]}
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
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
              label="Fee"
              name="is_fee_default"
              // name={[name, "is_fee_default"]}
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
                defaultChecked={!!initialValues1.sale_is_fee_default}
                checked={0}
              >
                <Space direction="vertical">
                  <Radio value={0}>Default</Radio>
                  <Radio value={1}>Custom</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              //  labelCol={{ span: 12 }}
              wrapperCol={{ span: 6 }}
              rules={[
                {
                  required: valueFee == 0 ? false : true,
                  message: <IntlMessages id="global.requiredfield" />,
                },
              ]}
            >
              <Form form={fee_form_1} initialValues={initialValuesFeeForm1}>
                <Form.Item>
                  <Input disabled={valueFee == 0 ? false : true} value={10} />
                </Form.Item>
                <Form.Item name="fee_custom">
                  <Input disabled={valueFee == 0 ? true : false} />
                </Form.Item>
              </Form>
              {/* <Input type="number" disabled={valueFee == 0 ? true : false} max={100}/> */}
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Divider orientation="left">
        <IntlMessages id="global.payment_method" />
      </Divider>
      <Form
        {...layout}
        form={payment_method_2}
        initialValues={initialValues2}
        labelAlign="left"
        onFinishFailed={onFinishFailed}
        onFieldsChange={() => {
          props.setIsUnsaved(true);
        }}
      >
        <Form.Item
          {...layout}
          label={<IntlMessages id="global.payment_method_name" />}
          name="method"
          // name={[name, "method"]}
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
          label={<IntlMessages id="global.payment_method_display_name" />}
          name="display"
          // name={[name, "method"]}
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
          label={<IntlMessages id="global.enable_disable" />}
          name="status"
          // name={[name, "status"]}
          rules={[
            {
              required: false,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <Switch
            checkedChildren={<IntlMessages id="global.enable" />}
            unCheckedChildren={<IntlMessages id="global.disable" />}
            defaultChecked={
              currentDataMethod2 ? !!currentDataMethod1.status : 0
            }
          />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          label={<IntlMessages id="global.payment_method_field" />}
          name="field"
          // name={[name, "field"]}
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          {/* <Form form={listField} autoComplete="off"> */}
          <Form.List name="field">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                 <div className="space-atn"
                 key={key}
                 style={{alignItems:'baseline'}}
               >
                    <Form.Item
                      {...restField}
                      name={[name, "fieldName"]}
                      rules={[
                        { required: true, message: "Missing field name" },
                      ]}
                    >
                      <Input placeholder="Field name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      style={{flex:'0 0 65%',marginLeft:'2%'}}
                      wrapperCol={{ span:23}}
                      name={[name, "value"]}
                      rules={[
                        { required: true, message: "Missing field value" },
                      ]}
                    >
                      <Input placeholder="Field value" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          {/* </Form> */}
        </Form.Item>

        <Form.Item
          {...layout}
          label={<IntlMessages id="global.gateway_url" />}
          name="gateway_url"
          // name={[name, "gateway_url"]}
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
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
              label="Fee"
              name="is_fee_default"
              // name={[name, "is_fee_default"]}
              rules={[
                {
                  required: false,
                  message: <IntlMessages id="global.requiredfield" />,
                },
              ]}
            >
              <Radio.Group
                onChange={(e) => {
                  setValueFee2(e.target.value);
                }}
                defaultChecked={!!initialValues2.sale_is_fee_default}
              >
                <Space direction="vertical">
                  <Radio value={0}>Default</Radio>
                  <Radio value={1}>Custom</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              //  labelCol={{ span: 12 }}
              wrapperCol={{ span: 6 }}
              rules={[
                {
                  required: valueFee2 == 0 ? false : true,
                  message: <IntlMessages id="global.requiredfield" />,
                },
              ]}
            >
              <Form form={fee_form_2} initialValues={initialValuesFeeForm2}>
                <Form.Item>
                  <Input disabled={valueFee2 == 0 ? false : true} value={10} />
                </Form.Item>
                <Form.Item name="fee_custom">
                  <Input disabled={valueFee2 == 0 ? true : false} />
                </Form.Item>
              </Form>
              {/* <Input type="number" disabled={valueFee2 == 0 ? true : false} max={100}/> */}
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div style={{ textAlign: "end" }}>
        <Space>
          <Button type="default">
            <IntlMessages id="global.cancel" />
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            <IntlMessages id="global.save" />
          </Button>
        </Space>
      </div>
    </div>
  );
}

export default Payment;
