import { Button, Col, Form, Input, InputNumber, Modal, Row, DatePicker } from "antd";
import BaseSelect from "../../components/Elements/BaseSelect";
import PropTypes from "prop-types";
import React, { Component } from "react";
import IntlMessages from "../../components/IntlMessage";
import moment from 'moment'


const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
    }
};

const typeOption = [
    { title: <IntlMessages id="promotion.percent" />, id: "1" },
    { title: <IntlMessages id="promotion.fixed_number" />, id: "2" },
];

const styleOption = [
    { title: <IntlMessages id="promotion.normal" />, id: "1" },
    { title: <IntlMessages id="promotion.additional_of_admin" />, id: "2" },
]

const statusOption = [
    { title: <span><IntlMessages id="global.published" /></span>, id: "1" },
    { title: <span><IntlMessages id="global.unpublished" /></span>, id: "2" },
]


class Add extends Component {

    static propTypes = {
        record: PropTypes.object,
        onSave: PropTypes.func,
        open: PropTypes.bool,
        onClose: PropTypes.func
    };

    static defaultProps = {
        record: {
        },
        edit: false,
        open: false
    };

    state = {
        record: null,
        image: ""

    };

    componentDidMount() {
        this.setState({
            ...this.state,
            record: this.props.record
        });
    }

    static getDerivedStateFromProps(props, state) {
        if (props.record !== state.record) {
            return {
                ...state,
                record: props.record
            };
        }
        return null;
    }


    handleSubmit = values => {
        var record = {
            ...values,
            start_date: values.start_date.format("YYYY-MM-DD HH:mm:ss"),
            start_buy: values.start_buy.format("YYYY-MM-DD HH:mm:ss"),
            end_date: values.end_date.format("YYYY-MM-DD HH:mm:ss"),
            end_buy: values.end_buy.format("YYYY-MM-DD HH:mm:ss"),
            image: this.state.image,
            style: 1
        };

        this.props.onSave(
            record,
            this.props.record ? this.props.record.id : null
        )
    };


    getValueChosseFile = data => {
        this.setState({
            ...this.state,
            image: data[0] ? data[0].path_relative : ""
        });
    };


    render() {
        const {
            onClose,
            open,
            record,
            edit,
            isSubmiting
        } = this.props;

        return (
            <React.Fragment>
                <Modal
                    title={
                        edit ? <IntlMessages id="promotion.edit" /> : <IntlMessages id="promotion.create" />
                    }
                    toggle={onClose}
                    visible={open}
                    destroyOnClose={true}
                    closable={true}
                    onCancel={() => this.props.onClose()}
                    footer={null}
                    width="1000px"
                    centered
                >
                    <Form
                        {...formItemLayout}
                        onFinish={this.handleSubmit}
                        initialValues={record ? {
                            ...record,
                            start_date: record.start_date ? moment(record.start_date) : null,
                            end_date: record.end_date ? moment(record.end_date) : null,
                            start_buy: record.start_buy ? moment(record.start_buy) : null,
                            end_buy: record.end_buy ? moment(record.end_buy) : null,

                        } : {
                                type: "1",
                                status: "1"
                            }
                        }
                    >
                        <Form.Item
                            label={<IntlMessages id="global.title" />}
                            name="title"
                            rules={[{ required: true, message: <IntlMessages id="global.required" /> }]}
                        >
                            <Input placeholder="Tên khuyến mãi" />
                        </Form.Item>
                        <Form.Item
                            label={<IntlMessages id="global.description" />}
                            name="description"
                            rules={[{ required: true, message: <IntlMessages id="global.required" /> }]}
                        >
                            <Input placeholder="Mô tả" />
                        </Form.Item>
                        <Form.Item
                            label={<IntlMessages id="promotion.amount" />}
                            name="amount"
                            rules={[{ required: true, message: <IntlMessages id="global.required" /> }]}
                        >
                            <InputNumber style={{ width: "100%" }} placeholder="Giá trị khuyến mãi" />
                        </Form.Item>
                        <Form.Item
                            label={<IntlMessages id="global.type" />}
                            name="type"
                            rules={[{ required: true, message: <IntlMessages id="global.required" /> }]}
                        >
                            <BaseSelect
                                showSearch
                                options={typeOption}
                                selected={record ? record.type ? record.type.toString() : "1" : "1"}
                            // onChange={value => console.log(value)}
                            />
                        </Form.Item>
                        <Form.Item
                            label={<IntlMessages id="global.status" />}
                            name="status"
                            rules={[{ required: true, message: <IntlMessages id="global.required" /> }]}
                        >
                            <BaseSelect
                                showSearch
                                options={statusOption}
                                selected={record ? record.status ? record.status.toString() : "1" : "1"}
                            // onChange={value => console.log(value)}
                            />
                        </Form.Item>

                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    label={<IntlMessages id="promotion.start_date" />}
                                    name="start_date"
                                    rules={[{ required: true, message: <IntlMessages id="global.required" /> }]}
                                >
                                    <DatePicker
                                        disabledTime={d => !d || d.isSameOrBefore(record && record.end_date)}
                                        showTime
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={<IntlMessages id="promotion.end_date" />}
                                    name="end_date"
                                    rules={[{ required: true, message: <IntlMessages id="global.required" /> }]}
                                >
                                    <DatePicker
                                        disabledTime={d => !d || d.isSameOrAfter(record && record.start_date)}
                                        showTime
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    label={<IntlMessages id="promotion.start_buy_date" />}
                                    name="start_buy"
                                    rules={[{ required: true, message: <IntlMessages id="global.required" /> }]}
                                >
                                    <DatePicker
                                        disabledTime={d => !d || d.isSameOrBefore(record && record.end_buy)}
                                        showTime
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={<IntlMessages id="promotion.end_buy_date" />}
                                    name="end_buy"
                                    rules={[{ required: true, message: <IntlMessages id="global.required" /> }]}
                                >
                                    <DatePicker
                                        disabledTime={d => !d || d.isSameOrAfter(record && record.start_buy)}
                                        showTime
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ textAlign: "right" }}>
                                <Button
                                    style={{ marginLeft: 8 }}
                                    type='default'
                                    onClick={() => onClose()}
                                >
                                    <IntlMessages id="global.cancel" />
                                </Button>
                                <Button
                                    type="primary"
                                    style={{ marginLeft: 8 }}
                                    htmlType="submit"
                                    loading={isSubmiting}
                                >
                                    <IntlMessages id="global.save" />
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}


export default Add;
