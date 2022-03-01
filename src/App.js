import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import store from './redux/store';
import MainApp from './container/MainApp';
import { NotificationContainer } from 'react-notifications';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
// css
//import 'antd/dist/antd.css';
import 'antd/dist/antd.less';
import './assets/css/custom.css';
//import './assets/css/bootstrap.min.css';
import 'react-quill/dist/quill.snow.css';
import 'react-notifications/lib/notifications.css';
import 'antd-mobile/dist/antd-mobile.css';
//import "react-big-calendar/lib/css/react-big-calendar.css";
import 'leaflet/dist/leaflet.css';
// locale
import moment from 'moment';
// without this line it didn't work
import vi_VN from 'antd/lib/locale-provider/vi_VN';
import Wrapper from './lang';
moment.locale('vi');

library.add(fab, far, fas);


export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConfigProvider locale={vi_VN} >
          <BrowserRouter basename="ybus">
            <Wrapper>
              <MainApp />
            </Wrapper>
            <NotificationContainer />
          </BrowserRouter>
        </ConfigProvider>
      </Provider>
    )
  }
}
