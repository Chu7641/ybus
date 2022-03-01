/**
 * Chat Area Component
 */
import React, { Component } from 'react';
import { Modal, Spin, Row, Col, Avatar, Button, Divider } from 'antd'
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
// import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withRouter } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import ReplyIcon from '@material-ui/icons/Reply';
import InfoIcon from '@material-ui/icons/Info';
import CheckIcon from '@material-ui/icons/Check';
import config from '../../../config';
import { LoadingOutlined, CommentOutlined, SendOutlined } from "@ant-design/icons";

// actions
import { getAllMessageChat, reply, sendMessageToUser } from '../../../redux/actions/ChatAppActions';

import Message from './Message';
import moment from 'moment';
import ConversationInfo from './ConversationInfo';



const URL_ASSET = config.MEDIA_URL;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const defaultAvt = `${URL_ASSET}public/avatars/default_avatar.png`;

class ChatArea extends Component {

	constructor(props) {
		super(props);
		this.state = {
			visibleCI: false,
			message: '',
			anchorEl: null,
			allMessagesChat: {
				list: [],
				paging: {
					page: 1,
					totalpage: 1,
					perpage: 20
				},
				attend: false
			},
			paging: {
				perpage: 20,
				totalpage: 1,
				page: 1
			},
			selectedUserID: null,
			loadingPage: false,
			loadingReply: false,
			loadingMessage: false,
			firstLoading: true
		}
		// this.changePage = debounce(this.changePage, 500)
	}

	componentWillUnmount() {
		this.setState({
			selectedUserID: null
		})
	};

	static getDerivedStateFromProps(props, state) {
		if (props.selectedUser && props.selectedUser.id != state.selectedUserID) {
			return {
				selectedUserID: props.selectedUser.id
			}
		}
		return null;
	}

	checkAtend(data) {
		let { authUser } = this.props;
		let adminArr = data && data.admin || null;
		if (!adminArr) return false;
		let a = adminArr.indexOf(authUser._id);
		return (a >= 0)
	}


	componentDidMount() {

		if (this.state.selectedUserID) {
			let a = this;
			this.props.getAllMessageChat(this.state.selectedUserID, this.state.filter).then(res => {
				this.setState({
					...this.state,
					allMessagesChat: {
						list: res.list || [],
						attend: true,
						paging: {
							current: res.paging.page,
							totalpage: res.paging.totalpage,
							perpage: res.paging.perpage
						}
					},
					firstLoading: false
				}, () => {

					a.refs.chatScroll.scrollToBottom();
				})
			})
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.selectedUserID && prevState.selectedUserID != this.state.selectedUserID) {
			let a = this;
			this.setState({
				...this.state,
				message: "",
				loadingPage: true,
				firstLoading: true,
				filter: {
					perPage: 20,
					page: 1
				}
			}, () => {
				a.props.getAllMessageChat(a.state.selectedUserID, a.state.filter).then(res => {
					a.setState({
						...a.state,
						allMessagesChat: {
							list: res.list || [],
							attend: true,
							paging: {
								current: res.paging.page,
								total_pages: res.paging.totalpage,
								perPage: res.paging.perpage
							}
						},
						loadingPage: false,
						firstLoading: false
					}, () => {
						a.refs.chatScroll.scrollToBottom();
					})
				})
					.catch(err => {
						a.setState({
							...a.state,
							loadingPage: false
						})
					})
			})

		}

		if (this.props.newMessage && this.props.newMessage != prevProps.newMessage) {
			let newM = this.props.newMessage;
		
			if (this.props.selectedUser) {
				if (newM.conversation_id == this.props.selectedUser.id) {

					let newListM = [...this.state.allMessagesChat.list];
					newListM.unshift(newM);
					let a = this;
					this.setState({
						...this.state,
						allMessagesChat: {
							...this.state.allMessagesChat,
							list: newListM
						},
					}, () => a.refs.chatScroll.scrollToBottom())

				}
			}

		}

	}

	chatOptionsHandler = event => {
		this.setState({ anchorEl: event.currentTarget });
	}

