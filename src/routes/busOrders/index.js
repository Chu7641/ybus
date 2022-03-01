import { DeleteOutlined, DownOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Dropdown, Menu, message, Modal, Row, Select, Space, Switch, Table, Typography } from 'antd';
import { debounce, values } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import orderApi from '../../api/order';
import ActionBar from '../../components/ActionBar';
import FilterBar from '../../components/FilterBar';
import IntlMessages from "../../components/IntlMessage";
import PageTitle from '../../components/PageTitle';
import FilterTool from './FilterTool';




const { Text } = Typography;
const { Option } = Select;
Order.propTypes = {
    items: PropTypes.array
};
Order.defaultProps = {
    items: []
}


const StatusComponent = (props) => {
    const [value, setValue] = React.useState(props.data.pay_status)
    const intl = useIntl()
    const handleChangePayment = (id, value) => {
        setValue(value)
        Modal.confirm({
            title: intl.formatMessage({ id: 'global.delete_confirm' }),
            okText: intl.formatMessage({ id: 'global.yes' }),
            cancelText: intl.formatMessage({ id: 'global.cancel' }),
            onOk: async () => {
                let data = {
                    id: id,
                    pay_status: value
                }
                await orderApi.update(data);
                // console.log(data);
                props.setDeleting(true);
                message.success({ content: intl.formatMessage({ id: "global.update_success" }) });
            },
            onCancel() {
                // console.log('cancal');
                // setReload(reload => !reload);
                setValue(props.data.pay_status)

            },
        })

    }
    return (
        <Select value={value} onSelect={(value) => handleChangePayment(props.data.id, value)}>
            <Option key='PENDING' value="PENDING">{<IntlMessages id="status.pending" />}</Option>
            <Option key='SUCCESS' value="SUCCESS">{<IntlMessages id="status.success" />}</Option>
        </Select>
    )
}

