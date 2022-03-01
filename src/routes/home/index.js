import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Typography, Divider, Space } from 'antd';
import CardWithIcon from '../../components/CardWithIcon';
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardTwoTone, MessageTwoTone, HomeTwoTone, ReconciliationTwoTone, CalendarTwoTone, DollarTwoTone } from '@ant-design/icons';
import EventCalendar from '../appointments/EventCalendar';
class Home extends Component {

    render() {
        var { authUser } = this.props;

        const cards = [
            {
                icon: <IdcardTwoTone />,
                title: "Bệnh nhân",
                description: "Cung cấp thông tin cá nhân và cách chúng tôi có thể liên hệ bạn",
                link: '/app/profile'
            },
            {
                icon: <MessageTwoTone />,
                title: "Lịch hẹn",
                description: "Nhắn tin trực tiếp tới khách hàng của bạn, đơn giản và nhanh chóng",
                link: '/app/conversations'
            },
            {
                icon: <HomeTwoTone />,
                title: "Thu Chi",
                description: "Danh sách nhà/phòng cho thuê của bạn trên hệ thống của chúng tôi",
                link: '/app/property'
            },
            {
                icon: <ReconciliationTwoTone />,
                title: "Đặt hàng",
                description: "Dễ dàng quản lý chỗ được đặt trước trên hệ thống",
                link: '/app/reservations'
            },
            {
                icon: <CalendarTwoTone />,
                title: "Lịch",
                description: "Quản lý giá phòng dựa theo từng thời điểm trong năm",
                link: '/app/calendar'
            },
            {
                icon: <DollarTwoTone />,
                title: "Doanh thu",
                description: "Thống kê doanh thu chính xác và đầy đủ dành cho bạn",
                link: '/app/earning'
            },
        ]

        return (
            <div>
                <Row gutter={[16, 24]}>
                    <Col span={3}></Col>
                    <Col span={18}>
                        {/* <Typography.Title level={1}>Xin chào, {authUser.firstname} {authUser.lastname}</Typography.Title> */}
                        {/* <div>
                            <Typography.Text type="secondary"><MailOutlined /> {authUser.email}</Typography.Text>
                            <Divider type="vertical" />
                            <Typography.Text type="secondary"><PhoneOutlined /> {authUser.mobile}</Typography.Text>
                        </div> */}
                    </Col>
                    <Col span={3}></Col>
                </Row>
{/* 
                <Row>

                    <EventCalendar></EventCalendar>

                </Row> */}

                {/* <Row gutter={16}>
                    <Col md={3} sm={0}></Col>
                    <Col md={18} sm={24}>
                        <Row gutter={[16, 24]}>

                            {
                                cards.map((card, index) => (
                                    <Col span={8} key={index}>
                                        <CardWithIcon
                                            link={card.link}
                                            icon={card.icon}
                                            title={card.title}
                                            description={card.description}
                                        />
                                    </Col>
                                ))
                            }

                        </Row>
                    </Col>
                    <Col md={3} sm={0}></Col>
                </Row> */}

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        authUser: state.auth.authUser
    }
}

export default connect(mapStateToProps)(Home);