	onSubmitMessage = (event) => {
		event.preventDefault();
		let a = this;
		if (this.state.message.trim() !== '') {
			if (!this.state.loadingMessage) {
				this.setState({
					...this.state,
					loadingMessage: true
				})
				let { selectedUser, authUser } = this.props;

				let cplData = {

					id: new Date().getTime(),
					content: this.state.message.trim(),
					conversation_id: selectedUser.id,
					sender: {
						username: authUser.username,
						firstname: authUser.firstname,
						firstname: authUser.lastname,
						avatar: authUser.image || '',
					},
					cid: authUser.id,
					created_at: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
					updated_at: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
				};
				let data = {
					content: this.state.message.trim(),
				}

			

				let newListM = [...this.state.allMessagesChat.list];
				newListM.unshift(cplData);
				let a = this;
				this.setState({
					...this.state,
					allMessagesChat: {
						...this.state.allMessagesChat,
						list: newListM
					},
					message: "",
					loadingMessage: false
				}, () => {
					a.refs.chatScroll.scrollToBottom();
					a.props.sendMessageToUser(selectedUser.id, data).then(res => {

					})
						.catch(err => {
							let newListM = [];
							newListM = a.state.allMessagesChat.list.filter(item => {
								return item._id != cplData._id
							})
							a.setState({
								...a.state,
								allMessagesChat: {
									...a.state.allMessagesChat,
									list: newListM
								},
							})
						})
				})

			}
		}


	}

	//set data message

	createDataMessage(chats) {
		let lg = chats.length;
		var me = this.props.authUser.firstname + ' ' + this.props.authUser.lastname;
		if (lg === 0) return [];
		else {
			let i = 0;
			let dataMessages = [];
			for (i = 0; i < lg; i++) {
				let message = {
					id: chats[i].id,
					// author: chats[i].sender_client && chats[i].sender_client.length ? "user" : "admin",
					author: chats[i].sender ? chats[i].firstname + ' ' + chats[i].lastname : "",
					message: chats[i].content,
					timestamp: chats[i].created_at,
					avatar: chats[i].sender.avatar,
					full_name: chats[i].sender.firstname + ' ' + chats[i].sender.lastname,
					date: chats[i].created_at,
					author_id: chats[i].cid,

				}
				dataMessages.unshift(message);
			}
			return dataMessages;
		}
	}

	renderMessages(auth) {
		let dataMessages = this.createDataMessage(this.state.allMessagesChat.list)
		let i = 0;
		let messageCount = dataMessages.length;
		let messages = [];
		var me = this.props.authUser;
		while (i < messageCount) {
			let previous = dataMessages[i - 1];
			let current = dataMessages[i];
			let next = dataMessages[i + 1];
			let isMine = me.id === current.author_id;
			let currentMoment = moment(current.timestamp, 'YYYY-MM-DD HH:mm:ss');
			let prevBySameAuthor = false;
			let nextBySameAuthor = false;
			let startsSequence = true;
			let endsSequence = true;
			let showTimestamp = true;
			let middle = false;
			let avatar = current.avatar ? this.props.config.url_asset_root + current.avatar : null;
			if (previous) {
				if (previous.author != current.author) middle = true;
			}

			if (previous) {
				let previousMoment = moment(previous.timestamp, 'YYYY-MM-DD HH:mm:ss');
				let previousDuration = moment.duration(currentMoment.diff(previousMoment));
				prevBySameAuthor = previous.author_id === current.author_id;

				if (prevBySameAuthor && previousDuration.hours() < 1) {
					startsSequence = false;
				}

				if (previousDuration.hours() < 1) {
					showTimestamp = false;
				}
			}

			if (next) {
				let nextMoment = moment(next.timestamp, 'YYYY-MM-DD HH:mm:ss');
				let nextDuration = moment.duration(nextMoment.diff(currentMoment));
				nextBySameAuthor = next.author_id === current.author_id;

				if (nextBySameAuthor && nextDuration.hours() < 1) {
					endsSequence = false;
				}
			}

			messages.push(
				<Message
					key={current.id}
					isMine={isMine}
					startsSequence={startsSequence}
					endsSequence={endsSequence}
					showTimestamp={showTimestamp}
					data={current}
					avatar={avatar}
					full_name={current.full_name}
					middle={middle}
				/>
			);

			// Proceed to the next message.
			i += 1;
		}

		return messages;
	}

	onFocusInput = (e) => {
	}

	onChangeArea = (e) => {
		this.setState({
			...this.state,
			message: e.target.value
		})
	}

