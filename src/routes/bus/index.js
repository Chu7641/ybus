import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import IntlMessages from "../../components/IntlMessage";
import {Switch, Button, Card, Table, Tag, Modal, Col, Space, Row, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import PageTitle from '../../components/PageTitle';
import BusForm from './BusForm';
import { debounce, set } from 'lodash';
import { useIntl } from 'react-intl'
import FilterBar from '../../components/FilterBar';
import ActionBar from '../../components/ActionBar';
import busApi from '../../api/bus';
import AgentApi from '../../api/agent';
import  seatTemplateApi from '../../api/seatTemplate';
import agentApi from '../../api/agent';


Bus.propTypes = {
    items: PropTypes.array
};
Bus.defaultProps = {
    items: []
}

function Bus(props) {

    // const isMount = useRef(false)

    const {agentId} = props;
    const [items, setItems] = useState([]);
    const [agentID, setAgentID] = useState();
    const [seattemplateID, setSeatteamplateID] = useState();
    const [total, setTotal] = useState(1);
    const [item, setItem] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(true);
    const [condition, setCondition] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [filter, setFilter] = useState({
        "paging" : {
            "perpage" : 10,
            "page" : 1
         },
         "sort": {
            "type" : "asc",
            "attr" : "id"
            },
            "agent_id" : {
                "value" : agentId,
                "type" : "="
            }
         
    });
    const [filter1, setFilter1] = useState({
        "paging" : {
            "page" : 0
         },
         "sort": {
            "type" : "asc",
            "attr" : "id"
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
            "paging" : {
                "perpage" : pagination.pageSize,
                "page" : pagination.current,},

            "sort": {
                    "type" : getOrder(sorter.order),
                    "attr" : sorter.columnKey ? `${sorter.columnKey}` : 'id',
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
            // console.log(filter);
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
       console.log("filter",filter);
        async function fetchData() {
            // setLoading(true);
            setLoading(true);
            // console.log(filter);
            let result = await busApi.getAll(filter);
            console.log(result.data.list);
    
           let items = result.data.list;
            setItems(items);
            setLoading(false);
            setDeleting(false);
            if (total != result.data.paging.count)
                setTotal(result.data.paging.count);
                // console.log(total);
        }

        async function fecthAgent(){
        
            let result = await agentApi.getAll(filter1);
            let item = result.data.list;
        
            setAgentID(item);
            
        }

        async function fecthSeat(){
            
            let result = await seatTemplateApi.getAll(filter1);
            let item = result.data.list;
            setSeatteamplateID(item);
            
        }
        
        Promise.all([fetchData(),fecthAgent(),fecthSeat()]);
        
    }, [filter, deleting, reload])

    useEffect(() => {
        setFilter({...filter, "agent_id" : {
            "value" : agentId,
            "type" : "="
        }
        })
    },[agentId]);

    const onReload = () => {
        setReload(reload => !reload);
    }

    const onOpenModal = (record = null) => {
        setModal(true);
        setItem(record);
        console.log(record);
    }

    const onCloseModal = () => {
        setModal(false);
    }
    const intl = useIntl();
    
    const onRemove = (data) => {
        Modal.confirm({
            title: intl.formatMessage({ id: 'global.delete_confirm' })
            ,
            okText: intl.formatMessage({ id: 'global.yes' }),
            cancelText: intl.formatMessage({ id: 'global.cancel' }),
            onOk: async () => {
                let id={'id':data.id}
               await busApi.delete(id);
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
                 await busApi.deleteMany(ids);
                setDeleting(true);
                message.success({ content: intl.formatMessage({ id: "global.deleted_success" }) });
            },
            onCancel() { },
        })
    }
    const onChangeStatus = async (ischecked, record) => {
     //   setLoading(true)
        await busApi.update({ state: ischecked ,id:record.id});
      //  setLoading(false);
        onReload();

    }


    const getOrder = (order) => {
        if (order === "ascend") return "asc";
        if (order === "descend") return "desc";
        return "ASC";
    }


    const columns = [
       
        {   
        title: <IntlMessages id="global.title" />,
        key: "title",
        sorter: true,
        width: 200,
        dataIndex: "title",
        render: (text, record) => (
           <p>{record.title}</p>   
        )},
       
        
        {   
            title: <IntlMessages id="global.agent" />,
            key: "company",
            sorter: true,
            width: 200,
            dataIndex: "agent_info",
            render: (text, record) => (
                 <p>{record.agent_firstname}{" "}{record.agent_lastname}</p>    
              
             )
           
        },

        {   
            title: <IntlMessages id="global.seatTemplateTitle" />,
            key: "seatTempleteTitle",
            sorter: true,
            width: 200,
            dataIndex: "seatTempleteTitle",
        },

        {   
            title: <IntlMessages id="car.seat" />,
            key: "seat",
            sorter: true,
            width: 200,
            dataIndex: "seat",
        },

        // {   
        //     title: <IntlMessages id="global.code" />,
        //     key: "code",
        //     sorter: true,
        //     width: 200,
        //     dataIndex: "code",
        // },
        // {   
        //     title: <IntlMessages id="global.image" />,
        //     key: "images",
        //     sorter: true,
        //     width: 200,
        //     dataIndex: "images",
        // },
        
        {

            title: "",
            align: true,
            width: 100,
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
    const onSelectChange = (selectedRowKeys) => {
        console.log(('selectRowKeys: ', selectedRowKeys));
        setSelectedRowKeys(selectedRowKeys);
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    }
    const hasSelected = selectedRowKeys.length > 0;


    return (


        <Card bordered={false} style={{ minHeight: '100%' }}>


            <Row justify="space-between">

                <Col> <PageTitle
                    title={<IntlMessages id="global.bus" />}
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
                    y: "max-content",
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
                <BusForm open={modal} onClose={onCloseModal} currentData={item} onReload={onReload} agentID={agentID} seatID={seattemplateID}/>
                : null}

        </Card>

    )
}

export default Bus;