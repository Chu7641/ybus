import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Row, Button, Spin, Divider, Modal, Col } from 'antd';
import {
    UserOutlined,
    FormatPainterOutlined,
    ShopOutlined,
    ShoppingOutlined,
    FieldTimeOutlined,
    DollarOutlined,
} from '@ant-design/icons'
import NumberFormat from 'react-number-format';
// actions


class Overview extends Component {
    state = {
      
    }

    componentDidMount() {
     
    }

    render() {
      

        return (
            <Row gutter={8} justify="space-between">
                <Col className="gutter-row" style={{width: '20%'}} >
                    <Card className="widget-cards card-green">
                        <UserOutlined className="widget-icon" />
                        <span>
                            <div className="text-right widget-big-text">
                                <NumberFormat value={1000} thousandSeparator={true} displayType="text" />
                            </div>
                            <div className="text-right">tài khoản</div>
                        </span>
                    </Card>
                </Col>
                <Col className="gutter-row" style={{width: '20%'}}>
                    <Card className="widget-cards card-blue">
                        <FieldTimeOutlined className="widget-icon" />
                        <span>
                            <div className="text-right widget-big-text">
                                <NumberFormat value={500} thousandSeparator={true} displayType="text" />
                            </div>
                            <div className="text-right">Lịch hẹn</div>
                        </span>
                    </Card>
                </Col>
                <Col className="gutter-row" style={{width: '20%'}}>
                    <Card className="widget-cards card-orange">
                        <UserOutlined className="widget-icon" />
                        <span>
                            <div className="text-right widget-big-text">
                                <NumberFormat value={50} thousandSeparator={true} displayType="text" />
                            </div>
                            <div className="text-right">Nhân viên</div>
                        </span>
                    </Card>
                </Col>
              
                <Col className="gutter-row" style={{width: '20%'}}>
                    <Card className="widget-cards card-red" style={{width: '100%'}}>
                        <DollarOutlined className="widget-icon" />
                        <span>
                            <div className="text-right widget-big-text">
                                <NumberFormat value={1000} thousandSeparator={true} displayType="text" />
                            </div>
                            <div className="text-right">nghìn VND</div>
                        </span>
                    </Card>
                </Col>
            </Row>
        )
    }
}

// function mapStateToProps(state) {
//     return {
//     }
// }

// function mapDispatchToProps(dispatch) {
//     return {
//     }
// }

export default connect(null, null)(Overview);