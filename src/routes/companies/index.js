import { Card, Tabs, Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import IntlMessages from "../../components/IntlMessage";
import Bus from "../bus";
import BusRoute from "../busRoute";
import BusSeatTemplates from "../busSeatTemplate";
import Notifications from "./Notifications";
import Apps from "./Apps";
import Sales from "./Sales";
import Payment from "./Payment";
import Setting from "./Setting";
import agentApi from "../../api/agent";
import { ExclamationCircleOutlined } from '@ant-design/icons';


Companies.propTypes = {};

function Companies(props) {
  console.log(props.match.params.id);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const id=props.match.params.id;
  const [reload,setReload]=useState(false);
  const [activeTab, setActiveTab] = useState('busroute');
  const [isUnsaved,  setIsUnsaved] = useState(false);
  // const [handleSave, setHandleSave] = useState(() => {});

  const handleSave = useRef(null);
  const setHandleSave = (save = () => {}) => {
    handleSave.current = save;
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      let result = await agentApi.getDetail(id);
      let items = result.data;
      // console.log('result.data', result.data);
      setItem(items);
      setLoading(false);
    }
    fetchData();
  }, [id,reload]);
  const history = useHistory();
  const { TabPane } = Tabs;
  const handleChangeTab = (key) => {
    // console.log(key);
    //  history.push(`/app/companies/${key}`);
    if(isUnsaved) {
      return Modal.confirm({
        title: 'Confirm',
        icon: <ExclamationCircleOutlined />,
        content: 'You have just modified some information. Do you want to save the modifications ?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: () => {
          handleSave.current && handleSave.current();
          // setActiveTab(key);
          // setIsUnsaved(false);
          return;
        },
        onCancel: () => {
          setActiveTab(key);
          setIsUnsaved(false);
        }
      })
    }
    setActiveTab(key)
  };
  const handleReload=()=>{
    setReload(!reload)
  }
  return (
    <div>
      <Card loading={loading}>
        <Tabs
          onChange={handleChangeTab}
          type="card"
          size="large"
          defaultActiveKey="busroute"
          activeKey={activeTab}
        >
          <TabPane tab={<IntlMessages id="global.route" />} key="busroute" >
            <BusRoute  agentId={item ? item.id ?? null : null} />
          </TabPane>
          <TabPane tab={<IntlMessages id="global.bus" />} key="bus">
            <Bus agentId={item ? item.id ?? null : null} />
          </TabPane>
          <TabPane
            tab={<IntlMessages id="global.bus_seat_template" />}
            key="seattemplate"
          >
            <BusSeatTemplates agentId={item ? item.id ?? null : null} />
          </TabPane>
          <TabPane
            tab={<IntlMessages id="global.notifications" />}
            key="notifications"
            
          >
            <Notifications  currentData={item} agentId={item ? item.id ?? null : null} setIsUnsaved={setIsUnsaved} activeTab={activeTab} setHandleSave={setHandleSave}/>
          </TabPane>
          <TabPane tab={<IntlMessages id="global.apps" />} key="apps">
            <Apps currentData={item} agentId={item ? item.id ?? null : null} setIsUnsaved={setIsUnsaved} activeTab={activeTab} setHandleSave={setHandleSave}/>
          </TabPane>
          <TabPane tab={<IntlMessages id="global.sales" />} key="sales">
            <Sales currentData={item} agentId={item ? item.id ?? null : null} setIsUnsaved={setIsUnsaved} activeTab={activeTab} setHandleSave={setHandleSave}/>
          </TabPane>
          <TabPane tab={<IntlMessages id="global.payment" />} key="payment">
            <Payment currentData={item} reload={handleReload} agentId={item ? item.id ?? null : null} setIsUnsaved={setIsUnsaved} activeTab={activeTab} setHandleSave={setHandleSave}/>
          </TabPane>
          <TabPane tab={<IntlMessages id="global.setting" />} key="setting">
            <Setting />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

export default Companies;
