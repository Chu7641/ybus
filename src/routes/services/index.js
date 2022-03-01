import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { deleteService, updateService } from '../../redux/actions/ServiceAction';
import serviceApi from '../../api/service';
import IntlMessages from "../../components/IntlMessage";
import { Button, Card, Table, Tag, Modal, Switch, Row, Col, Space } from 'antd';
import TableActionBar from '../../components/FilterBar';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import PageTitle from '../../components/PageTitle';
import ServiceForm from './ServiceForm';
import { debounce } from 'lodash';
import { useIntl } from 'react-intl'
import Currency from '../../components/Currency';
import ActionBar from '../../components/ActionBar';
import FilterBar from '../../components/FilterBar';


Services.propTypes = {
    items: PropTypes.array
};
Services.defaultProps = {
    items: []
}

function Services(props) {

    // const isMount = useRef(false)

    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(1);
    const [item, setItem] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(true);
    const [condition, setCondition] = useState({});

    const [filter, setFilter] = useState({
        page: 1,
        limit: 10,
        keyword: "",
        order_by: 'name',
        order_dir: 'ASC',
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
            order_by: sorter.columnKey ? `${sorter.columnKey}` : 'name',
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
            let items = await serviceApi.getAll(filter);
            let categories = await serviceApi.getGroup();
            categories = Object.keys(categories).map((item, index) => {
                let key = "group." + categories[item];
                return { id: categories[item], title: <IntlMessages id={key} /> }
            })
            setCategories(categories);
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
                await serviceApi.delete(data.id);
                setDeleting(true);
            },
            onCancel() { },
        })
    }
    const onChangeStatus = async (ischecked, record) => {

        console.log(ischecked);
        await (updateService(record.id, { status: ischecked }));

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
        return "ASC";
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
            title: <IntlMessages id="global.name" />,
            key: "name",
            sorter: true,

            dataIndex: "name",
            render: (text, record) => {
                return `${record.name}`

            },

        },

        {
            title: <IntlMessages id="global.category" />,
            key: "category",
            sorter: true,

            dataIndex: "category",
            render: (text, record) => {
                return <IntlMessages id={`group.${record.category}`} />
            },
        },

        {
            title: <IntlMessages id="global.price" />,
            key: "price",
            sorter: true,
            width: 100,
            dataIndex: "price",
            render: (text, record) => {

                return <Currency value={record.price}></Currency>


            },

        },

        {
            title: <IntlMessages id="global.supplies_price" />,
            key: "supplies_price",
            sorter: true,
            width: 100,
            dataIndex: "supplies_price",
            render: (text, record) => {

                return <Currency value={record.price}></Currency>

            },

        },

        {
            title: <IntlMessages id="global.warranty" />,
            key: "warranty_desc",
            sorter: true,
            width: 250,
            dataIndex: "warranty_desc",
            render: (text, record) => {
                return `${record.warranty_desc}`

            },

        },

        {
            title: <IntlMessages id="global.status" />,
            dataIndex: "status",
            width: 100,
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
                    title={<IntlMessages id="global.services" />}
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
                data={[
                    {
                        name: "category",
                        data: categories,
                        placeholder: <IntlMessages id="global.select_category" />,
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
                <ServiceForm open={modal} onClose={onCloseModal} currentData={item} onReload={onReload} />
                : null}

        </Card>

    )
}

export default Services;