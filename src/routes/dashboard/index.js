import { Button, Card, Col, Row, Table } from "antd";
import React, { useState } from "react";
import IntlMessages from "../../components/IntlMessage";
import PageTitle from "../../components/PageTitle";

Dashboard.propTypes = {};

function Dashboard(props) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const columns = [
    {
      title: "",
      dataIndex: "route",
      key: "route",
      width: 80,
    },
    {
      title: "Monday",
      dataIndex: "monday",
      key: "monday",
      width: 80,
    },
    {
      title: "Tuesday",
      dataIndex: "tuesday",
      key: "tuesday",
      width: 80,
    },
    {
      title: "Wednesday",
      dataIndex: "wednesday",
      key: "wednesday",
      width: 80,
    },
    {
      title: "Thursday",
      dataIndex: "thursday",
      key: "thursday",
      width: 80,
    },
    {
      title: "Friday",
      dataIndex: "friday",
      key: "friday",
      width: 80,
    },
    {
      title: "Saturday",
      dataIndex: "saturday",
      key: "saturday",
      width: 80,
    },
    {
      title: "Sunday",
      dataIndex: "sunday",
      key: "sunday",
      width: 80,
    },
  ];
  const data = [
    {
      route: "Route 1",
      monday: "Departures info",
      tuesday: "Departures info",
      wednesday: "Departures info",
      thursday: "Departures info",
      friday: "Departures info",
      saturday: "Departures info",
      sunday: "Departures info",
    },
    {
      route: "Route 2",
      monday: "Departures info",
      tuesday: "Departures info",
      wednesday: "Departures info",
      thursday: "Departures info",
      friday: "Departures info",
      saturday: "Departures info",
      sunday: "Departures info",
    },
    {
      route: "Route 3",
      monday: "Departures info",
      tuesday: "Departures info",
      wednesday: "Departures info",
      thursday: "Departures info",
      friday: "Departures info",
      saturday: "Departures info",
      sunday: "Departures info",
    },
  ];
  const onSelectChange = (selectedRowKeys) => {
    console.log(("selectRowKeys: ", selectedRowKeys));
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const handleDeleteMany = () => {};

  return (
    <Card bordered={false} style={{ minHeight: "100%" }}>
      <Row justify="space-between">
        <Col>
          <PageTitle title={<IntlMessages id="global.dashboard" />} />
        </Col>
      </Row>
      <Row>
        <Button
          onClick={handleDeleteMany}
          style={{
            margin: "10px 0 ",
            display: hasSelected ? "inline-block" : "none",
          }}
          disabled={!hasSelected}
          type="primary"
        >
          {<IntlMessages id="global.delete" />}
        </Button>
        <p style={{ margin: 10 }}>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        </p>
      </Row>
      <Table
        rowKey="route"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        pagination={{ position: ["topLeft"] }}
      />
    </Card>
  );
}

export default Dashboard;
