import React from "react";
import PropTypes from "prop-types";
import { Card, Tabs } from "antd";
import IntlMessages from "../../components/IntlMessage";
import Agent from "../busAgent";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import Travel from "./Travel";
import Sales from "./Sales";
import Agents from "./Agents";
Account.propTypes = {};

function Account(props) {
  const { TabPane } = Tabs;
  const history = useHistory();
  const handleChangeTab = (key) => {
    // props.history.push('/foo')
    // history.push("/travel");
  };
  return (
    <Router>
      <div>
        <Card>
          <Tabs
            onChange={handleChangeTab}
            type="card"
            size="large"
            defaultActiveKey="busroute"
          >
            <TabPane tab={<IntlMessages id="global.travel" />} key="busroute">
              <Travel />
            </TabPane>
            <TabPane tab={<IntlMessages id="global.sales" />} key="bus">
              <Sales />
            </TabPane>
            <TabPane
              tab={<IntlMessages id="global.agents" />}
              key="seattemplate"
            >
              <Agents />
            </TabPane>
          </Tabs>
        </Card>
       
      </div>
    </Router>
  );
}

export default Account;
