import { notification } from 'antd';
import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import AppLayout from '../layouts';
import { routes } from '../routes';
import NotFoundPage from '../routes/error/NotFoundPage';

const openErrorNotification = (error) => {
    notification['error']({
        message: 'Có lỗi xảy ra trong hệ thống',
        description: `Lỗi xảy ra khi người dùng gọi hàm ${error.function}`,
        placement: 'bottomRight'
    });
};
class AppRoutes extends React.Component {
    componentDidMount() {
        // const { match, authUser, receiveMessageCVS } = this.props;
        // this.pusher = new Pusher('001be64f38e5c8d7c0ac', {
        //     cluster: 'ap1',
        // });
        // const channelMessage = this.pusher.subscribe(authUser.id.toString());
        // channelMessage.bind('2stay-chat', function (data) {
        //     console.log(data, 'data from pusher', receiveMessageCVS);

        //     receiveMessageCVS(data);
        // });
    }
    componentWillUnmount() {
        // const { match, authUser, receiveMessageCVS } = this.props;
        // this.pusher.unsubscribe(authUser.id.toString());
    }
    render() {
        const { match, authUser } = this.props;
        // var title = authUser ? `${authUser.role_name} - CSKH - BV Anh Quất` : 'CSKH - BV Anh Quất';
        if (!authUser) {
            return <Redirect to='/login' />;
        }




        return (
            <React.Fragment>
                <Helmet>
                    {/* <title>{title}</title> */}
                </Helmet>
                <AppLayout>
                    <Switch>
                        {
                            routes.map((route, index) => {
                                return (
                                    <ProtectedRoute exact authUser={authUser} permission={route.permission} path={`${match.url}/${route.path}`} component={route.component} key={index} />
                                )
                            })
                        }
                        <Route component={NotFoundPage} />
                    </Switch>
                </AppLayout>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        authUser: state.auth.authUser
    }
}

export default withRouter(connect(mapStateToProps)(AppRoutes));


const ProtectedRoute = ({ authUser, permission, component: Component, ...rest }) => (
    <Route
        {...rest}
        exact
        render={(props) => {
            if (authUser) {

                return <Component {...props} />;
            } else {
                return <Redirect to='/login' />;
            }
        }}
    />
)



