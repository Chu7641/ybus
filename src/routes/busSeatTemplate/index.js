import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import IntlMessages from "../../components/IntlMessage";
import { Switch, Button, Card, Table, Tag, Modal, Col, Space, Typography, Row, message } from 'antd';
import TableActionBar from '../../components/FilterBar';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import PageTitle from '../../components/PageTitle';
import TemplateForm from './TemplateForm';
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
import seatTemplateApi from '../../api/seatTemplate';
import CreateForm from './CreateForm';
const { Text } = Typography;
SeatTemplate.propTypes = {
    items: PropTypes.array
};
SeatTemplate.defaultProps = {
    items: []
}
function SeatTemplate(props) {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(1);
    const [item, setItem] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(true);
    const [condition, setCondition] = useState({});
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
    const [modal, setModal] = useState(false);
    const [modalC, setModalC] = useState(false);


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
            //console.log(filter);
            let result = await seatTemplateApi.getAll(filter);
            console.log(result.data.list);
              setItems(result.data.list);
            setLoading(false);
            setDeleting(false);
            if (total != result.data.paging.count)
                setTotal(result.data.paging.count);
            //  console.log(total);
        }
        fetchData();

    }, [filter, deleting, reload])



    const onReload = () => {
        setReload(reload => !reload);
    }

    const onOpenModal = (record = null) => {
        setModal(true);
        setItem(record);
    }
    const onOpenModalC = () => {
      //  console.log("abc");
        setModalC(true);
       
    }

    const onCloseModal = () => {
        setModal(false);
    }
    const onCloseModalC = () => {
        setModalC(false);
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
                await seatTemplateApi.delete(id);
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
                 await seatTemplateApi.deleteMany(ids);
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
        {   title: <IntlMessages id="global.title" />,
       key: "title",
       sorter: true,
       width: 200,
       dataIndex: "title",
       },
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


    return (
        <Card bordered={false} style={{ minHeight: '100%' }}>
            <Row justify="space-between">

                <Col> <PageTitle
                    title={<IntlMessages id="global.bus_seat_template" />}
                />
                </Col>

                <Col justify="space-between">

                    <ActionBar
                        isShowAddButton={true}
                        onAdd={onOpenModalC}
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
                <TemplateForm open={modal} onClose={onCloseModal} currentData={item} onReload={onReload} />
              
                : null}
                {modalC ?
                <CreateForm open={modalC} onClose={onCloseModalC} currentData={item} onReload={onReload} />
              
                : null}
        </Card>

    )
}

export default SeatTemplate;