	changePage() {
		let a = this;
		this.setState({
			...this.state,
			paging: {
				perpage: 20,
				page: this.state.paging.page + 1
			},
			loadingPage: true
		}, () => {
			a.props.getAllMessageChat(a.state.selectedUserID, a.state.paging).then(res => {
			
				let { list, paging } = res;
				let newList = [...a.state.allMessagesChat.list];
				newList.push(...list);
				a.setState({
					...a.state,
					allMessagesChat: {
						...a.state.allMessagesChat,
						list: newList || [],
						// attend: this.checkAtend(res.data),
					},
					loadingPage: false
				})
			}).catch(err => {
				a.setState({
					...a.state,
					loadingPage: false
				})
			})
		})
	}

	onScrollSidebar = (e) => {
		if (this.state.paging.page <= this.state.paging.totalpage) {
			let t = this.refs.chatScroll.getScrollTop();
			if (t < 100) {
				if (!this.state.loadingPage) {
					this.changePage()
				}
			}
		}
	}

	toggleModal = () => {
		this.setState({ ...this.state, visibleCI: !this.state.visibleCI })
	}

	openModal = () => {
		this.setState({ ...this.state, visibleCI: !this.state.visibleCI, anchorEl: null })
	}


	handleClose = () => {
		this.setState({ anchorEl: null });
	};

	setReply = () => {
		if (!this.state.loadingReply) {
			let { selectedUser, authUser } = this.props;
			let data = {
				id: authUser._id,
			};
			let a = this;
		
			this.setState({ ...this.state, loadingReply: true }, () => {
				a.props.reply(selectedUser._id, data).then(res => {
					a.setState({
						...a.state, loadingReply: false,
						allMessagesChat: {
							...a.state.allMessagesChat,
							attend: true,
						},
						anchorEl: null
					})
				})
					.catch(err => {
						a.setState({
							...a.state, loadingReply: false
						})
					})
			})
		}
	}


	handleKeyDown(event) {
		if (event.keyCode === 13 && !event.shiftKey) {
			return this.onSubmitMessage(event);
		}
	}


