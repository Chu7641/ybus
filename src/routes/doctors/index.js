import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import IntlMessages from "../../components/IntlMessage";
import { Button, Card, Table, Modal, Switch, Row, Col, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import PageTitle from '../../components/PageTitle';
import DoctorForm from './DoctorForm';
import { debounce } from 'lodash';
import { useIntl } from 'react-intl'
import moment from "moment";
import FilterBar from '../../components/FilterBar';
import ActionBar from '../../components/ActionBar';
import doctorApi from "../../api/doctor";


Doctors.propTypes = {
    items: PropTypes.array
};
Doctors.defaultProps = {
    items: []
}

function Doctors() {

    const isMount = useRef(false)


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
        sorter) => {
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
        isMount.current = true;
        async function fetchData() {
            setLoading(true);
            let items = await doctorApi.getAll(filter);
            setItems(items.data);
            setLoading(false);
            setDeleting(false);
            if (total != items.total)
                setTotal(items.total);
        }
        fetchData();
        return () => {
            isMount.current = false
        }

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
                await doctorApi.delete(data.id);
                setDeleting(true);
            },
            onCancel() { },
        })
    }
    const onChangeStatus = async (ischecked, record) => {

        console.log(ischecked);
        await doctorApi.update(record.id, { status: ischecked });

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
            title: <IntlMessages id="global.fullname" />,
            key: "firstname",
            sorter: true,
            width: 200,
            dataIndex: "firstname",
            render: (text, record) => {
                return `${record.firstname} ${record.lastname}`

            },

        },

        {
            title: <IntlMessages id="global.alias" />,
            key: "alias",
            sorter: true,
            width: 200,
            dataIndex: "alias",
            render: (text, record) => {

                return <div>{record.alias}</div>

            },

        },

        {
            title: <IntlMessages id="global.birthday" />,
            key: "birthday",
            sorter: true,
            dataIndex: "birthday",
            render: (text, record) => {
                if (record.birthday) {
                    return <div>{moment(record.birthday).format("DD/MM/YYYY")}</div>
                }
                else return (<div>--</div>);

            },

        },

        {
            title: <IntlMessages id="global.mobile" />,
            key: "mobile",
            sorter: true,
            dataIndex: "mobile",
            render: (text, record) => {
                return <div>{record.mobile}</div>
            },

        },

        {
            title: <IntlMessages id="global.email" />,
            key: "email",
            sorter: true,
            dataIndex: "email",
            render: (text, record) => {
                return <div>{record.email}</div>
            },

        },




        {
            title: <IntlMessages id="global.status" />,
            dataIndex: "status",
            key: "status",
            render: (e, record) => (
                record ? (
                    <Switch checkedChildren={<IntlMessages id="global.published" />} unCheckedChildren={<IntlMessages id="global.unpublished" />}
                        defaultChecked={e} onChange={(ischecked) => onChangeStatus(ischecked, record)}
                    />
                ) : null
            )
        },

        {

            title: "",
            align: true,
            render: (text, record) => {
                return (
                    <Space>
                        <Button onClick={() => onOpenModal(record)} size="small" type="primary" shape="round" icon={<EditOutlined />} ><IntlMessages id="global.edit" /></Button>
                        <Button onClick={() => onRemove(record)} size="small" type="primary" danger shape="round" icon={<DeleteOutlined />} ><IntlMessages id="global.delete" /></Button>
                    </Space>
                )


            },

        },

    ]

    return (

        <Card bordered={false} style={{ minHeight: '100%' }}>

            <Row justify="space-between">

                <Col> <PageTitle
                    title={<IntlMessages id="global.doctor" />}
                />
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

            <FilterBar
                isShowAddButton={true}
                onAdd={onOpenModal}
                isShowPublishButtons={false}
                isShowCopyButton={false}
                isShowDeleteButton={false}
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
                <DoctorForm open={modal} onClose={onCloseModal} currentData={item} onReload={onReload} />
                : null}

        </Card>

    )
}

export default Doctors;