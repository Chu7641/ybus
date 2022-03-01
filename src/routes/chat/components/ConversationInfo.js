import React from 'react';
import { Row, Col, Divider, Avatar, Tag } from 'antd';
import { Link } from "react-router-dom";
import config from '../../../config';
import { convertTimezone } from '../../../helpers/helpers';
const { URL_ASSET } = config.MEDIA_URL;

class ConversationInfo extends React.Component {

    setDataPeople(cv) {
        let data = [];
        if (cv.attend_customer) {
            data.push({ ...cv.attend_customer, isAdmin: false });
            let ad = cv.attend_admin.map(item => {
                return {
                    ...item, isAdmin: true, firstname: item.partner_firstname
                }
            });
            data.push(...ad)
            return data;
        }
        if (cv.partner) {
            return cv.partner.map(item => {
                return {
                    firstname: item.partner_firstname,
                    lastname: item.partner_lastname,
                    avatar: item.partner_avatar,
                    id: item.partner_id,
                    isAdmin: item.is_admin
                }
            })
        }
        return data;
    }

    render() {
        const { data } = this.props;
        if (data) {
            var arrP = data.partner
            let tag = {};
            if (data.info) {
                switch (data.info.status) {
                    case 'ORDER_PENDING_CONFIRMATION':
                        tag = {
                            color: 'orange',
                            title: "Chờ xác nhận"
                        };
                        break;
                    case 'ORDER_CONFIRMED':
                        tag = {
                            color: '#52c41a',
                            title: "Đã xác nhận"
                        };
                        break;
                    case 'ORDER_COMPLETED':
                        tag = {
                            color: 'lime',
                            title: "Hoàn thành"
                        };
                        break;

                    case 'ORDER_EXPIRED':
                        tag = {
                            color: 'gray',
                            title: "Hết hạn"
                        };
                        break;

                    case 'ORDER_CANCELLED':
                        tag = {
                            color: 'magenta',
                            title: "Đã huỷ"
                        };
                        break;

                    default:
                        break;
                }
            }
            return (
                <Row gutter={[10, 10]}>
                    <Col span={24}>
                        {data.object_id && data.info ? <p><span style={{ fontWeight: "500" }}>Loại tin nhắn: {data.info.type == "STAY" ? "Thuê phòng" : "Thuê xe"}</span>&nbsp;</p> : null}
                        {/* {data.type == "order" ? <p><span style={{ fontWeight: "500" }}>Tour:</span>&nbsp;{data.tour_title}</p> : null} */}
                        <p><span style={{ fontWeight: "500" }}>Ngày tạo:</span>&nbsp;{data.created_at ? convertTimezone(data.created_at, "LLLL") : ''}</p>
                        <p><span style={{ fontWeight: "500" }}>Cập nhật:</span>&nbsp;{convertTimezone(data.updated_at, "LLLL")}</p>
                    </Col>
                    {data.object_id && data.info ?
                        <>
                            <Divider />
                            <Col span={24}>
                                <p><Link to={`#`}>{data.info.property_title}</Link></p>
                                <p><span style={{ fontWeight: "500" }}>Ngày đặt:</span>&nbsp;{data.info.created_at ? convertTimezone(data.info.created_at, "YYYY/MM/DD") : ''}</p>
                                <p><span style={{ fontWeight: "500" }}>Trạng thái:</span>&nbsp;{<Tag color={tag.color} >{tag.title}</Tag>}</p>
                                <p><span style={{ fontWeight: "500" }}>Chekin:</span>&nbsp;{convertTimezone(data.info.depart, "YYYY/MM/DD")}</p>
                                <p><span style={{ fontWeight: "500" }}>Checkout:</span>&nbsp;{convertTimezone(data.info.return_date, "YYYY/MM/DD")}</p>
                            </Col>
                        </> :
                        null}
                    <Divider />
                    <Col span={24}>
                        <p style={{ fontSize: "14px", fontWeight: "500", color: "#c6c6c6" }}>Tham gia</p>
                    </Col>
                    {arrP && arrP.map(item => {
                      
                        return (
                            <Col key={item.partner_id} span={24}>
                                {item.partner_avatar ?
                                    <Avatar alt="user profile" src={this.props.config.url_asset_root + item.partner_avatar} size={50} />
                                    :
                                    <Avatar size={50} style={{ backgroundColor: '#87d068' }}>{item.partner_firstname + ' ' + item.partner_lastname}</Avatar>
                                }
                                <span style={{ fontWeight: "500", textTransform: "capitalize" }} className="ml-2">{item.partner_firstname ? item.partner_firstname : ""}&nbsp;{item.partner_lastname ? item.partner_lastname : ""}</span>
                                {/* {item.isAdmin ? <span style={{ color: "#c6c6c6", float: "right", fontSize: "12px" }}>Admin</span> : null} */}
                            </Col>
                        )
                    })}

                </Row>
            )
        }
        else return null;
    }
}

export default ConversationInfo;

