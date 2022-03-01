import { CheckOutlined, CloseCircleOutlined, DeleteOutlined, DownOutlined, EditOutlined, ExclamationCircleOutlined, FormOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Dropdown, Menu, message, Modal, Row, Select, Space, Switch, Table, Typography, Checkbox } from 'antd';
import { debounce, values } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import orderApi from '../../api/order';
import ActionBar from '../../components/ActionBar';
import FilterBar from '../../components/FilterBar';
import IntlMessages from "../../components/IntlMessage";
import PageTitle from '../../components/PageTitle';
import { useHistory } from "react-router-dom";


const { TextArea } = Input;
const { Text } = Typography;
const { Option } = Select;
OrderDetail.propTypes = {
    items: PropTypes.array
};
OrderDetail.defaultProps = {
    items: []
}

function OrderDetail(props) {

    // const isMount = useRef(false)
    const intl = useIntl();

    const [form] = Form.useForm();
    const [items, setItems] = useState([]);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(true);
    const [passenger, setPassenger] = useState([]);
    const history = useHistory();

    useEffect(() => {

        async function fetchData() {
            setLoading(true);
            let result = await orderApi.getDetail(props.match.params.id);
            let items = result.data;
            console.log('items', result.data);
            setItems(items);
            setPassenger(result.data.passenger)
            form.setFieldsValue(result.data)
            setLoading(false);
        }
        fetchData();

    }, [deleting, reload])



    const onReload = () => {
        setReload(reload => !reload);
    }

    const handleSave = async () => {
        let values = form.getFieldValue()
        let data = { id: values.id, pay_status: values.pay_status, pay_method: values.pay_method, order_status: values.order_status, total: values.total, discount: values.discount, }
        console.log(data);
        setLoading(true);
        await orderApi.update(data).
            then(res => {
                message.success({ content: intl.formatMessage({ id: "global.edit_success" }) })
                console.log(values);
                setLoading(false);
                onReload()

            }).
            catch(error => setLoading(false));
    };
    const handleSaveAndClose = async () => {
        await handleSave();
        history.push("/app/orders");

    }
    const handleClose = () => {
        history.push("/app/orders");
    }

    
    // mapPassenger();
    return (


        <Card bordered={false} style={{ minHeight: '100%' }}>
            <Row justify="space-between">
                <Col> <PageTitle
                    title={<IntlMessages id="global.orders" />}
                />
                </Col>
            </Row>
            <Row justify="space-between">

                <Col>
                    <div style={{ marginBottom: '50px' }}>
                        <Space>
                            <Button
                                type="primary"
                                icon={<FormOutlined />}
                                loading={loading}
                                style={{ width: '150px' }}
                                onClick={handleSave}
                            >
                                <IntlMessages id="global.save" />
                            </Button>
                            <Button
                                icon={<CheckOutlined />}
                                loading={loading}
                                onClick={handleSaveAndClose}
                            >
                                <IntlMessages id="global.save&close" />
                            </Button>
                            <Button
                                icon={<CloseCircleOutlined style={{ fontSize: '14px', color: 'red' }} />}
                                loading={loading}
                                onClick={handleClose}
                            >
                                <IntlMessages id="global.close" />
                            </Button>
                        </Space>
                    </div>
                </Col>
            </Row>
            <Row >
                <Col span={12}>
                    <Form
                        labelAlign="left"

                        form={form}
                        labelCol={{
                            span: 6,
                        }}
                        wrapperCol={{
                            span: 10,
                        }}
                        initialValues={items}

                    >
                        <Form.Item
                            label={<IntlMessages id="global.order_number" />}
                            name="order_number"
                            rules={[
                                {
                                    required: true,
                                    message: <IntlMessages id="global.requiredfield" />
                                },
                            ]}
                        >
                            <Input disabled={true} />
                        </Form.Item>

                        <Form.Item
                            name="pay_status"
                            label={<IntlMessages id="global.payment_status" />}
                            rules={[
                                {
                                    required: true,
                                    message: <IntlMessages id="global.requiredfield" />
                                },
                            ]}
                        >
                            <Select >
                                <Option key='PENDING' value="PENDING">{<IntlMessages id="status.pending" />}</Option>
                                <Option key='SUCCESS' value="SUCCESS">{<IntlMessages id="status.success" />}</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="pay_method"
                            label={<IntlMessages id="global.payment_method" />}
                            rules={[
                                {
                                    // required: true,
                                    message: <IntlMessages id="global.requiredfield" />
                                },
                            ]}
                        >
                            <Select >
                                <Option key='PENDING' value="PENDING">{<IntlMessages id="status.pending" />}</Option>
                                <Option key='SUCCESS' value="SUCCESS">{<IntlMessages id="status.success" />}</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="order_status"
                            label={<IntlMessages id="global.order_status" />}
                            rules={[
                                {
                                    required: true,
                                    message: <IntlMessages id="global.requiredfield" />
                                },
                            ]}
                        >
                            <Select >
                                <Option key='PENDING' value="PENDING">{<IntlMessages id="status.pending" />}</Option>
                                <Option key='CONFIRMED' value="CONFIRMED">{<IntlMessages id="status.confirmed" />}</Option>
                                <Option key='CANCELLED' value="CANCELLED">{<IntlMessages id="status.cancelled" />}</Option>

                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={<IntlMessages id="global.total" />}
                            name="total"
                            rules={[
                                {
                                    required: true,
                                    message: <IntlMessages id="global.requiredfield" />
                                },
                            ]}
                        >
                            <Input addonAfter="CFA" />
                        </Form.Item>
                        <Form.Item
                            label={<IntlMessages id="global.discount" />}
                            name="discount"
                            rules={[
                                {
                                    required: true,
                                    message: <IntlMessages id="global.requiredfield" />
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={<IntlMessages id="global.transaction_id" />}
                            name="transaction_id"
                            rules={[
                                {
                                    // required: true,
                                    message: <IntlMessages id="global.requiredfield" />
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={<IntlMessages id="global.note" />}
                            name=""
                            rules={[
                                {
                                    // required: true,
                                    message: <IntlMessages id="global.requiredfield" />
                                },
                            ]}
                        >
                            <TextArea />
                        </Form.Item>

                    </Form>
                </Col>
                <Col span={12}>
                    <Card bordered={false} title={<IntlMessages id="global.route_detail" />} style={{ width: '100%' }}>
                        <Row>
                            <Space align="start"><Col>
                                <p> {<IntlMessages id="global.from" />}: {items.from} </p>
                                <p> {<IntlMessages id="global.to" />}: {items.to} </p>
                                <p> {<IntlMessages id="global.code" />}: {items.code} </p>
                            </Col>
                                <Col>
                                    <p><b>{moment(items.start_time, "HH:mm:ss").format("HH:mm")} - {moment(items.end_time, "HH:mm:ss").format("HH:mm")}</b></p>
                                    <p>

                                        {/* {<IntlMessages id="global.duration" />}: {moment.duration()}  */}
                                    </p>
                                </Col>
                                <Col>
                                    <p>{<IntlMessages id="global.date" />}: {moment(items.start, "YYYY-MM-DD HH:mm:ss").format("dd, DD, MMM, YYYY")}</p>
                                </Col></Space>
                        </Row>
                    </Card>
                    <Card bordered={false} title={<IntlMessages id="global.passenger_detail" />}>


                        <Row>
                            <Space>
                                {passenger.map((data, index) => {
                                    return (
                                        <Col key={index}>
                                            <p>{data.firstname} {data.lastname}</p>
                                            <p>{data.phone}</p>

                                        </Col>
                                    )
                                })}
                            </Space>
                        </Row>

                    </Card>
                </Col>
            </Row>

        </Card>

    )
}

export default OrderDetail;