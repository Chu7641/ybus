import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import IntlMessages from "../../components/IntlMessage";
import { Switch, Button, Card, Table, Tag, Modal, Col, Space, Typography, Row, message } from 'antd';
import TableActionBar from '../../components/FilterBar';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import PageTitle from '../../components/PageTitle';
// import AgentForm from './AgentForm';
import { debounce, set } from 'lodash';
import { useIntl } from 'react-intl'
import moment from "moment";
import { Link } from 'react-router-dom';
import { deletePatient, getAllPatient, updatePatient } from '../../redux/actions/PatientAction';
import PhoneFormatter from '../../components/PhoneFormatted';
import FilterBar from '../../components/FilterBar';
import ActionBar from '../../components/ActionBar';
import { getAllDoctor } from '../../redux/actions/DoctorAction';
import agentApi from '../../api/agent';
import Gender from '../../components/Gender';
import Currency from '../../components/Currency';
import busRouteGroupApi from '../../api/busRouteGroup';
import RouteGroupForm from './RouteGroupForm';
import { render } from '@testing-library/react';
// import UserForm from './UserForm';




const { Text } = Typography;

BusRouteGroup.propTypes = {
    items: PropTypes.array
};
BusRouteGroup.defaultProps = {
    items: []
}

function BusRouteGroup(props) {

    // const isMount = useRef(false)


    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(1);
    const [item, setItem] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(true);
    const [condition, setCondition] = useState({});
    const [userModal, setUserModal] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [list, setList] = useState([]);

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
    //  console.log(filter.paging.page);
    const [modal, setModal] = useState(false);

    const onChangeTable = async (
        pagination,
        filters,
        sorter,
        extra = { currentDataSource: [] }
    ) => {
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
            // page: pagination.current,
            // limit: pagination.pageSize,
            // order_dir: getOrder(sorter.order),
            // order_by: sorter.columnKey ? `${sorter.columnKey}` : 'id',
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
            console.log(filter);
            let result = await busRouteGroupApi.getAll(filter);
            console.log(result.data.list);
            let items = result.data.list;
            // items = items.map(item => {
            //     let debt = +item.treatment_total - (+item.bill_total || 0);
            //     return { ...item, debt: debt };
            // })

            console.log('items', items);
            setList(items.destinations);
            setItems(items);
            setLoading(false);
            setDeleting(false);
            if (total != result.data.paging.count)
                setTotal(result.data.paging.count);
            console.log(total);
        }
        fetchData();

    }, [filter, deleting, reload])

// const listDestination=list.map((res,index)=>{
//     render(
//         <p>abc</p>
//     )
// })

    const onReload = () => {
        setReload(reload => !reload);
    }

    const onOpenModal = (record = null) => {
        setModal(true);
        setItem(record);
    }

    const onOpenUserModal = (record) => {
        setUserModal(true);
        setItem(record);
    }

    const onCloseModal = () => {
        setModal(false);
    }

    const onCloseUserModal = () => {
        setUserModal(false);
    }
    const intl = useIntl()
    const onRemove = (data) => {
        Modal.confirm({
            title: intl.formatMessage({ id: 'global.delete_confirm' })
            ,
            okText: intl.formatMessage({ id: 'global.yes' }),
            cancelText: intl.formatMessage({ id: 'global.cancel' }),
            onOk: async () => {
                let id = { 'id': data.id }
                await busRouteGroupApi.delete(id);
                setDeleting(true);
                message.success({ content: intl.formatMessage({ id: "global.deleted_success" }) });
            },
            onCancel() { },
        })
    }
    const handleDeleteMany=()=>{
        Modal.confirm({
            title: intl.formatMessage({ id: 'global.delete_confirm' })
            ,
            okText: intl.formatMessage({ id: 'global.yes' }),
            cancelText: intl.formatMessage({ id: 'global.cancel' }),
            onOk: async () => {
                let ids = {'ids':selectedRowKeys}
                // console.log(ids);
                 await busRouteGroupApi.deleteMany(ids);
                setDeleting(true);
                message.success({ content: intl.formatMessage({ id: "global.deleted_success" }) });
            },
            onCancel() { },
        })
    }
    const onChangeStatus = async (ischecked, record) => {
        //   setLoading(true)
        await agentApi.update({ state: ischecked, id: record.id });
        //  setLoading(false);
        onReload();

    }


    const getOrder = (order) => {
        if (order === "ascend") return "asc";
        if (order === "descend") return "desc";
        return "ASC";
    }
    const onSelectChange = (selectedRowKeys) => {
        console.log(('selectRowKeys: ', selectedRowKeys));
        setSelectedRowKeys(selectedRowKeys);
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    }
    const hasSelected = selectedRowKeys.length > 0;


    const columns = [

        {
            title: <IntlMessages id="global.name" />,
            key: "name",
            sorter: true,
            width: 100,
            dataIndex: "name",
        },

        {
            title: <IntlMessages id="global.code" />,
            key: "code",
            sorter: true,
            dataIndex: "code",

        },
        {
            title: <IntlMessages id="global.from" />,
            key: "from",
            sorter: true,
            dataIndex: "from",

        },
        {
            title: <IntlMessages id="global.to" />,
            key: "to",
            sorter: true,
            dataIndex: "to",

        },
        {
            title: <IntlMessages id="global.destinations" />,
            key: "destinations",
            sorter: true,
            dataIndex: "destinations",
            render: (text, record) => (
                record.destinations.map((res,index)=>{
                    return(
                        <p key={index}>{res.title+' - '+res.code}</p>
                    )
                }
                // <p> {record.destinations.title + ' - ' + record.destinations.code}</p>   
             )
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
                        <Button size="small" onClick={() => onOpenModal(record)} type="primary" shape="round" icon={<EditOutlined />}><IntlMessages id="global.edit" /></Button>

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
                    title={<IntlMessages id="global.bus_agent" />}
                />
                </Col>

                <Col justify="space-between">

                    <ActionBar
                        isShowAddButton={true}
                        onAdd={onOpenModal}
                        isShowPublishButtons={false}
                        isShowCopyButton={false}
                        isShowDeleteButton={false}
                        onFilter={onFilter}
                    >
                    </ActionBar>

                </Col>
            </Row>
            <FilterBar
                onFilter={onFilter}
            >
            </FilterBar>
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
            {modal ?
                <RouteGroupForm open={modal} onClose={onCloseModal} currentData={item} onReload={onReload} />
                : null}
           
        </Card>

    )
}

export default BusRouteGroup;