/**
 * User List
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import { withRouter } from 'react-router-dom';

// components
import RecentChatUsers from './RecentChatUsers';
import { LoadingOutlined } from "@ant-design/icons";




class UserList extends Component {



    render() {
        var { data, type } = this.props;
        return (
            <div className="chat-list">
                <Scrollbars
                    className="rct-scroll"
                    autoHide
                    style={{ height: 'calc(90vh - 64px)' }}
                    ref="chatScrollSidebar"
                >
                    {data.list.length == 0 ?
                        <p className="text-center">
                            Bạn chưa có cuộc trò chuyện nào.
                        </p> :
                        <RecentChatUsers data={data.list} type={type} />
                    }

                    {this.props.loadingPage ?
                        <div align="center"><LoadingOutlined /></div>
                        :
                        null}
                </Scrollbars>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
    }
}

export default withRouter(connect(null, mapDispatchToProps)(UserList));
