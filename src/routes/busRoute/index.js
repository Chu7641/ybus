import {
  ArrowRightOutlined,
  DeleteOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  message,
  Modal,
  Row,
  Space,
  Switch,
  Table,
  Typography,
} from "antd";
import { debounce } from "lodash";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import busRouteApi from "../../api/busRoute";
import ActionBar from "../../components/ActionBar";
import FilterBar from "../../components/FilterBar";
import IntlMessages from "../../components/IntlMessage";
import PageTitle from "../../components/PageTitle";
import CreateRoomrateForm from "./CreateRoomrateForm";
import RoomrateForm from "./CreateRoomrateForm";
import BusRouteForm from "./RouteForm";

const { Text } = Typography;

BusRoute.propTypes = {
  items: PropTypes.array,
};
BusRoute.defaultProps = {
  items: [],
};

function BusRoute(props) {
  // const isMount = useRef(false)
const {agentId}=props;
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(1);
  const [item, setItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(true);
  const [condition, setCondition] = useState({});
  const [roomrateModal, setRoomrateModal] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filter, setFilter] = useState({
    paging: {
      perpage: 10,
      page: 1,
    },
    sort: {
      type: "asc",
      attr: "id",
    },
    agent_id : {
      value : agentId,
      type : "="
  }
  });
  //  console.log(filter.paging.page);
  const [modal, setModal] = useState(false);

  const onChangeTable = async (
    pagination,
    filters,
    sorter,
    extra = { currentDataSource: [] }
  ) => {
    console.log(sorter);
    setFilter({
      // ...filter,
      paging: {
        perpage: pagination.pageSize,
        page: pagination.current,
      },

      sort: {
        type: getOrder(sorter.order),
        attr: sorter.columnKey ? `${sorter.columnKey}` : "id",
      },
    });
  };

  const onFilter = debounce(async (value, name, type) => {
    if (type === "search") {
      setFilter((filter) => {
        return { ...filter, search: value };
      });
    } else {
      const filter_obj = { ...condition, [name]: value };
      let filter_type = [];
      let filter_value = [];
      for (var key in filter_obj) {
        if (filter_obj[key]) {
          filter_type.push(key);
          filter_value.push(filter_obj[key]);
        }
      }
      setFilter((filter) => {
        return { ...filter };
      });
    }
  }, 300);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // console.log(filter);
      let result = await busRouteApi.getAll(filter);
      console.log("route",result);
      let items = result.data.list;

      // items = items.map(item => {
      //     let debt = +item.treatment_total - (+item.bill_total || 0);
      //     return { ...item, debt: debt };
      // })

      // console.log('items', items);

      setItems(items);
      setLoading(false);
      setDeleting(false);
      if (total != result.data.paging.count) setTotal(result.data.paging.count);
      // console.log(total);
    }
    fetchData();
  }, [filter, deleting, reload]);
  useEffect(() => {
    setFilter({...filter, "agent_id" : {
        "value" : agentId,
        "type" : "="
    }
    })
},[agentId]);

  const onReload = () => {
    setReload((reload) => !reload);
  };

  const onOpenModal = (record = null) => {
    setModal(true);
    setItem(record);
  };

  const onOpenRoomrateModal = (record) => {
    setItem(record);
    setRoomrateModal(true);
  };

  const onCloseModal = () => {
    setModal(false);
  };

  const onCloseRoomrateModal = () => {
    setRoomrateModal(false);
  };
  const intl = useIntl();
  const onRemove = (data) => {
    Modal.confirm({
      title: intl.formatMessage({ id: "global.delete_confirm" }),
      okText: intl.formatMessage({ id: "global.yes" }),
      cancelText: intl.formatMessage({ id: "global.cancel" }),
      onOk: async () => {
        let id = { id: data.id };
        // console.log(id);
        await busRouteApi.delete(id);
        setDeleting(true);
        message.success({
          content: intl.formatMessage({ id: "global.deleted_success" }),
        });
      },
      onCancel() {},
    });
  };
  const handleDeleteMany = () => {
    Modal.confirm({
      title: intl.formatMessage({ id: "global.delete_confirm" }),
      okText: intl.formatMessage({ id: "global.yes" }),
      cancelText: intl.formatMessage({ id: "global.cancel" }),
      onOk: async () => {
        let ids = { ids: selectedRowKeys };
        // console.log(ids);
        await busRouteApi.deleteMany(ids);
        setDeleting(true);
        message.success({
          content: intl.formatMessage({ id: "global.deleted_success" }),
        });
      },
      onCancel() {},
    });
  };
  const onChangeStatus = async (ischecked, record) => {
    //   setLoading(true)
    await busRouteApi.update({ state: ischecked, id: record.id });
    //  setLoading(false);
    onReload();
  };

  const getOrder = (order) => {
    if (order === "ascend") return "asc";
    if (order === "descend") return "desc";
    return "ASC";
  };

  const onSelectChange = (selectedRowKeys) => {
    // console.log(('selectRowKeys: ', selectedRowKeys));
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const columns = [
    {
      title: <IntlMessages id="global.title" />,
      key: "id",
      sorter: true,
      dataIndex: "from_title",
      render: (text, record) => (
        <>
          {record.parent_id == 0 ? (
            <b>
              {record.from_title}
              <ArrowRightOutlined />
              {record.to_title}
            </b>
          ) : (
            <p>
              <MinusOutlined />
              {record.from_title}
              <ArrowRightOutlined />
              {record.to_title}
            </p>
          )}
        </>
      ),
    },
    {
      title: <IntlMessages id="global.code" />,
      key: "code",
      sorter: true,
      dataIndex: "code",
    },
    {
      title: <IntlMessages id="global.group" />,
      key: "group",
      sorter: true,
      dataIndex: "group",
    },
    {
      title: <IntlMessages id="global.type" />,
      key: "type",
      sorter: true,
      dataIndex: "type",
    },
    {
      title: <IntlMessages id="global.price" />,
      key: "adult",
      sorter: true,
      dataIndex: "adult",
    },
    {
      title: <IntlMessages id="global.bus_title" />,
      key: "bus_title",
      sorter: true,
      dataIndex: "bus_title",
      render: (text, record) => (
        <p> {record.bus_title + "(" + record.bus_seat + ")"}</p>
      ),
    },

    {
      title: <IntlMessages id="global.agent" />,
      key: "agent_name",
      sorter: true,
      dataIndex: "agent_name",
    },
    {
      title: <IntlMessages id="global.status" />,
      dataIndex: "state",
      key: "state",
      render: (e, record) =>
        record ? (
          <Switch
            checkedChildren={<IntlMessages id="global.enable" />}
            unCheckedChildren={<IntlMessages id="global.disable" />}
            defaultChecked={e}
            onChange={(ischecked) => onChangeStatus(ischecked, record)}
            checked={record.state}
          />
        ) : null,
    },
    {
      title: <IntlMessages id="global.roomrate" />,
      align: true,
      // fixed: 'right',
      render: (text, record) => {
        return (
          <>
            {record.parent_id == 0 ? (
              <Space>
                <Button
                  size="small"
                  onClick={() => onOpenRoomrateModal(record)}
                  type="primary"
                  shape="round"
                  icon={<PlusOutlined />}
                >
                  <IntlMessages id="global.create" />
                </Button>
                <Link
                  to={`busroute/updateroomrate/${record.id}`}
                  style={{ color: "#16bc8c" }}
                >
                  <Button
                    size="small"
                    type="primary"
                    shape="round"
                    icon={<EditOutlined />}
                  >
                    <IntlMessages id="global.update" />
                  </Button>
                </Link>
              </Space>
            ) : (
              <Link
                to={`busroute/updateroomrate/${record.id}`}
                style={{ color: "#16bc8c" }}
              >
                <Button
                  size="small"
                  type="primary"
                  shape="round"
                  icon={<EditOutlined />}
                >
                  <IntlMessages id="global.update" />
                </Button>
              </Link>
            )}
          </>
        );
      },
    },
    {
      title: <IntlMessages id="global.action" />,
      align: true,
      // fixed: 'right',
      render: (text, record) => {
        return (
          <Space>
            {/* <Button
              size="small"
              onClick={() => onOpenModal(record)}
              type="primary"
              shape="round"
              icon={<EditOutlined />}
            >
              <IntlMessages id="global.edit" />
            </Button> */}
            <Button
              size="small"
              onClick={() => onRemove(record)}
              type="primary"
              danger
              shape="round"
              icon={<DeleteOutlined />}
            >
              <IntlMessages id="global.delete" />
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <Card bordered={false} style={{ minHeight: "100%" }}>
      <Row justify="space-between">
        <Col>
          {" "}
          <PageTitle title={<IntlMessages id="global.route" />} />
        </Col>

        <Col justify="space-between">
          <ActionBar
            isShowAddButton={true}
            onAdd={onOpenModal}
            isShowPublishButtons={false}
            isShowCopyButton={false}
            isShowDeleteButton={false}
            onFilter={onFilter}
          ></ActionBar>
        </Col>
      </Row>
      <FilterBar onFilter={onFilter}></FilterBar>
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
        rowSelection={rowSelection}
        tableLayout="auto"
        columns={columns.filter((col) => col.dataIndex !== "id")}
        dataSource={items}
        onChange={onChangeTable}
        rowKey="id"
        size="small"
        loading={loading}
        scroll={{
          x: "max-content",
        }}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          total: total,
          current: filter.paging.page,
          pageSize: filter.paging.perpage,
        }}
      />
      {modal ? (
        <BusRouteForm
          open={modal}
          onClose={onCloseModal}
          currentData={item}
          onReload={onReload}
        />
      ) : null}
      {roomrateModal ? (
        <CreateRoomrateForm
          open={roomrateModal}
          onClose={onCloseRoomrateModal}
          currentData={item}
          onReload={onReload}
        />
      ) : null}
    </Card>
  );
}

export default BusRoute;
