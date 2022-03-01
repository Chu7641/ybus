/**
 * User List Item
 */
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import classnames from 'classnames';

// helpers
import { textTruncate } from '../../../helpers/helpers';

import moment from 'moment';
import { Avatar, Tag, Divider } from 'antd';

import config from '../../../config';
const URL_ASSET = config.MEDIA_URL;

class UserListItem extends React.Component {

    static defaultProps = {
        user: {}
    }


    setSenderName(user) {
        let n = "";
        var last_message = user && user.last_message || ""
        if (!last_message) return n;
        if (last_message.cid == this.props.authId) return "Bạn: ";

        return "";

    }

    setDate(user) {
        var last_message = user && user.last_message || ""
        if (!last_message) return "";
        let { created_at } = last_message;
        if (!created_at) return "";
        var m = moment.utc(created_at); // parse input as UTC
        moment.updateLocale("en", {
            relativeTime: {
                future: "in %s",
                past: "%s ago",
                s: "now",
                ss: "%ss",
                m: "a min",
                mm: "%dm",
                h: "1h",
                hh: "%dh",
                d: "a day",
                dd: "%dd",
                M: "month",
                MM: "%dM",
                y: "year",
                yy: "%dY"
            }
        })
        if (m.clone().local().format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")) {

            return m.clone().local().fromNow(true);
        }
        else return m.clone().local().format("DD/MM/YYYY, HH:mm")

    }

    render() {
        var { selectedUser, user, type } = this.props;
        // console.log('userrrrrr', user, selectedUser, type);
        var last_message = user && user.last_message ? user.last_message.content : ""
        var partner = user && user.partner ? user.partner[0] : {};
        var avatar = partner.partner_avatar ? this.props.config.url_asset_root + partner.partner_avatar : null;
        var tag = {};
        if (type && type == 'RESERVATION') {
            switch (user.info.status) {
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
            <ListItem
                onClick={() => this.props.onClickListItem()}
                className={classnames('user-list-item',
                    { 'item-active': selectedUser && selectedUser.id == user.id }
                )}
                key={user.id}
            >
                <div className="d-flex justify-content-between w-100 align-items-center pt-2">
                    <div className="media align-items-center w-95">
                        <div className="media-left position-relative mr-15">
                            {avatar ?
                                <Avatar alt="user profile" src={avatar} size={50} /> :
                                <Avatar size={50} style={{ backgroundColor: '#87d068' }}>{partner.partner_firstname + " " + partner.partner_lastname} </Avatar>
                            }
                            {/* {user.isActive && (<span className="badge badge-success badge-xs p-5 rct-notify">&nbsp;</span>)} */}


                        </div>
                        <div className="media-body ml-2">
                            <h5 className="mb-0" style={{ fontWeight: "500", fontSize: "17px" }}>{textTruncate(partner.partner_firstname + ' ' + partner.partner_lastname, 20)} {type && type == "RESERVATION" ? <span style={{ color: tag.color, fontSize: "14px" }}>{tag.title}</span> : null}</h5>
                            {
                                user.unread ?
                                    <span className="font-xs d-block" style={{ fontWeight: "bold" }}><span style={{ textTransform: "capitalize" }} >{this.setSenderName(user)}</span>{textTruncate(last_message, 50)}{this.setDate(user) ? <span style={{ color: "#c9c9c9", fontWeight: "normal" }}> . {this.setDate(user)}</span> : null}</span>
                                    :
                                    <span className="font-xs d-block" ><span style={{ textTransform: "capitalize" }} >{this.setSenderName(user)}</span>{textTruncate(last_message, 50)}{this.setDate(user) ? <span style={{ color: "#c9c9c9", fontWeight: "normal" }}> . {this.setDate(user)}</span> : null}</span>
                            }
                        </div>
                    </div>
                    {
                        selectedUser && selectedUser.id == user.id ? null : user.unread ?
                            // <div className="text-right msg-count">
                            //     <span className="badge badge-primary rounded-circle" style={{ width: "10px", height: "10px" }}> </span>
                            // </div>
                            null
                            : null
                    }

                </div>
            </ListItem >
        );

    }
}
export default UserListItem;
