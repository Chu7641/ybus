import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import IntlMessages from "../../components/IntlMessage";
import { Button, Card, Table, Tag, Modal, Col, Space, Typography, Row, message } from 'antd';
import TableActionBar from '../../components/FilterBar';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import PageTitle from '../../components/PageTitle';
import PatientForm from './PatientForm';
import { debounce } from 'lodash';
import { useIntl } from 'react-intl'
import moment from "moment";
import { Link } from 'react-router-dom';
import { deletePatient, getAllPatient, updatePatient } from '../../redux/actions/PatientAction';
import PhoneFormatter from '../../components/PhoneFormatted';
import FilterBar from '../../components/FilterBar';
import ActionBar from '../../components/ActionBar';
import { getAllDoctor } from '../../redux/actions/DoctorAction';
import doctorApi from '../../api/doctor';
import Gender from '../../components/Gender';
import Currency from '../../components/Currency';
const { Text } = Typography;

Patients.propTypes = {
    items: PropTypes.array
};
Patients.defaultProps = {
    items: []
}

function Patients(props) {

    // const isMount = useRef(false)


    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(1);
    const [item, setItem] = useState(null);

    const [doctors, setDoctors] = useState([]);

    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(true);
    const [condition, setCondition] = useState({});
    const [filter, setFilter] = useState({
        page: 1,
        limit: 10,
        keyword: "",
        order_by: 'id',
        order_dir: 'DESC',
        filter_name: [],
        filter_value: []
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
        } else {
            const filter_obj = { ...condition, [name]: value }
            let filter_name = [];
            let filter_value = [];
            for (var key in filter_obj) {
                if (filter_obj[key]) {
                    filter_name.push(key);
                    filter_value.push(filter_obj[key]);
                }
            }
            setFilter(filter => { return { ...filter, filter_name: filter_name, filter_value: filter_value } });
        }
    }, 300);

    useEffect(() => {

        async function fetchData() {
            setLoading(true);
            let result = await (getAllPatient(filter));

            let items = result.data;

            items = items.map(item => {
                let debt = +item.treatment_total - (+item.bill_total || 0);
                return { ...item, debt: debt };
            })

            console.log('items', items);

            setItems(items);
            setLoading(false);
            setDeleting(false);
            if (total != items.total)
                setTotal(items.total);
        }
        fetchData();

    }, [filter, deleting, reload])

    useEffect(() => {

        doctorApi.getAll({ ...filter, limit: 50 }).then(res => {
            res.data.map(item => {
                item.title = item.alias;
            })
            setDoctors(res.data);
        }
        )

    }, [])

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
                deletePatient(data.id);
                setDeleting(true);
                message.success({ content: intl.formatMessage({ id: "global.deleted_success" }) });
            },
            onCancel() { },
        })
    }
    const onChangeStatus = async (ischecked, record) => {

        updatePatient(record.id, { status: ischecked });

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
            title: <IntlMessages id="global.date" />,
            key: "created_at",
            width: 100,
            sorter: true,
            dataIndex: "created_at",
            render: (text, record) => {
                if (record.created_at) {
                    return (
                        <div>{moment(record.created_at).format("HH:mm")}</div>
                    )
                } else {
                    return <div>--</div>
                }
            },
        },

        {
            title: <IntlMessages id="global.name" />,
            key: "lastname",
            sorter: true,
            width: 200,
            dataIndex: "lastname",
            render: (text, record) => (

                <Link to={`/app/patient/${record.id}`} style={{ color: "blue" }}>
                    {record.firstname + ' ' + record.lastname}
                </Link>

            )

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
            title: <IntlMessages id="global.gender" />,
            key: "gender",
            sorter: true,
            dataIndex: "gender",
            render: (text, record) => {
                return <Gender gender={record.gender} />
            },

        },
        {
            title: <IntlMessages id="global.mobile" />,
            key: "mobile",
            sorter: true,
            dataIndex: "mobile",
            render: (text, record) => {
                return <PhoneFormatter phone={record.mobile} />
            },

        },
        {
            title: <IntlMessages id="global.description" />,
            key: "description",
            sorter: true,
            dataIndex: "description",
            render: (text, record) => {
                return <Text>{record.description}</Text>
            },

        },

        {
            title: <IntlMessages id="global.payment" />,

            key: "debt",
            sorter: false,
            dataIndex: "debt",
            render: (text, record) => {
                return <Currency value={record.debt || 0}></Currency>
            },

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
                    title={<IntlMessages id="global.patients" />}
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
                data={[
                    {
                        name: "doctor_id",
                        data: doctors,
                        placeholder: <IntlMessages id="global.select_doctor" />,
                    },

                ]}


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
                <PatientForm open={modal} onClose={onCloseModal} currentData={item} onReload={onReload} />
                : null}

        </Card>

    )
}

export default Patients;