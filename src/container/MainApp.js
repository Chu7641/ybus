import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect, Switch, Route } from 'react-router-dom';
import Login from '../routes/auth/Login';

// App locale
import Wrapper from '../lang';
// actions
import { getAuthUser } from '../redux/actions/AuthActions';
import { LoadingScreen } from '../components/LoadingScreen';

//route
import AppRoutes from './AppRoutes';
import ResetPassword from '../routes/auth/ResetPassword';
import Signup from '../routes/auth/Signup';


class MainApp extends Component {
    state = {
        isLoading: true
    }

    async componentDidMount() {
        // await this.props.getConfig();
        this.props.getAuthUser().then(() => {
            this.setState({ isLoading: false });

        }).catch(() => {
            this.setState({ isLoading: false })
        })

    }

    render() {



        var { isLoading } = this.state;



        if (isLoading) {
            return (
                <LoadingScreen />
            )
        }



        const { location, match } = this.props;
        if (location.pathname === "/") {
            return <Redirect to={"/app/home"} />;
        }

        return (

            <React.Fragment>

                {/* <IntlProvider
                    locale={'vi'}
                > */}

                <Switch>
                    <Route exact path="/login" component={Login}></Route>
                    <Route exact path="/resetpassword" component={ResetPassword}></Route>
                    <Route exact path="/signup" component={Signup}></Route>
                    <Route path={`${match.url}app`} component={AppRoutes}></Route>
                </Switch>
                {/* </IntlProvider> */}

            </React.Fragment>

        )


    }
}

function mapStateToProps(state) {
    return {
        authUser: state.auth.authUser,

    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAuthUser: () => dispatch(getAuthUser()),
        // getConfig: () => dispatch(getConfig())
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainApp));