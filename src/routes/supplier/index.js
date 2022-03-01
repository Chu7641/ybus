import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getAllSupplier, deleteSupplier, updateSupplier } from '../../redux/actions/SuppliersAction';
import IntlMessages from "../../components/IntlMessage";
import { Button, Card, Table, Tag, Modal, Switch, Row, Col, Space } from 'antd';
import TableActionBar from '../../components/FilterBar';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import PageTitle from '../../components/PageTitle';
import SupplierForm from './SupplierForm';
import { debounce } from 'lodash';
import { useIntl } from 'react-intl'
import Currency from '../../components/Currency';
import PhoneFormatter from '../../components/PhoneFormatted';
import ActionBar from '../../components/ActionBar';
import FilterBar from '../../components/FilterBar';


Suppliers.propTypes = {
    items: PropTypes.array
};
Suppliers.defaultProps = {
    items: []
}

function Suppliers(props) {

    // const isMount = useRef(false)


    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(1);
    const [item, setItem] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(true);

    const [filter, setFilter] = useState({
        page: 1,
        limit: 10,

        keyword: "",
        order_by: 'id',
        order_dir: 'DESC',
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
            let items = await (getAllSupplier(filter));
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
                await (deleteSupplier(data.id));
                setDeleting(true);
            },
            onCancel() { },
        })
    }
    const onChangeStatus = async (ischecked, record) => {

        console.log(ischecked);
        await (updateSupplier(record.id, { status: ischecked }));

        setItems(items => items.map(data => {
            if (data.id === record.id)
                return {
                    ...data,
                    status: ischecked
                }
            return data;

        }));

    }


    const getOrder = (order) => {
        if (order === "ascend") return "ASC";
        if (order === "descend") return "DESC";
        return "DESC";
    }


    const columns = [
        {
            title: <IntlMessages id="global.id_number" />,
            key: "id",
            width: 20,
            sorter: true,
            dataIndex: "id",
            render: (text, record, index) => {
                return index + 1
            },
        },

        {
            title: <IntlMessages id="global.suppliers" />,
            key: "name",
            sorter: true,
            width: 200,
            dataIndex: "name",
            render: (text, record) => {
                let ten = text.slice(0, 15);
                return `${ten}...`

            },

        },
        {
            title: <IntlMessages id="global.contact_name" />,
            key: "contact_name",
            sorter: true,
            width: 200,
            dataIndex: "contact_name",
            render: (text, record) => {
                return `${record.contact_name}`

            },

        },
        {
            title: <IntlMessages id="global.website" />,
            key: "website",
            sorter: true,
            width: 150,
            dataIndex: "website",
            render: (text, record) => {
                return `${record.website}`
            },

        },

        {
            title: <IntlMessages id="global.mobile" />,
            key: "mobile",
            sorter: true,
            width: 150,
            dataIndex: "mobile",
            render: (text, record) => {
                return <PhoneFormatter phone={record.mobile} />

            },

        },

        {
            title: <IntlMessages id="global.email" />,
            key: "email",
            sorter: true,
            width: 150,
            dataIndex: "email",
            render: (text, record) => {
                return `${record.email}`

            },

        },


        {
            // title: <IntlMessages id="global.mobile" />,
            title: "",
            width: 100,
            align: true,
            render: (text, record) => {
                return (
                    <Space>
                        <Button type="primary" size="small" onClick={() => onOpenModal(record)} shape="round" icon={<EditOutlined />} ><IntlMessages id="global.edit" /></Button>


                        <Button type="primary" size="small" onClick={() => onRemove(record)} danger shape="round" icon={<DeleteOutlined />} ><IntlMessages id="global.delete" /></Button>

                    </Space>
                )


            },

        },

    ]

    return (

        <Card bordered={false} style={{ minHeight: '100%' }}>
            <Row justify="space-between">
                <Col> <PageTitle
                    title={<IntlMessages id="global.suppliers" />}
                />
                </Col>
                <Col >

                    <ActionBar
                        isShowAddButton={true}
                        onAdd={onOpenModal}
                        isShowPublishButtons={false}
                        isShowCopyButton={false}
                        isShowDeleteButton={false}

                    >
                    </ActionBar>

                </Col>
            </Row>
            <FilterBar
                onFilter={onFilter}
            >
            </FilterBar>
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
            {modal ?
                <SupplierForm open={modal} onClose={onCloseModal} currentData={item} onReload={onReload} />
                : null}

        </Card>

    )
}

export default Suppliers;