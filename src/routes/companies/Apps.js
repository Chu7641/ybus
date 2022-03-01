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
  TimePicker,
  getFieldDecorator,
  Select,
} from "antd";
import Item from "antd/lib/list/Item";
import { debounce, values } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import agentApi from "../../api/agent";
import IntlMessages from "../../components/IntlMessage";
Apps.propTypes = {};
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 },
};
const tailLayout = {
  wrapperCol: { offset: 16, span: 16 },
};
const { TextArea } = Input;
function Apps(props) {
  const { currentData, agentId } = props;
  const userAppData = currentData.apps[0];
  const operatorAppData = currentData.apps[1] ? currentData.apps[1] : "";
  const [countAgent, setCountAgent] = useState();
  // userAppData ? console.log("save") : console.log("new");
  const [valueFee, setValueFee] = useState(userAppData.is_always_avail ?? 0);
  const [valueFee2, setValueFee2] = useState(operatorAppData.is_always_avail ?? 0);

  const [isDupUserListing, setIsDupUserListing] = useState(false);
  const [isDupOperatorListing, setIsDupOperatorListing] = useState(false);

  const [userListing, setUserListing] = useState(userAppData.listing ?? 1);
  const [operatorListing, setOperatorListing] = useState(operatorAppData.listing ?? 1);

  // const [isChangeForm, setIsChangeForm] = useState(false);


  const checkAppListingUser = debounce(value => {
    setUserListing(value);
    agentApi.checkAppListing(agentId, 'USER', value).then(res => {
      if (res) {
        setIsDupUserListing(true);
      } else {
        setIsDupUserListing(false);
      }
    }).catch(err => {
      setIsDupUserListing(false);
      console.log(err)
    })
  }, 0)

  const checkAppListingOperator = debounce(value => {
    setOperatorListing(value);
    agentApi.checkAppListing(agentId, 'OPERATOR', value).then(res => {
      if (res) {
        setIsDupOperatorListing(true);
      }
      else {
        setIsDupOperatorListing(false);
      }
    }).catch(err => {
      setIsDupOperatorListing(false);
      console.log(err)
    })
  }, 0)

  const handleChangeFee = (e) => {
    // console.log(e.target.value);
    setValueFee(e.target.value);
    props.setIsUnsaved(true);
  };
  const handleChangeFee2 = (e) => {
    // console.log(e.target.value);
    setValueFee2(e.target.value);
    props.setIsUnsaved(true);
  };
  const now = moment(new Date().getDate(), 'HH:mm')
  const intl = useIntl();
  const [user_app_form] = Form.useForm();
  const [operator_app_form] = Form.useForm();

  useEffect(() => {
    const getCountAgent = async () => {
      let res = await agentApi.getAll();
      setCountAgent(res.data.list.length);
      // console.log(res.data.list.length);
    };
    getCountAgent();
  }, []);

  const { Option } = Select;
  const children = [];
  for (let i = 0; i < countAgent; i++) {
    children.push(<Option key={i + 1}>{i + 1}</Option>);
  }


  const handleSubmit = () => {
    if(isDupUserListing || isDupOperatorListing) {
      message.error({
        content: "Number listing cannot be saved",
      });
      return;
    }
    user_app_form.submit();
    operator_app_form.submit();
    let dataForm = user_app_form.getFieldValue();
    let dataFormOperator = operator_app_form.getFieldValue();
    console.log("data", userAppData);
    let data = currentData.apps.length != 0
      ? {
        apps: [
          {
            id: dataForm.id,
            booking_enable:
              dataForm.booking_enable == 1 || dataForm.booking_enable == true
                ? 1
                : 0,
            status: dataForm.status == 1 || dataForm.status == true ? 1 : 0,
            is_always_avail: valueFee,

            selling_start: moment(dataForm.selling_start).format("HH:mm"),
            listing: userListing,
            app_alias: 'USER',
            booking_message: dataForm.booking_message,
          },
          {
            id: dataFormOperator.id,
            booking_enable:
              dataFormOperator.booking_enable == 1 ||
                dataFormOperator.booking_enable == true
                ? 1
                : 0,
            status:
              dataFormOperator.status == 1 || dataFormOperator.status == true
                ? 1
                : 0,
            is_always_avail: valueFee2,

            selling_start: dataFormOperator.selling_start.format("HH:mm"),
            listing: operatorListing,
            app_alias: 'OPERATOR',
            booking_message: dataFormOperator.booking_message,
          },
        ],
      }
      : {
        apps: [
          {
            // id: dataForm.id,
            booking_enable:
              dataForm.booking_enable == 1 || dataForm.booking_enable == true
                ? 1
                : 0,
            status: dataForm.status == 1 || dataForm.status == true ? 1 : 0,
            is_always_avail: valueFee,

            selling_start: moment(dataFormOperator["selling_start"]).format("HH:mm"),
            listing: userListing,
            app_alias: 'USER',
            booking_message: dataForm.booking_message,
          },
          {
            // id: dataFormOperator.id,
            booking_enable:
              dataFormOperator.booking_enable == 1 ||
                dataFormOperator.booking_enable == true
                ? 1
                : 0,
            status:
              dataFormOperator.status == 1 || dataFormOperator.status == true
                ? 1
                : 0,
            is_always_avail: valueFee2,

            selling_start: dataFormOperator.selling_start.format("HH:mm"),
            listing: operatorListing,
            app_alias: 'OPERATOR',
            booking_message: dataFormOperator.booking_message,
          },
        ],
      };
    user_app_form.validateFields().then(async () => {
      operator_app_form.validateFields().then(async () => {
        agentApi
          .updateAgentApps(agentId, data)
          .then((res) => {
            message.success({
              content: intl.formatMessage({ id: "global.update_success" }),
            });
            // console.log(data);
            props.setIsUnsaved(false);
          })
          .catch((error) => console.log(error, data));
      });
    })

  };
  const onFinishFailed = (values, errorFields, outOfDate) => {
    console.log(values);
    values.errorFields.length !== 0 ?
      message.error({
        content: intl.formatMessage({ id: "global.required_field_not_filled" }),
      }) : console.log(values);
  };
  const initialValues = {
    agent_id: userAppData && userAppData.agent_id ? userAppData.agent_id : "",
    booking_enable:
      userAppData && userAppData.booking_enable
        ? userAppData.booking_enable
        : "",
    is_always_avail: valueFee,
    listing: operatorAppData && operatorAppData.listing ? operatorAppData.listing : "",
    status: userAppData && userAppData.status ? userAppData.status : "",
    selling_start:
      userAppData && userAppData.selling_start
        ? moment(userAppData.selling_start, "HH:mm")
        : now,
    id: userAppData && userAppData.id ? userAppData.id : "",
    app_alias:
      userAppData && userAppData.app_alias ? userAppData.app_alias : "",
    booking_message:
      userAppData && userAppData.booking_message
        ? userAppData.booking_message
        : "",
  };
  const initialValues2 = {
    agent_id:
      operatorAppData && operatorAppData.agent_id
        ? operatorAppData.agent_id
        : "",
    booking_enable:
      operatorAppData && operatorAppData.booking_enable
        ? operatorAppData.booking_enable
        : "",
    is_always_avail2: valueFee2,
    listing:
      operatorAppData && operatorAppData.listing ? operatorAppData.listing : "",
    status:
      operatorAppData && operatorAppData.status ? operatorAppData.status : "",
    selling_start:
      operatorAppData && operatorAppData.selling_start
        ? moment(operatorAppData.selling_start, "HH:mm")
        : now,
    id: operatorAppData && operatorAppData.id ? operatorAppData.id : "",
    app_alias:
      operatorAppData && operatorAppData.app_alias
        ? operatorAppData.app_alias
        : "",
    booking_message:
      operatorAppData && operatorAppData.booking_message
        ? operatorAppData.booking_message
        : "",
  };

  React.useEffect(() => {
    user_app_form.resetFields();
    user_app_form.setFieldsValue(initialValues);
    operator_app_form.resetFields();
    operator_app_form.setFieldsValue(initialValues2);
    setValueFee(userAppData.is_always_avail)
    setValueFee2(operatorAppData.is_always_avail)
    setUserListing(userAppData.listing ?? 1);
    setOperatorListing(operatorAppData.listing ?? 1);
    setIsDupUserListing(false);
    setIsDupOperatorListing(false);
  
  }, [agentId]);

  React.useEffect(() => {
    if (props.activeTab == 'apps') {
      // user_app_form.resetFields();
      // user_app_form.setFieldsValue(initialValues);
      // operator_app_form.resetFields();
      // operator_app_form.setFieldsValue(initialValues2);
      // setValueFee(userAppData.is_always_avail)
      // setValueFee2(operatorAppData.is_always_avail)
      props.setHandleSave(() => { handleSubmit() })
    }

  }, [props.activeTab]);
  return (
    <div>
      <Divider orientation="left">
        <IntlMessages id="global.user_app" />
      </Divider>
      <Form
        {...layout}
        form={user_app_form}
        initialValues={initialValues}
        labelAlign="left"
        onFinishFailed={onFinishFailed}
        onFieldsChange={() => {
          props.setIsUnsaved(true)
        }}
      >
        <Form.Item
          label={<IntlMessages id="global.applisting" />}
          name="listing"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <Input type='number' onChange={(e) => checkAppListingUser(e.target.value)} value={userListing} />

          {isDupUserListing && <span style={{ color: '#ffeb3b' }}>This # is used for another</span>}
          {/* <Select defaultValue="1" style={{ width: '100%' }}>
            {children}
          </Select> */}
        </Form.Item>
        <Form.Item
          label={<IntlMessages id="global.app_status" />}
          name="status"
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
            defaultChecked={!!initialValues.status}
          />
        </Form.Item>
        <Form.Item
          label={<IntlMessages id="global.booking" />}
          name="booking_enable"
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
            defaultChecked={!!initialValues.booking_enable}
          />
        </Form.Item>
        <Form.Item
          label={<IntlMessages id="global.booking_message" />}
          name="booking_message"
          rules={[
            {
              required: false,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Row>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
              label="Selling start"
              // name="is_always_avail"
              rules={[
                {
                  required: false,
                  message: <IntlMessages id="global.requiredfield" />,
                },
              ]}
            >
              <Radio.Group
                // defaultValue={valueFee}
                onChange={handleChangeFee}
                // checked={valueFee}
                value={valueFee}
              >
                <Radio value={1}>Anytime</Radio>
                <Radio value={0}>Custom</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          {valueFee == 0 && <Col span={16}>
            <Form.Item
              name="selling_start"
              rules={[
                {
                  required: valueFee == 1 ? false : true,
                  message: <IntlMessages id="global.requiredfield" />,
                },
              ]}
            >
              <TimePicker
                disabled={valueFee == 1 ? true : false}
                format="HH:mm"
              />
            </Form.Item>
          </Col>}
        </Row>
      </Form>
      <Divider orientation="left">
        <IntlMessages id="global.operator_app" />
      </Divider>
      <Form
        {...layout}
        form={operator_app_form}
        initialValues={initialValues2}
        labelAlign="left"
        onFinishFailed={onFinishFailed}
        onFieldsChange={() => {
          props.setIsUnsaved(true)
        }}
      >
        <Form.Item
          label={<IntlMessages id="global.applisting" />}
          name="listing"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <Input type='number' onChange={(e) => checkAppListingOperator(e.target.value)} value={operatorListing} />
          {/* <Select defaultValue="1" style={{ width: '100%' }}>
            {children}
          </Select> */}
          {isDupOperatorListing && <span style={{ color: '#ffeb3b' }}>This # is used for another</span>}
        </Form.Item>
        <Form.Item
          label={<IntlMessages id="global.app_status" />}
          name="status"
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
            defaultChecked={!!initialValues2.status}
          />
        </Form.Item>
        <Form.Item
          label={<IntlMessages id="global.booking" />}
          name="booking_enable"
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
            defaultChecked={!!initialValues2.booking_enable}
          />
        </Form.Item>
        <Form.Item
          label={<IntlMessages id="global.booking_message" />}
          name="booking_message"
          rules={[
            {
              required: false,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Row>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
              label="Selling start"
              name="is_always_avail"
              rules={[
                {
                  required: false,
                  message: <IntlMessages id="global.requiredfield" />,
                },
              ]}
            >
              <Radio.Group
                defaultValue={valueFee2}
                onChange={handleChangeFee2}
                value={valueFee2}
              >
                <Radio value={1} >Anytime</Radio>
                <Radio value={0}>Custom</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          {valueFee2 == 0 && <Col span={16}>
            <Form.Item
              name="selling_start"
              rules={[
                {
                  required: valueFee2 == 1 ? false : true,
                  message: <IntlMessages id="global.requiredfield" />,
                },
              ]}
            >
              <TimePicker
                disabled={valueFee2 == 1 ? true : false}
                format="HH:mm"
              />
            </Form.Item>
          </Col>}
        </Row>
        <Form.Item {...tailLayout}>
          <Space>
            <Button type="default">
              <IntlMessages id="global.cancel" />
            </Button>
            <Button type="primary" onClick={handleSubmit} htmlType="submit">
              <IntlMessages id="global.save" />
            </Button>
          </Space>
        </Form.Item>
      </Form>

    </div>
  );
}

export default Apps;
