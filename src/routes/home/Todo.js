import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Row, Button, Spin, Divider, Avatar, Col, Statistic, List } from 'antd';
import {
    UserOutlined,
    FormatPainterOutlined,
    ShopOutlined,
    ShoppingOutlined,
    MessageOutlined,
    ArrowRightOutlined,
    FieldTimeOutlined
} from '@ant-design/icons';
// actions


class Todo extends Component {
    state = {

    }

    componentDidMount() {

    }

    render() {

        return (
            <Card>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={8}>
                        <Statistic title="Lịch hẹn đang chờ tiếp nhận" value={100} prefix={<FieldTimeOutlined />} />
                        <Link to="/app/tiep_nhan">
                            <Button className="p-0" type="link">
                                Tiếp nhận ngay <ArrowRightOutlined />
                            </Button>
                        </Link>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Statistic title="Lịch hẹn khám sức khoẻ đang chờ tiếp nhận" value={10} prefix={<FieldTimeOutlined />} />
                        <Link to="/app/tiep_nhan_ksk">
                            <Button className="p-0" type="link">
                                Tiếp nhận ngay <ArrowRightOutlined />
                            </Button>
                        </Link>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Statistic title="Tin nhắn chưa trả lời" value={9} prefix={<MessageOutlined />} />
                        <Link to="/app/conversation">
                            <Button className="p-0" type="link">
                                Trả lời ngay <ArrowRightOutlined />
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </Card>
        )
    }
}

// function mapStateToProps(state) {
//     return {
//       
//     }
// }

// function mapDispatchToProps(dispatch) {
//     return {
//        
//     }
// }

export default connect(null, null)(Todo);