	render() {
		var { selectedUser } = this.props;
		var { allMessagesChat } = this.state;
		if (selectedUser == null || this.state.selectedUserID === null) {
			return (
				<div className="chat-box-main">
					<div className="text-center">
						{/* <i className="zmdi zmdi-comments mb-2" style={{ color: "#8c8c8c", fontSize: "6em" }}></i>
						 */}
						<CommentOutlined style={{ color: "#8c8c8c", fontSize: "6em" }} />
						<h1 className="select-user-toggle" style={{ color: "#8c8c8c" }}>Chọn một người để bắt đầu trò chuyện</h1>
						<Button className="button-toggle-chat" onClick={this.props.onMenuIconPress}><h1 style={{ color: "#8c8c8c" }}>Chọn một người để bắt đầu trò chuyện</h1></Button>
					</div>
				</div>
			);
		}

		const { anchorEl } = this.state;
		var chatOptions = [<MenuItem key="show info" onClick={this.openModal}><InfoIcon style={{ color: "#5d92f4" }}></InfoIcon>&nbsp;Xem thông tin</MenuItem>];
		if (!allMessagesChat.attend) chatOptions.unshift(<MenuItem key="reply" onClick={this.setReply}>{this.state.loadingReply ? <Spin indicator={antIcon}><React.Fragment><ReplyIcon style={{ color: "#5d92f4" }}></ReplyIcon>&nbsp;Trả lời</React.Fragment></Spin> : <React.Fragment><ReplyIcon style={{ color: "#5d92f4" }}></ReplyIcon>&nbsp;Trả lời</React.Fragment>} </MenuItem>)
		var customer = selectedUser && selectedUser.partner ? selectedUser.partner[0] : {};
		var avatar = customer.partner_avatar ? this.props.config.url_asset_root + customer.partner_avatar : '';
		var me = this.props.authUser.firstname + ' ' + this.props.authUser.lastname;
		return (
			<React.Fragment>

				{/* header */}
				<div className="chat-main-body">
					<div className="chat-head pb-2">
						<div className="d-flex justify-content-between align-items-center">
							<div className="media align-items-center">
								<IconButton
									className="mr-3 chat-sidebar-toggler d-none"
									color="inherit"
									aria-label="open drawer"
									onClick={this.props.onMenuIconPress}
								>
									<MenuIcon />
								</IconButton>
								<div className="mr-2 ml-4">
									{avatar ?
										<Avatar alt="user profile" src={avatar} size={45} />
										:
										<Avatar size={45} style={{ backgroundColor: '#87d068' }}>{customer.partner_firstname + ' ' + customer.partner_lastname}</Avatar>
									}
								</div>
								<div className="media-body mt-1">
									<h5 className="mb-0" style={{ textTransform: "capitalize" }} > {customer.partner_firstname + ' ' + customer.partner_lastname}</h5>
									<span className="font-xs text-muted">{selectedUser.status}</span>
								</div>
							</div>
							<div>
								<IconButton
									aria-owns={anchorEl ? 'simple-menu' : null}
									aria-haspopup="true"
									onClick={this.chatOptionsHandler}
								>
									<i className="zmdi zmdi-more-vert"></i>
								</IconButton>
								<Menu
									id="simple-menu"
									anchorEl={anchorEl}
									open={Boolean(anchorEl)}
									onClose={this.handleClose}
								>
									{chatOptions}
								</Menu>
							</div>
						</div>
					</div>



					{/* chat area */}

					{this.state.firstLoading ?
						<Scrollbars
							className="rct-scroll"
							autoHide
							ref="chatScroll"
							style={{ height: 'calc(100vh - 200px)' }}
							onScroll={this.onScrollSidebar}
						>
							<Row type="flex" justify="space-around" align="middle" style={{ height: "100%" }}>
								<Col className="text-center">
									<LoadingOutlined style={{ fontSize: "30px" }} />
								</Col>
							</Row>
						</Scrollbars> :

						<React.Fragment>
							<Scrollbars
								className="rct-scroll"
								autoHide
								ref="chatScroll"
								style={{ height: 'calc(100vh - 250px)' }}
								onScroll={this.onScrollSidebar}
							>
								<div className="chat-body p-3" style={{ padding: "10px" }}>
									{this.state.loadingPage ?
										<div align="center"><LoadingOutlined /></div>
										:
										null}
									{this.renderMessages(me)}
								</div>
							</Scrollbars>

							{/* chat footer */}

							<div className="chat-footer d-flex px-4 align-items-center py-3">
								{/* {allMessagesChat.attend ? */}
								<React.Fragment>
									<form className="mr-3 w-100" onSubmit={this.onSubmitMessage}>
										<div className="">
											<textarea
												type="text"
												id="search-msg"
												placeholder="Nhập..."
												value={this.state.message}
												className=" form-control"
												style={{ height: "50px", width: "100%" }}
												onChange={this.onChangeArea}
												onFocus={this.onFocusInput}
												autoFocus={true}
												onKeyDown={this.handleKeyDown.bind(this)}
											/>
										</div>
									</form>
									<Button
										type="primary"
										onClick={this.onSubmitMessage}
									>
										Gửi <SendOutlined />
									</Button>

								</React.Fragment>
								{/* :
									(
										this.state.loadingReply ?
											<Spin indicator={antIcon} wrapperClassName="dat-spin-footer-chat">
												<a style={{ margin: "auto", color: "#038fde" }}>Nhấn vào đây để trả lời.</a>
											</Spin>
											: <a onClick={this.setReply} style={{ margin: "auto", color: "#038fde" }}>Nhấn vào đây để trả lời.</a>
									) */}


								{/* } */}
							</div>
						</React.Fragment>
					}
				</div>

				<Modal
					title="Thông tin cuộc trò chuyện"
					visible={this.state.visibleCI}
					footer={false}
					onCancel={this.toggleModal}
					centered={true}
					maskClosable={true}
					destroyOnClose={true}
				>
					<ConversationInfo data={selectedUser} config={this.props.config}></ConversationInfo>
				</Modal>

			</React.Fragment>
		);
	}
}

function mapStateToProps(state) {
	return {
		selectedUser: state.chat.selectedUser,
		authUser: state.auth.authUser,
		newMessage: state.chat.newMessage,
		config: state.config,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getAllMessageChat: (id, filter) => dispatch(getAllMessageChat(id, filter)),
		reply: (id, data) => dispatch(reply(id, data)),
		sendMessageToUser: (id, data) => dispatch(sendMessageToUser(id, data))
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatArea));
