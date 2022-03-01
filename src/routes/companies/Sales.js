import React from "react";
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
} from "antd";
import IntlMessages from "../../components/IntlMessage";
import moment from "moment";
import agentApi from "../../api/agent";
import { useIntl } from "react-intl";

Sales.propTypes = {};
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 },
};
const tailLayout = {
  wrapperCol: { offset: 16, span: 16 },
};
const { Option } = Select;
const format = "HH:mm";
function Sales(props) {
  const intl = useIntl();
  const { currentData, agentId } = props;
  console.log(currentData);
  const [sale_form] = Form.useForm();
  const [fee_form] = Form.useForm();
  const [valueFee, setValueFee] = React.useState(currentData.sale_is_fee_default);
  const onFinishFailed = () => {
    message.error({
      content: intl.formatMessage({ id: "global.required_field_not_filled" }),
    });
  };
  const handleSubmit = () => {
    console.log(sale_form.getFieldValue());
    let dataForm = sale_form.getFieldValue();
    let feeData = fee_form.getFieldValue();
    let data = {
      id: agentId,
      sale_is_fee_default: dataForm.sale_is_fee_default,
      sale_fee: dataForm.sale_is_fee_default == 0 ? 10 : feeData.fee_custom,
      sale_currency_main: dataForm.sale_currency_main,
      sale_status:
        dataForm.sale_status == 1 || dataForm.sale_status == true ? 1 : 0,
      sale_currency_display: dataForm.sale_currency_display,
      sale_currency_decimald: dataForm.sale_currency_decimald,
      sale_date_upto: dataForm.sale_date_upto,
      sale_date_type:
        dataForm.sale_date_type == 1 || dataForm.sale_date_type == true ? 1 : 0,
      sale_date: dataForm["sale_date"].format("HH:mm"),
      booking_cancelled_time: dataForm["booking_cancelled_time"].format(
        "HH:mm"
      ),
      sale_edit_enable:
        dataForm.sale_edit_enable == 1 || dataForm.sale_edit_enable == true
          ? 1
          : 0,
      sale_edit_type: dataForm.sale_edit_type,
      sale_edit_days: dataForm.sale_edit_days,
      sale_edit_times: dataForm.sale_edit_times,
    };

    console.log(data);
    agentApi
      .update(data)
      .then((res) => {
        props.setIsUnsaved(false);
        message.success({
          content: intl.formatMessage({ id: "global.update_success" }),
        });
        // console.log(data);
      })
      .catch((error) => console.log(error));
  };

  const initialValues = {
    agent_id: currentData && currentData.agent_id ? currentData.agent_id : "",
    sale_currency_main:
      currentData && currentData.sale_currency_main
        ? currentData.sale_currency_main
        : "",

    sale_status:
      currentData && currentData.sale_status ? currentData.sale_status : "",
    sale_currency_display:
      currentData && currentData.sale_currency_display
        ? currentData.sale_currency_display
        : "",
    sale_currency_decimald:
      currentData && currentData.sale_currency_decimald
        ? currentData.sale_currency_decimald
        : "",
    sale_date_upto:
      currentData && currentData.sale_date_upto
        ? currentData.sale_date_upto
        : "",
    sale_fee:
      currentData && currentData.sale_is_fee_default == 1
        ? currentData && currentData.sale_fee
          ? currentData.sale_fee
          : ""
        : "10",
    sale_is_fee_default: currentData ? currentData.sale_is_fee_default : 0,
    sale_date_type: currentData ? currentData.sale_date_type : "",
    sale_date:
      currentData && currentData.sale_date
        ? moment(currentData.sale_date, "HH:mm")
        : "",
    booking_cancelled_time:
      currentData && currentData.booking_cancelled_time
        ? moment(currentData.booking_cancelled_time, "HH:mm")
        : "",
    sale_edit_enable:
      currentData && currentData.sale_edit_enable
        ? currentData.sale_edit_enable
        : "",
    sale_edit_type: currentData ? currentData.sale_edit_type : "",
    sale_edit_days:
      currentData && currentData.sale_edit_days
        ? currentData.sale_edit_days
        : "",
    sale_edit_times: currentData ? currentData.sale_edit_times : "",
  };
  const initialValuesFeeForm = {
    fee_custom: currentData&&currentData.sale_fee ? currentData.sale_fee : "",
  };
  React.useEffect(() => {
    setValueFee(currentData.sale_is_fee_default)
    sale_form.resetFields();
    sale_form.setFieldsValue(initialValues);
    fee_form.resetFields();
    fee_form.setFieldsValue(initialValuesFeeForm);
  }, [agentId]);

  React.useEffect(() => {
    if (props.activeTab == "sales") {
      // setValueFee(currentData.sale_is_fee_default)
      // sale_form.resetFields();
      // sale_form.setFieldsValue(initialValues);
      // fee_form.resetFields();
      // fee_form.setFieldsValue(initialValuesFeeForm);
      props.setHandleSave(() => { handleSubmit() })
    }
  }, [props.activeTab]);
  return (
    <div>
      <Divider orientation="left">
        <IntlMessages id="global.general" />
      </Divider>
      <Form
        {...layout}
        form={sale_form}
        initialValues={initialValues}
        labelAlign="left"
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
        onFieldsChange={() => {
          props.setIsUnsaved(true);
        }}
      >
        <Form.Item
          label={<IntlMessages id="global.enable_disable" />}
          name="sale_status"
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
            defaultChecked={!!initialValues.sale_status}
          />
        </Form.Item>
        <Row>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
              label="Fee"
              name="sale_is_fee_default"
              rules={[
                {
                  required: true,
                  message: <IntlMessages id="global.requiredfield" />,
                },
              ]}
            >
              <Radio.Group
                onChange={(e) => {
                  setValueFee(e.target.value);
                }}
                defaultChecked={!!initialValues.sale_is_fee_default}
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
              wrapperCol={{ span: 12 }}
              
              rules={[
                {
                  required: valueFee == 0 ? false : true,
                  message: <IntlMessages id="global.requiredfield" />,
                },
              ]}
            >
              <Form form={fee_form} initialValues={initialValuesFeeForm}>
                <Form.Item>
                  <Input
                    disabled={
                      valueFee == 0
                        ? false
                        : true
                    }
                    value={10}
                  />
                </Form.Item>
                <Form.Item name="fee_custom">
                  <Input
                    disabled={
                      valueFee == 0
                        ? true
                        : false
                    }
                  />
                </Form.Item>
              </Form>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label={<IntlMessages id="global.main_currency" />}
          name="sale_currency_main"
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
          label={<IntlMessages id="global.currency_display" />}
          name="sale_currency_display"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <Select defaultValue="100">
            <Option value="100">100 CFA</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={<IntlMessages id="global.decimald" />}
          name="sale_currency_decimald"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <Select defaultValue="0">
            <Option value="0">0</Option>
            <Option value="1">1</Option>
            <Option value="2">2</Option>
          </Select>
        </Form.Item>

        <Divider orientation="left">
          <IntlMessages id="global.date_time" />
        </Divider>

        <Form.Item
          label="Up to"
          name="sale_date_upto"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Row>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
              label="Before travel"
              name="sale_date_type"
              rules={[
                {
                  required: true,
                  message: <IntlMessages id="global.requiredfield" />,
                },
              ]}
            >
              <Radio.Group
                defaultChecked={!!initialValues.sale_date_type}
                // onChange={handleChangeFee}
                // checked={valueFee}
              >
                <Radio value={0}>Before</Radio>
                <Radio value={1}>After</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              name="sale_date"
              rules={[
                {
                  required: true,
                  message: <IntlMessages id="global.requiredfield" />,
                },
              ]}
            >
              <TimePicker format="HH:mm" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Booking cancellation "
          name="booking_cancelled_time"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <TimePicker format="HH:mm" />
        </Form.Item>
        {/* <button>abg</button> */}

        <Divider orientation="left">
          <IntlMessages id="global.editting" />
        </Divider>

        <Form.Item
          label={<IntlMessages id="global.enable_disable" />}
          name="sale_edit_enable"
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
            defaultChecked={!!initialValues.sale_edit_enable}
          />
        </Form.Item>
        <Row>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
              label="Before travel"
              name="sale_edit_type"
              rules={[
                {
                  required: true,
                  message: <IntlMessages id="global.requiredfield" />,
                },
              ]}
            >
              <Radio.Group
                defaultChecked={!!initialValues.sale_edit_type}
                // onChange={handleChangeFee}
                // checked={valueFee}
              >
                <Radio value={0}>Before</Radio>
                <Radio value={1}>After</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              wrapperCol={{ span: 9 }}
              name="sale_edit_days"
              rules={[
                {
                  required: true,
                  message: <IntlMessages id="global.requiredfield" />,
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label={<IntlMessages id="global.number_change" />}
          name="sale_edit_times"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <Input type="number" />
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

export default Sales;
