/**
* Chat
*/
import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';
import LayoutContent from '../../components/LayoutContent';

// components
import ChatArea from './components/ChatArea';
import ChatSidebar from './components/ChatSidebar';
import "./style.css";
import './_dashboard.scss';
import './_pages.scss';
import PageTitle from '../../components/PageTitle';
import IntlMessages from "../../components/IntlMessage";
import { Table, Tag, Card, Spin, Avatar, Button, Modal } from "antd";
const drawerWidth = 310;
const routes = [
	{
		path: '/',
		breadcrumbName: 'Trang chủ',
	},
	{
		path: '/conversations',
		breadcrumbName: 'Hộp thư đến',
	},
];
const styles = theme => ({
	root: {
		flexGrow: 1,
		zIndex: 1,
		overflow: 'hidden',
		position: 'relative',
		display: 'flex',
		width: '100%',
	},
	toolbar: theme.mixins.toolbar,
	drawerPaper: {
		width: 230,
		[theme.breakpoints.up('md')]: {
			position: 'relative',
			width: drawerWidth
		},
		backgroundColor: '#fff'
	},
	content: {
		flexGrow: 1
	},
});

class ChatList extends Component {

	state = {
		mobileOpen: false,
	};

	handleDrawerToggle = () => {
		this.setState({ mobileOpen: !this.state.mobileOpen });
	}



	render() {
		const { classes, theme } = this.props;
		const drawer = <ChatSidebar />
		return (

			<React.Fragment>
				<LayoutContent>

					<PageTitle
						title={<IntlMessages id="sidebar.conversation" />}
						routes={routes}
					/>
					<hr />

					<div className={classes.root}>
						<Hidden mdUp className="user-list-wrap">
							<Drawer
								variant="temporary"
								anchor={theme.direction === 'rtl' ? 'right' : 'left'}
								open={this.state.mobileOpen}
								onClose={this.handleDrawerToggle}
								classes={{
									paper: classes.drawerPaper,
								}}
								ModalProps={{
									keepMounted: true,
								}}
							>
								{drawer}
							</Drawer>
						</Hidden>
						<Hidden smDown implementation="css" className="user-list-wrap">
							<Drawer
								variant="permanent"
								open
								classes={{
									paper: classes.drawerPaper,
								}}
							>
								{drawer}
							</Drawer>
						</Hidden>
						<div className={`chat-content ${classes.content}`} style={{ alignSelf: 'center' }} >
							<ChatArea onMenuIconPress={this.handleDrawerToggle} />
						</div>
					</div>


				</LayoutContent>
			</React.Fragment>
		);
	}
}

export default withStyles(styles, { withTheme: true })(ChatList);
