import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getAllBill, deleteBill, updateBill } from '../../redux/actions/BillAction';
import IntlMessages from "../../components/IntlMessage";
import { Button, Card, Table, Tag, Modal, Switch, Row, Col, Space, Typography } from 'antd';
import TableActionBar from '../../components/FilterBar';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import PageTitle from '../../components/PageTitle';
import BillForm from './BillForm';
import { debounce } from 'lodash';
import { useIntl } from 'react-intl'
import moment from "moment";
import FilterBar from '../../components/FilterBar';
import ActionBar from '../../components/ActionBar';
import { useParams } from 'react-router-dom';
import Currency from '../../components/Currency';
const { Text, Link } = Typography;


Bills.propTypes = {
    items: PropTypes.array
};
Bills.defaultProps = {
    items: []
}

export default function Bills(props) {

    const isMount = useRef(false)

    const { patient_id } = props
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(1);
    const [item, setItem] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(true);
    const { id } = useParams();
    const [filter, setFilter] = useState({
        page: 1,
        limit: 10,

        keyword: "",
        order_by: 'id',
        order_dir: 'DESC',
        filter_value: [id],
        filter_name: ['patient_id']
    });
    const [modal, setModal] = useState(false);

    const onChangeTable = async (
        pagination,
        filters,
        sorter,
        extra = { currentDataSource: [] }
    ) => {
        setFilter({
            ...filter,
            page: pagination.current,
            limit: pagination.pageSize,
            order_dir: getOrder(sorter.order),
            order_by: sorter.columnKey ? `${sorter.columnKey}` : 'id',
        });

    }

    const onFilter = debounce(async (value, name, type) => {
        if (type === "search") {
            setFilter(filter => { return { ...filter, keyword: value } });

        }
    }, 300);

    useEffect(() => {

        async function fetchData() {
            setLoading(true);
            let items = await getAllBill(filter);
            console.log('bills', items);
            setItems(items.data);
            setLoading(false);
            setDeleting(false);
            if (total != items.total)
                setTotal(items.total);
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

    const onCloseModal = () => {
        setModal(false);
    }
    const intl = useIntl()
    const onRemove = (data) => {
        Modal.confirm({
            title: intl.formatMessage({ id: 'global.delete_confirm' })
            ,
            okText: intl.formatMessage({ id: 'global.yes' }),
            onOk: async () => {
                await (deleteBill(data.id));
                setDeleting(true);
            },
            onCancel() { },
        })
    }
    const onChangeStatus = async (ischecked, record) => {

        console.log(ischecked);
        await (updateBill(record.id, { status: ischecked }));

    }


    const getOrder = (order) => {
        if (order === "ascend") return "ASC";
        if (order === "descend") return "DESC";
        return "DESC";
    }


    const columns = [

        {
            title: <IntlMessages id="bill.serial" />,
            key: "serial",
            sorter: true,

            dataIndex: "serial",
            render: (text, record) => {
                return (<Text strong>#{record.serial}</Text>)

            },

        },


        {
            title: <IntlMessages id="bill.billed_date" />,
            key: "billed_date",
            sorter: true,
            dataIndex: "billed_date",
            render: (text, record) => {
                if (record.billed_date) {
                    return <>{moment(record.billed_date).format("DD/MM/YYYY")}</>
                }


            },

        },

        {
            title: <IntlMessages id="bill.amount" />,
            key: "amount",
            sorter: true,
            dataIndex: "amount",
            render: (text, record) => {
                return <Currency value={record.amount}></Currency>
            }

        },

        {
            title: <IntlMessages id="global.doctor" />,
            key: "doctor_alias",
            sorter: true,
            dataIndex: "doctor_alias",


        },

        {
            title: <IntlMessages id="global.status" />,
            dataIndex: "status",
            key: "status",
            render: (e, record) => (
                record ? (
                    <Switch checkedChildren={<IntlMessages id="global.paid" />} unCheckedChildren={<IntlMessages id="global.notpaid" />}
                        defaultChecked={e} onChange={(ischecked) => onChangeStatus(ischecked, record)}
                    />
                ) : null
            )
        },



        {
            // title: <IntlMessages id="global.mobile" />,
            title: "",
            width: 100,
            align: true,
            render: (text, record) => {

                return (

                    <Space>
                        <Button size="small" onClick={() => onOpenModal(record)} type="primary" shape="round" icon={<EditOutlined />} ><IntlMessages id="global.edit" /></Button>
                        <Button size="small" type="primary" onClick={() => onRemove(record)} danger shape="round" icon={<DeleteOutlined />} ><IntlMessages id="global.delete" /></Button>
                    </Space>
                )


            },

        },

    ]

    return (

        <>

            <Row justify="space-between">

                <Col>
                </Col>

                <Col justify="space-between">

                    <ActionBar

                        isShowAddButton={true}
                        onAdd={onOpenModal}
                        isShowPublishButtons={false}
                        isShowCopyButton={false}
                        isShowDeleteButton={false}

                    ></ActionBar>
                </Col>
            </Row>


            <Table
                tableLayout="auto"
                columns={columns}
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
                    current: filter.page,
                    pageSize: filter.limit
                }}
            />
            {
                modal ?
                    <BillForm open={modal} onClose={onCloseModal} currentData={item} patient_id={patient_id} onReload={onReload} />
                    : null
            }

        </>
    )
}
