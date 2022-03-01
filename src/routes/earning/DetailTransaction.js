import React, { Component } from 'react'
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Tabs, Radio, Tag, Table } from "antd";
import IntlMessages from "../../components/IntlMessage";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import NumberFormat from 'react-number-format';
import moment from 'moment'
class DetailTransaction extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.columns = [
            {
                title: <IntlMessages id="global.order_number" />,
                key: "order_number",
                sorter: true,
                dataIndex: "order_number",
                render: (text, record) => {
                    return (
                        <Link to={`/app/reservations/${record.id}`}>
                            {record.order_number}
                        </Link>
                    );
                },
            },


            {
                title: <IntlMessages id="global.property_title" />,
                key: "property_title",
                sorter: true,
                dataIndex: "property_title",
                render: (text, record) => {
                    return (
                        <Link to={`/app/property/form?id=${record.object_id}`}>
                            {record.property_title}
                        </Link>
                    );
                },
            },


            // {
            //     title: <IntlMessages id="global.adults" />,
            //     key: "adults",
            //     sorter: true,
            //     dataIndex: "adults",
            //     align: 'center',

            // },

            {
                title: <IntlMessages id="global.earned" />,
                key: "sup_earning",
                sorter: true,
                dataIndex: "sup_earning",
                render: (text, record) => {
                    return (
                        <NumberFormat value={+record.sup_earning} thousandSeparator={true} displayType="text" suffix=" đ" />

                    );
                },
            },

            {
                title: <IntlMessages id="global.depart" />,
                dataIndex: "depart",
                key: "depart",
                align: 'center',
                render: (text, record) => (
                    <React.Fragment>
                        <div>{moment(record.depart).format("DD/MM/YYYY")}</div>
                    </React.Fragment>
                ),
                sorter: true
            },

            {
                title: <IntlMessages id="global.return_date" />,
                dataIndex: "return_date",
                key: "return_date",
                align: 'center',
                render: (text, record) => (
                    <React.Fragment>
                        <div>{moment(record.return_date).format("DD/MM/YYYY")}</div>
                    </React.Fragment>
                ),
                sorter: true
            },

            // {
            //     title: <IntlMessages id="global.order_created" />,
            //     dataIndex: "created_at",
            //     key: "created_at",
            //     align: 'center',
            //     render: (text, record) => (
            //         <React.Fragment>
            //             <div>{moment(record.created_at).format("HH:mm")}</div>
            //             <div>{moment(record.created_at).format("DD/MM/YYYY")}</div>
            //         </React.Fragment>
            //     ),
            //     sorter: true
            // },


        ];
    }
    componentDidMount() {

    }
    onHandleClose = () => {
        this.props.onClose();
    };
    cssRow = () => {
        return {
            borderBottom: "1px solid #e8e8e8",
            padding: "0 !important",
            marginBottom: "1em ",

        };
    };
    render() {
        const { open, detail } = this.props

        return (
            <Modal
                visible={open}
                footer={null}
                onCancel={this.onHandleClose}
                width='60%'
            >
                <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                    <Col xs={24} md={12}>
                        <Row style={this.cssRow()}>
                            <Col xs={10} md={12}>
                                <p>
                                    <IntlMessages id="global.status" />:
                      </p>
                            </Col>
                            <Col xs={14} md={12} className='custom-col' >
                                <p>{detail && detail.status ?
                                    detail.status == 'PENDING' ?
                                        <Tag color='orange'><IntlMessages id='global.transaction_pending' /></Tag>
                                        :
                                        detail.status == 'APPROVED' ?
                                            <Tag color='green'><IntlMessages id='global.transaction_approved' /></Tag>
                                            :
                                            <Tag color='red'><IntlMessages id='global.transaction_declined' /></Tag>
                                    : null}</p>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} md={12}>
                        <Row style={this.cssRow()}>
                            <Col xs={10} md={12}>
                                <p>
                                    <IntlMessages id="transaction.amount" />:
                      </p>
                            </Col>
                            <Col xs={14} md={12} className='custom-col' >
                                <p>{detail && detail.amount ?
                                    <NumberFormat value={+detail.amount} thousandSeparator={true} displayType="text" suffix=" đ" />
                                    : null}</p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                    <Col xs={24} md={12}>
                        <Row style={this.cssRow()}>
                            <Col xs={10} md={12}>
                                <p>
                                    <IntlMessages id="transaction.created_at" />:
                      </p>
                            </Col>
                            <Col xs={14} md={12} className='custom-col' >
                                <p>{detail && detail.created_at ?
                                    moment(detail.created_at).format("HH:mm DD/MM/YYYY")
                                    : null}</p>
                            </Col>
                        </Row>
                    </Col>

                </Row>
                <Table
                    tableLayout="auto"
                    columns={this.columns}
                    dataSource={detail && detail.order ? detail.order.length ? detail.order : [] : []}
                    rowKey="id"
                    size="small"
                    pagination={false}
                    scroll={{y:'500px'}}
                />

            </Modal>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        detail: state.transaction.detail,
        config: state.config,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailTransaction));