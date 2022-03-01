/**
 * Chat Sidebar
 */
import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { Tabs } from 'antd';
import { AppleOutlined, AndroidOutlined, ExceptionOutlined } from '@ant-design/icons';
import config from '../../../config';
import { connect } from 'react-redux';

// components
import UserList from './UserList';
import { withRouter } from 'react-router-dom';
import { getAllConversationChat, getAllReservationConversationChat, chatWithSelectedUser } from '../../../redux/actions/ChatAppActions'

const { URL_ASSET } = config;

const { TabPane } = Tabs;

function findItem(arr, id) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].id == id) return i;
	}
	return -1;
}

class ChatSidebar extends Component {

	state = {
		filterAll: {
			paging: {
				perPage: 20,
				page: 1
			},
		},
		authId: null,
		loadingPageAll: true,

	}

	static getDerivedStateFromProps(props, state) {
		if (props.authUser._id && props.authUser._id != state.authId) {
			return {
				authId: props.authUser._id
			}
		}
		return null;
	}

	componentWillUnmount() {
		this.props.chatWithSelectedUser(null)
	}
	componentDidMount() {
		let { authUser } = this.props
		if (authUser.id) {
			this.props.getAllConversationChat().then(res => {
				this.setState({
					...this.state,
					dataAll: res.data,
					loadingPageAll: false
				})
			})
				.catch(err => {
					this.setState({
						...this.state,
						loadingPageUser: false
					})
				});
			this.props.getAllReservationConversationChat()
		}



	}
	componentDidUpdate(prevProps, prevState) {
		if (prevState.authId != this.state.authId && this.state.authId) {
			this.props.getAllConversationChat(this.state.filterAll).then(res => {
				this.setState({
					...this.state,
					loadingPageAll: false
				})
			})
				.catch(err => {
					this.setState({
						...this.state,
						loadingPageUser: false
					})
				})
		}
		if (this.props.newMessage && this.props.newMessage != prevProps.newMessage) {
			let a = this;
			this.setState({
				...this.state,
				filterAll: {
					paging: {
						perPage: 20,
						page: 1
					},
				},

			}, () => {
				a.props.getAllConversationChat(a.state.filterAll);
			})

		}

	}

	onChangePageAll = () => {
		let a = this;
		if (!a.state.loadingPageAll) {
			a.setState({
				...a.state,
				filterAll: {
					paging: {
						perPage: 20,
						page: a.state.filterAll.paging.page + 1
					}
				},
				loadingPageAll: true
			}, () => {
				a.props.getAllConversationChat(a.state.filterAll).then(res => {
					a.setState({
						...a.state,
						loadingPageAll: false
					})
				})
					.catch(err => {
						a.setState({
							...a.state,
							loadingPageAll: false
						})
					})
			})
		}
	}

	render() {
		var { allConversationChat, allReservationConversationChat } = this.props;
		return (
			<div className="chat-sidebar">
				{/* <div className="media align-items-center header-conversation-list">
					<span>DANH SÁCH TIN NHẮN</span>
				</div>
				<div style={{ paddingRight: "10px" }}>
					<UserList onChangePage={this.onChangePageAll} loadingPage={this.state.loadingPageAll} data={allConversationChat} />
				</div> */}
				<Tabs defaultActiveKey="1" centered={true} onChange={
					() => this.props.chatWithSelectedUser(null)
				}>
					<TabPane
						tab={
							<span>
								{/* <ExceptionOutlined /> */}
          						Đặt chỗ
        						</span>
						}
						key="1"
					>
						<div style={{ paddingRight: "10px" }}>
							<UserList onChangePage={this.onChangePageAll} loadingPage={this.state.loadingPageAll} data={allReservationConversationChat} type="RESERVATION" />
						</div>
					</TabPane>
					<TabPane
						tab={
							<span>
								{/* <AndroidOutlined /> */}
							Tin nhắn riêng
        					</span>
						}
						key="2"
					>
						<div style={{ paddingRight: "10px" }}>
							<UserList onChangePage={this.onChangePageAll} loadingPage={this.state.loadingPageAll} data={allConversationChat} />
						</div>
					</TabPane>
				</Tabs>

			</div >
		);
	}
}

function mapStateToProps(state) {
	return {
		authUser: state.auth.authUser,
		allConversationChat: state.chat.allConversationChat,
		currSetRead: state.chat.currSetRead,
		newMessage: state.chat.newMessage,
		allReservationConversationChat: state.chat.allReservationConversationChat
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getAllConversationChat: () => dispatch(getAllConversationChat()),
	}
}


export default withRouter(connect(mapStateToProps, { getAllConversationChat, getAllReservationConversationChat, chatWithSelectedUser })(ChatSidebar));
