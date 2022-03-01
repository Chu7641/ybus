import React from "react";
import PropTypes from "prop-types";
import { Card, Tabs } from "antd";
import IntlMessages from "../../components/IntlMessage";
import Agent from "../busAgent";

Account.propTypes = {};

function Account(props) {
  const { TabPane } = Tabs;
  return (
    <div>
      <Card>
        <Tabs type='card' size="large" defaultActiveKey="1">
          <TabPane
            tab={<IntlMessages id="global.agent" />}
            key="1"
          >
              <Agent/>
          </TabPane>
          <TabPane
            tab={<IntlMessages id="admin.user" />}
            key="2"
          ></TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

export default Account;
