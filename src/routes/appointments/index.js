import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getAllAppointment, deleteAppointment, updateAppointment } from '../../redux/actions/AppointmentAction';
import IntlMessages from "../../components/IntlMessage";
import { Button, Card, Table, Tag, Modal, Switch, Space, Row, Col } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import PageTitle from '../../components/PageTitle';
import AppointmentForm from './AppointmentForm';
import { debounce } from 'lodash';
import { useIntl } from 'react-intl'
import ActionBar from '../../components/ActionBar';
import { useParams } from 'react-router-dom';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';
import FilterBar from '../../components/FilterBar';
import appointmentApi from '../../api/appointment';
import AppointmentStatus from '../../components/Status';


Appointments.propTypes = {
    items: PropTypes.array
};
Appointments.defaultProps = {
    items: []
}

function Appointments(props) {

    // const isMount = useRef(false)


    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(1);
    const [item, setItem] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(true);
    const { id } = useParams();
    const user = useSelector(state => state.auth.authUser);


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
            order_by: sorter.columnKey ? sorter.columnKey : 'id',
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
            let items = await appointmentApi.getAll(filter);

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
                appointmentApi.delete(data.id);
                setDeleting(true);
            },
            onCancel() { },
        })
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
            title: <IntlMessages id="global.patient" />,
            key: "patient",
            sorter: true,
            dataIndex: "patient",
            render: (text, record) => {
                return `${record.patient}`

            },

        },

        {
            title: <IntlMessages id="appointment.scheduled_date" />,
            key: "scheduled_date",
            sorter: true,
            width: 200,
            dataIndex: "scheduled_date",
            render: (text, record) => {
                return `${moment.tz(record.scheduled_date, user.timezone).format('DD-MM hh:mm')}`

            },

        },
        {
            title: <IntlMessages id="global.description" />,
            key: "description",
            sorter: true,
            dataIndex: "description",
            render: (text, record) => {
                return `${record.description}`

            },

        },
        {
            title: <IntlMessages id="global.doctor" />,
            key: "doctor",
            sorter: true,
            width: 200,
            dataIndex: "doctor",
            render: (text, record) => {
                return `${record.doctor}`

            },

        },

        {
            title: <IntlMessages id="global.status" />,
            key: "status",
            sorter: true,
            width: 200,
            dataIndex: "status",
            render: (text, record) => {
                return <AppointmentStatus value={record.status}></AppointmentStatus>
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
                        <Button title="Edit" size="small" type="primary" onClick={() => onOpenModal(record)} shape="round" icon={<EditOutlined />} ><IntlMessages id="global.edit" /></Button>
                        <Button type="primary" size="small" onClick={() => onRemove(record)} danger shape="round" icon={<DeleteOutlined />} ><IntlMessages id="global.delete" /></Button>
                    </Space>
                )

            },

        },

    ]

    return (


        <Card>

            <Row justify="space-between">

                <Col> <PageTitle
                    title={<IntlMessages id="global.appointments" />}
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
                    <AppointmentForm open={modal} onClose={onCloseModal} currentData={item} onReload={onReload} />
                    : null
            }

        </Card>

    )
}

export default Appointments;