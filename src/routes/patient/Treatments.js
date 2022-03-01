import { Table, Button, Space, Modal } from "antd";
import React, { Component, useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { useParams, withRouter } from "react-router-dom";
import IntlMessages from "../../components/IntlMessage";
import moment from "moment";
import treatmentApi from '../../api/treatment';
import { CalendarOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import TreatmentForm from "./TreatmentForm";
import ActionBar from "../../components/ActionBar";
import AppointmentForm from "./AppointmentForm";
import Currency from "../../components/Currency";
import { useIntl } from 'react-intl'

export default function Treatments(props) {



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


    // state = {
    //     edit: false,
    //     items: [],
    //     record: null,
    //     open: false,
    //     appointmentModal: false,
    //     item: null,
    //     loading: false,
    //     filter: {
    //         page: 1,
    //         limit: 10,
    //         keyword: "",
    //         order_by: 'treatment.id',
    //         order_dir: 'DESC',
    //         filter_name: ['patient_id']
    //     }
    // };
    //const patient = useSelector(state => state.patient.patient);

    useEffect(() => {

        async function fetchData() {
            setLoading(true);
            let items = await treatmentApi.getAll(filter);

            setItems(items.data);
            setLoading(false);
            setDeleting(false);
            if (total != items.total)
                setTotal(items.total);
        }
        fetchData();

    }, [filter, deleting, reload])

    // componentDidMount() {

    //     const filter = {
    //         page: 1,
    //         limit: 10,
    //         keyword: "",
    //         order_by: 'treatment.id',
    //         order_dir: 'DESC',
    //         filter_value: [this.props.match.params.id],
    //         filter_name: ['patient_id']
    //     };
    //     getAllTreatment(filter).then(res => {
    //         this.setState({
    //             items: res.data,
    //             loading: false,
    //             filter: {
    //                 ...this.state.filter,
    //                 filter_value: [this.props.match.params.id],
    //             }
    //         })

    //     });


    // }

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
                await (treatmentApi.delete(data.id));
                setDeleting(true);
            },
            onCancel() { },
        })
    }
    const onChangeStatus = async (ischecked, record) => {

        // console.log(ischecked);
        // await (updateBill(record.id, { status: ischecked }));

    }


    const getOrder = (order) => {
        if (order === "ascend") return "ASC";
        if (order === "descend") return "DESC";
        return "DESC";
    }





    const { listDoctors } = props;


    items.forEach(element => {
        element.service_name = element.service.name;
        element.doctor_alias = element.doctor.alias;
        element.doctor_id = element.doctor.id;
        element.service_id = element.service.id;
        if (element.assistant)
            element.assistant_id = element.assistant.id;

    });



    const columns = [

        {
            title: <IntlMessages id="global.datetime" />,
            key: "created_at",
            width: 100,
            sorter: true,
            dataIndex: "treated_at",
            render: (text, record) => {
                if (record.treated_at) {
                    return (
                        <div>{moment(record.treated_at).format("HH:mm")}</div>
                    )
                } else {
                    return <div>--</div>
                }
            },
        },
        {
            title: <IntlMessages id="global.service" />,
            key: "service_name",

            sorter: true,
            dataIndex: "service_name",

        },

        {
            title: <IntlMessages id="global.price" />,
            key: "price",
            width: 100,
            sorter: true,
            dataIndex: "price",
            render: (text, record) => {
                return <Currency value={record.price}></Currency>
            }

        },

        {
            title: <IntlMessages id="global.doctor" />,
            key: "doctor_alias",

            sorter: true,
            dataIndex: "doctor_alias",

        },

        {
            // title: <IntlMessages id="global.mobile" />,
            title: "",
            width: 120,
            align: true,
            render: (text, record) => {
                return (

                    <Space>

                        <Button size="small" onClick={() => this.onOpenAppointment(record)} type="primary" shape="round" icon={<CalendarOutlined />}></Button>
                        <Button size="small" onClick={() => this.onOpenModal(record)} type="primary" shape="round" icon={<EditOutlined />}></Button>
                        <Button size="small" onClick={() => this.onRemove(record)} type="primary" danger shape="round" icon={<DeleteOutlined />}></Button>
                    </Space>
                )


            },

        },


    ];

    return (

        <React.Fragment>
            <ActionBar
                isShowAddButton={true}
                onAdd={onOpenModal}
                isShowPublishButtons={false}
                isShowCopyButton={false}
                isShowDeleteButton={false}
                textSearch={false}
                onFilter={filter}
            >
            </ActionBar>
            <Table
                tableLayout="auto"
                columns={columns}
                dataSource={items}
                //onChange={this.onChangTable}
                rowKey="id"
                size="small"
                loading={loading}
                scroll={{
                    x: "max-content"
                }}
                footer={() => 'Footer'}
            />
            {modal ?
                <TreatmentForm
                    open={modal}
                    onClose={onCloseModal}
                    currentData={item}
                    listDoctors={listDoctors}
                    patient_id={id}
                    onReload={onReload}
                /> :
                null}


            <AppointmentForm
                open={modal}
                onClose={onCloseModal}
                currentData={null}
                patient_id={id}

            />


        </React.Fragment>
    )

}