function Order(props) {

    // const isMount = useRef(false)


    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(1);
    const [item, setItem] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(true);
    const [condition, setCondition] = useState({});
    const [filterData, setFilterData] = useState([]);

    const [userModal, setUserModal] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [filter, setFilter] = useState({
        "paging": {
            "perpage": 10,
            "page": 1
        },
        "sort": {
            "type": "asc",
            "attr": "id"
        },

    });
    // const [modal, setModal] = useState(false);
    const onChangeTable = async (
        pagination,
        filters,
        sorter,
        extra = { currentDataSource: [] }
    ) => {
        // console.log(sorter);
        setFilter({
            ...filter,
            "paging": {
                "perpage": pagination.pageSize,
                "page": pagination.current,
            },

            "sort": {
                "type": getOrder(sorter.order),
                "attr": sorter.columnKey ? `${sorter.columnKey}` : 'id',
            },

        });

    }

    const onFilter = debounce(async (value, name, type) => {
        if (type === "search") {
            setFilter(filter => { return { ...filter, "search": value, } });
        } else {
            const filter_obj = { ...condition, [name]: value }
            let filter_type = [];
            let filter_value = [];
            for (var key in filter_obj) {
                if (filter_obj[key]) {
                    filter_type.push(key);
                    filter_value.push(filter_obj[key]);
                }
            }
            setFilter(filter => { return { ...filter, } });
        }
    }, 300);

    useEffect(() => {

        async function fetchData() {
            setLoading(true);
            // console.log(filter);
            let result = await orderApi.getAll(filter);
            //console.log(result.data.paging);
            let items = result.data.list;

            // items = items.map(item => {
            //     let debt = +item.treatment_total - (+item.bill_total || 0);
            //     return { ...item, debt: debt };
            // })

            console.log('items', items);

            setItems(items);
            setLoading(false);
            setDeleting(false);
            if (total != result.data.paging.count)
                setTotal(result.data.paging.count);
            // console.log(total);
        }
        fetchData();

    }, [filter, deleting, reload])



    // const onReload = () => {
    //     setReload(reload => !reload);
    // }

    // const onOpenModal = (record = null) => {
    //     setModal(true);
    //     setItem(record);
    // }

    const intl = useIntl()
    const onRemove = (data) => {
        Modal.confirm({
            title: intl.formatMessage({ id: 'global.delete_confirm' })
            ,
            okText: intl.formatMessage({ id: 'global.yes' }),
            cancelText: intl.formatMessage({ id: 'global.cancel' }),
            onOk: async () => {
                let id = { 'id': data.id }
                await orderApi.delete(id);
                setDeleting(true);
                message.success({ content: intl.formatMessage({ id: "global.deleted_success" }) });
            },
            onCancel() { },
        })
    }
    const handleDeleteMany = () => {
        Modal.confirm({
            title: intl.formatMessage({ id: 'global.delete_confirm' })
            ,
            okText: intl.formatMessage({ id: 'global.yes' }),
            cancelText: intl.formatMessage({ id: 'global.cancel' }),
            onOk: async () => {
                let ids = { 'ids': selectedRowKeys }
                // console.log(ids);
                await orderApi.deleteMany(ids);
                setDeleting(true);
                message.success({ content: intl.formatMessage({ id: "global.deleted_success" }) });
            },
            onCancel() { },
        })
    }
    // const onChangeStatus = async (ischecked, record) => {
    //     //   setLoading(true)
    //     await orderApi.update({ state: ischecked, id: record.id });
    //     //  setLoading(false);
    //     onReload();

    // }


    const getOrder = (order) => {
        if (order === "ascend") return "asc";
        if (order === "descend") return "desc";
        return "ASC";
    }



    // const handleChangePayment = (id, value) => {
    //     Modal.confirm({
    //         title: intl.formatMessage({ id: 'global.delete_confirm' }),
    //         okText: intl.formatMessage({ id: 'global.yes' }),
    //         cancelText: intl.formatMessage({ id: 'global.cancel' }),
    //         onOk: async () => {
    //             // console.log(value);
    //             let data = {
    //                 id: id,
    //                 pay_status: value
    //             }
    //             await orderApi.update(data);
    //             // console.log(data);
    //             setDeleting(true);
    //             message.success({ content: intl.formatMessage({ id: "global.update_success" }) });
    //         },
    //         onCancel() {
    //             // console.log('cancal');
    //             // setReload(reload => !reload);

    //         },
    //     })

    // }
    const handleChangeOrder = (id, value) => {
        Modal.confirm({
            title: intl.formatMessage({ id: 'global.delete_confirm' })
            ,
            okText: intl.formatMessage({ id: 'global.yes' }),
            cancelText: intl.formatMessage({ id: 'global.cancel' }),
            onOk: async () => {
                // console.log(value);
                let data = {
                    id: id,
                    order_status: value
                }
                await orderApi.update(data);
                // console.log(data);
                setDeleting(true);
                message.success({ content: intl.formatMessage({ id: "global.update_success" }) });
            },
            onCancel() { },
        })


    }

    const getFilterData = (filterData) => {
        let type = filterData && filterData.type ? filterData.type : "depart";
        // console.log(type);
        let start = filterData && filterData.date_range ? filterData.date_range[0] : "";
        let end = filterData && filterData.date_range ? filterData.date_range[1] : "";
        setFilter(type == "depart" ? {
            ...filter,
            "order_status": {
                "value": filterData.order_status,
                "type": "="
            }, "pay_status": {
                "value": filterData.pay_status,
                "type": "="
            }, "agent_id": {
                "value": filterData.agent_id,
                "type": "="
            }, "start": {
                "value": {
                    "from": moment(start).format("YYYY-MM-DD hh:mm:ss"),
                    "to": moment(end).format("YYYY-MM-DD hh:mm:ss"),
                },
                "type": "compare"
            }
        } : {
            ...filter,
            "order_status": {
                "value": filterData.order_status,
                "type": "="
            }, "pay_status": {
                "value": filterData.pay_status,
                "type": "="
            }, "agent_id": {
                "value": filterData.agent_id,
                "type": "="
            }, "created_at": {
                "value": {
                    "from": moment(start).format("YYYY-MM-DD hh:mm:ss"),
                    "to": moment(end).format("YYYY-MM-DD hh:mm:ss"),
                },
                "type": "compare"
            }
        })


        // console.log(moment(start).format("YYYY-MM-DD"))
        setFilterData(filterData);
    }
    // console.log(filterData);
    const onSelectChange = (selectedRowKeys) => {
        // console.log(('selectRowKeys: ', selectedRowKeys));
        setSelectedRowKeys(selectedRowKeys);
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    }
    const hasSelected = selectedRowKeys.length > 0;

    const columns = [

        {
            title: <IntlMessages id="global.order_number" />,
            key: "order_number",
            sorter: true,
            dataIndex: "order_number",
            render: (text, record) => (

                <Link to={`/app/orders/${record.id}`} >
                    {record.order_number}
                </Link>

            )

        },
        {
            title: <IntlMessages id="global.route" />,
            key: "from",
            sorter: true,
            dataIndex: "from",
            render: (text, record) => (
                <p> {record.from.label + ' - ' + record.to.label}</p>
            )

        },
        {
            title: <IntlMessages id="property.start_date" />,
            key: "start",
            sorter: true,
            dataIndex: "start",
            render: (text, record) => (
                <p> {moment(record.start).format('DD-MM-YYYY')}</p>
            )

        },
        {
            title: <IntlMessages id="global.customer" />,
            key: "lastname",
            sorter: true,
            dataIndex: "lastname",
            render: (text, record) => (
                <p> {record.firstname + ' ' + (record.lastname?record.lastname:"")}</p>
            )
        },
        {
            title: <IntlMessages id="global.total" />,
            key: "total",
            sorter: true,
            dataIndex: "total",
            render: (text, record) => (
                <p> {record.total + ' CFA'}</p>
            )
        },
        {
            title: <IntlMessages id="global.payment_status" />,
            key: "pay_status",
            sorter: true,
            dataIndex: "pay_status",
            render: (text, record) => (

                // <Select defaultValue={record.pay_status} onSelect={(value) => handleChangePayment(record.id, value)} reset={() => {
                //     // handleChangePayment(record.id, record.pay_status)
                // }}>
                //     <Option key='PENDING' value="PENDING">{<IntlMessages id="status.pending" />}</Option>
                //     <Option key='SUCCESS' value="SUCCESS">{<IntlMessages id="status.success" />}</Option>
                // </Select>
                <StatusComponent data={record} setDeleting={setDeleting}/>
            )
        },

        // {
        //     title: <IntlMessages id="global.payment_status" />,
        //     key: "pay_status",
        //     sorter: true,
        //     dataIndex: "pay_status",
        //     render: (text, record) => (

        //         <Dropdown overlay={<MenuPay itemId={record.id} />} trigger={['click']} >
        //             <Button >{record.pay_status}<DownOutlined /></Button>
        //         </Dropdown>
        //     )
        // },

        {
            title: <IntlMessages id="global.order_status" />,
            key: "order_status",
            sorter: true,
            dataIndex: "order_status",
            render: (text, record) => (
                <Select defaultValue={record.order_status} onChange={(value) => handleChangeOrder(record.id, value)}>
                    <Option key='PENDING' value="PENDING">{<IntlMessages id="status.pending" />}</Option>
                    <Option key='CONFIRMED' value="CONFIRMED">{<IntlMessages id="status.confirmed" />}</Option>
                    <Option key='CANCELLED' value="CANCELLED">{<IntlMessages id="status.cancelled" />}</Option>

                </Select>
            )
        },
        {
            title: <IntlMessages id="global.created" />,
            key: "created_at",
            sorter: true,
            dataIndex: "created_at",
            render: (text, record) => (
                <p> {moment(record.created_at).format('DD-MM-YYYY hh:mm')}</p>
            )

        },

        {

            title: <IntlMessages id="global.action" />,
            align: true,
            width: 100,
            // fixed: 'right',
            render: (text, record) => {
                return (
                    <Space>
                        <Button size="small" onClick={() => onRemove(record)} type="primary" danger shape="round" icon={<DeleteOutlined />}><IntlMessages id="global.delete" /></Button>
                    </Space>
                )

            },

        },


    ];



    return (


        <Card bordered={false} style={{ minHeight: '100%' }}>


            <Row justify="space-between">

                <Col> <PageTitle
                    title={<IntlMessages id="global.orders" />}
                />
                </Col>

                <Col justify="space-between">

                    {/* <ActionBar
                        isShowAddButton={true}
                        onAdd={onOpenModal}
                        isShowPublishButtons={false}
                        isShowCopyButton={false}
                        isShowDeleteButton={false}
                        onFilter={onFilter}
                    >
                    </ActionBar> */}

                </Col>
            </Row>
            {/* <FilterBar
                onFilter={onFilter}
            >
            </FilterBar> */}
            <FilterTool getFilterData={getFilterData} />
            {/* <p>{moment(filterData.date_range).format("YYYY-MM-DD")}123</p> */}
            <Row>
                <Button onClick={handleDeleteMany} style={{ margin: '10px 0 ', display: hasSelected ? 'inline-block' : 'none' }} disabled={!hasSelected} type="primary">{<IntlMessages id="global.delete" />}</Button>
                <p style={{ margin: 10 }}>
                    {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                </p>
            </Row>
            <Table
                rowSelection={rowSelection}
                tableLayout="auto"
                columns={columns.filter(col => col.dataIndex !== 'id')}
                dataSource={items}
                onChange={onChangeTable}
                rowKey="id"
                size="small"
                loading={loading}
                scroll={{
                    x: "max-content"
                }}
                pagination={{
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                    total: total,
                    current: filter.paging.page,
                    pageSize: filter.paging.perpage
                }}
            />

        </Card>

    )
}

export default Order;