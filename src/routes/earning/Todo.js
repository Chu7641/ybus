import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Row, Button, Spin, Divider, Avatar, Col, Statistic, List } from 'antd';
import IntlMessages from "../../components/IntlMessage";
import {
    MessageOutlined,
    DollarOutlined,
    UserOutlined,
    FieldTimeOutlined
} from '@ant-design/icons';
import NumberFormat from 'react-number-format';
import { getEarningOverview } from '../../redux/actions/EarningActions';
// actions


class Todo extends Component {
    state = {

    }

    componentDidMount() {
        this.props.getEarningOverview()
    }

    render() {
        const { listOverview } = this.props
        return (
            <Row gutter={8} justify="space-between">

                <Col className="gutter-row" style={{ width: '30%' }}>
                    <Card className="widget-cards card-blue">
                        <DollarOutlined className="widget-icon" />
                        <span>
                            <div className="text-right widget-big-text">
                                <NumberFormat value={listOverview.in_wallet && listOverview.in_wallet.total ? listOverview.in_wallet.total : 0} thousandSeparator={true} displayType="text" />
                                <span style={{ fontSize: '14px' }}>
                                    VND
                                </span>
                            </div>
                           
                               
                                <div className="text-right"><IntlMessages id='global.earning_available' /></div>
                             
                               

                        </span>
                    </Card>
                </Col>
                <Col className="gutter-row" style={{ width: '30%' }}>
                    <Card className="widget-cards card-orange">
                        <DollarOutlined className="widget-icon" />
                        <span>
                            <div className="text-right widget-big-text">
                                <NumberFormat value={listOverview.paid_out && listOverview.paid_out.total ? listOverview.paid_out.total : 0} thousandSeparator={true} displayType="text" />
                                <span style={{ fontSize: '14px' }}>
                                    VND
                                </span>
                            </div>

                            <div className="text-right"><IntlMessages id='global.earning_paid' /></div>
                        </span>
                    </Card>
                </Col>

                <Col className="gutter-row" style={{ width: '30%' }}>
                    <Card className="widget-cards card-red" style={{ width: '100%' }}>
                        <DollarOutlined className="widget-icon" />
                        <span>
                            <div className="text-right widget-big-text">
                                <NumberFormat value={listOverview.pending && listOverview.pending.total ? listOverview.pending.total : 0} thousandSeparator={true} displayType="text" />
                                <span style={{ fontSize: '14px' }}>
                                    VND
                                </span>
                            </div>
                            <div className="text-right"><IntlMessages id='global.earning_pending' /></div>
                        </span>
                    </Card>
                </Col>
            </Row>
        )
    }
}

function mapStateToProps(state) {
    return {
        listOverview: state.earning.listOverview
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getEarningOverview: () => dispatch(getEarningOverview()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Todo);
