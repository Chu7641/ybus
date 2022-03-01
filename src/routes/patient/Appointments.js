import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getAllAppointment, deleteAppointment, updateAppointment } from '../../redux/actions/AppointmentAction';
import IntlMessages from "../../components/IntlMessage";
import { Button, Card, Table, Tag, Modal, Switch, Space } from 'antd';
import TableActionBar from '../../components/FilterBar';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import PageTitle from '../../components/PageTitle';
import AppointmentForm from './AppointmentForm';
import { debounce } from 'lodash';
import { useIntl } from 'react-intl'
import ActionBar from '../../components/ActionBar';
import { useParams } from 'react-router-dom';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';
import AppointmentStatus from '../../components/Status';


Appointments.propTypes = {
    items: PropTypes.array
};
Appointments.defaultProps = {
    items: []
}

function Appointments(props) {

    // const isMount = useRef(false)

    const { patient_id } = props
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
            let items = await (getAllAppointment(filter));


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
                await (deleteAppointment(data.id));
                setDeleting(true);
            },
            onCancel() { },
        })
    }
    const onChangeStatus = async (ischecked, record) => {


        await (updateAppointment(record.id, { status: ischecked }));

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

            dataIndex: "doctor",
            render: (text, record) => {
                return `${record.doctor}`

            },

        },

        {
            title: <IntlMessages id="global.status" />,
            key: "status",
            sorter: true,

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


        <>


            <ActionBar
                isShowAddButton={true}
                onAdd={onOpenModal}
                isShowPublishButtons={false}
                isShowCopyButton={false}
                isShowDeleteButton={false}
                onFilter={onFilter}
            >
            </ActionBar>

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
                    <AppointmentForm open={modal} onClose={onCloseModal} currentData={item} patient_id={patient_id} onReload={onReload} />
                    : null
            }

        </>

    )
}

export default Appointments;