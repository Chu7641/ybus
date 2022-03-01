/**
 * Recent Chat Users
 */
import React, { Component } from 'react';
import List from '@material-ui/core/List';
import { connect } from 'react-redux';

// components
import UserListItem from './UserListItem';

// actions
import { chatWithSelectedUser } from '../../../redux/actions/ChatAppActions';

class RecentChatUsers extends Component {

    static defaultProps = {
        data: []
    }

    /**
     * Swicth Chat With User
     * @param {*object} user
     */
    switchChatWithUser(user) {
        this.props.chatWithSelectedUser(user);
    }

    render() {
        const { recentChatUsers, selectedUser, data, authUser, type } = this.props;
        if (recentChatUsers === null) {
            return (
                <div className="no-found-user-wrap">
                    <h4>No User Found</h4>
                </div>
            );
        }
        return (
            <List className="p-0">
                {data.map((user, index) => (
                    <UserListItem
                        selectedUser={selectedUser}
                        // selectedUser={771}
                        user={user}
                        key={user.id}
                        authId={authUser.id}
                        onClickListItem={() => this.switchChatWithUser(user)}
                        config={this.props.config}
                        type={type}
                    />
                ))}
            </List>
        );
    }
}

function mapStateToProps(state) {
    return {
        selectedUser: state.chat.selectedUser,
        authUser: state.auth.authUser,
        config: state.config
    };
};

function mapDispatchToProps(dispatch) {
    return {
        chatWithSelectedUser: (user) => dispatch(chatWithSelectedUser(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecentChatUsers);
