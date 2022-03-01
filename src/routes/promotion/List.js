import { Table, Button, Tag, Card } from "antd";
import PageTitle from "../../components/PageTitle";
import IntlMessages from "../../components/IntlMessage";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import TableActionBar from "../../components/TableActionBar";
import LayoutContent from "../../components/LayoutContent";
import Add from "./Add";
import { _getAll, _create, _update, _delete } from "../../redux/actions/PromotionAction";
import { debounce } from "lodash"

const routes = [
    {
        path: '/',
        breadcrumbName: 'Trang chủ',
    },
    {
        path: '/promotion',
        breadcrumbName: 'Danh sách khuyến mại',
    },
]

const dataFilter = [
    {
        name: 'type',
        col: 6,
        placeholder: 'Kiểu',
        value: [''],
        data: [
            { title: "Phần trăm", id: "1" },
            { title: "Cố định", id: "2" },
        ]
    },
    {
        name: 'style',
        col: 6,
        placeholder: 'Loại khuyến mại',
        value: [''],
        data: [
            { title: "Thông thường", id: "1" },
            { title: "Thêm bởi admin", id: "2" },
        ]
    },
]

class Promotion extends Component {
    constructor(props) {
        super(props);
        this.onChangeTable = debounce(this.onChangeTable, 300);
        this.filter = debounce(this.filter, 300);
        this.state = {
            loading: true,
            filter: {
                sort: {
                    type: "desc",
                    attr: ""
                },
                search: "",
                paging: {
                    perpage: 15,
                    page: 1
                }
            },
            isOpenModal: false,
            selectedRowKeys: [],
            isSubmiting: false,
            current_record: null,
            edit: false
        };

        this.columns = [
            {
                title: <IntlMessages id="global.title" />,
                dataIndex: "title",
                key: "title",
                render: (text, record) => (
                    <Link to={`/app/promotion/${record.id}`} >{text}</Link>
                )
            },
            {
                title: <IntlMessages id="promotion.amount" />,
                dataIndex: "amount",
                key: "amount",
                sorter: true
            },
            {
                title: <IntlMessages id="global.type" />,
                dataIndex: "type",
                key: "type",
                render: (text, record) => (text == 1 ? <IntlMessages id="promotion.percent" /> : <IntlMessages id="promotion.fixed_number" />)
            },
            {
                title: <IntlMessages id="promotion.style" />,
                dataIndex: "style",
                key: "style",
                render: (text, record) => (text == 1 ? <IntlMessages id="promotion.normal" /> : <IntlMessages id="promotion.additional_of_admin" />)
            },
            {
                title: <IntlMessages id="global.status" />,
                dataIndex: "status",
                key: "status",
                render: (text, record) => (
                    record ? (
                        record.status === 1 ? (
                            <Tag color="green">
                                <IntlMessages id="global.published" />
                            </Tag>
                        ) : (
                                <Tag color="red">
                                    <IntlMessages id="global.unpublished" />
                                </Tag>
                            )
                    ) : null
                )
            },
            {
                title: <IntlMessages id="promotion.start_date" />,
                dataIndex: "start_date",
                key: "start_date",
                align:'center',
                sorter: true,
                render: (text, record) => (
                    <div>
                        <div>{moment(text).format("HH:mm")}</div>
                        <div>{moment(text).format("DD/MM/YYYY")}</div>
                    </div>
                ),
            },
            {
                title: <IntlMessages id="promotion.end_date" />,
                dataIndex: "end_date",
                key: "end_date",
                sorter: true,
                align:'center',
                render: (text, record) => (
                    <React.Fragment>
                        <div>{moment(text).format("HH:mm")}</div>
                        <div>{moment(text).format("DD/MM/YYYY")}</div>
                    </React.Fragment>
                ),
            },
            {
                title: <IntlMessages id="promotion.start_buy_date" />,
                dataIndex: "start_buy",
                key: "start_buy",
                sorter: true,
                align:'center',
                render: (text, record) => (
                    <React.Fragment>
                        <div>{moment(text).format("HH:mm")}</div>
                        <div>{moment(text).format("DD/MM/YYYY")}</div>
                    </React.Fragment>
                ),
            },
            {
                title: <IntlMessages id="promotion.end_buy_date" />,
                dataIndex: "end_buy",
                key: "end_buy",
                align:'center',
                sorter: true,
                render: (text, record) => (
                    <React.Fragment>
                        <div>{moment(text).format("HH:mm")}</div>
                        <div>{moment(text).format("DD/MM/YYYY")}</div>
                    </React.Fragment>
                ),
            },
            {
                title: <IntlMessages id="global.created" />,
                dataIndex: "created_at",
                key: "created_at",
                align:'center',
                className: "center-column",
                render: (text, record) => (
                    <React.Fragment>
                        <div>{moment(text).format("HH:mm")}</div>
                        <div>{moment(text).format("DD/MM/YYYY")}</div>
                    </React.Fragment>
                ),
                sorter: true
            },
            // {
            //     title: <IntlMessages id="global.id" />,
            //     dataIndex: "id",
            //     key: "id",
            //     className: "center-column",
            //     render: (text, record) => (
            //         <Link to={`/app/promotion/${record.id}`} >{text}</Link>
            //     ),
            // },
        ];

    }


    async componentDidMount() {
        const { auth } = this.props;
        try {
            await this.props._getAll(
                {
                    ...this.state.filter,
                    cid: {
                        type: "=",
                        value: auth.id
                    }
                }
            );
            this.setState({
                ...this.state,
                loading: false,
                filter: {
                    ...this.state.filter,
                    cid: {
                        type: "=",
                        value: auth.id
                    }
                }
            });
        } catch (error) {
            this.setState({
                ...this.state,
                loading: false
            })
        }

    }


    //paging start
    onChangePerpage(current, size) {
        this.setState(
            {
                ...this.state,
                filter: {
                    ...this.state.filter,
                    paging: {
                        perpage: size,
                        page: current
                    }
                }
            },
            async () => {
                try {
                    await this.props._getAll(this.state.filter);
                    this.setState({
                        ...this.state,
                        loading: false
                    });
                } catch (error) {
                    this.setState({
                        ...this.state,
                        loading: false
                    })
                }
            }
        );
    }
    onChangePage(page, pageSize) {
        this.setState(
            {
                ...this.state,
                filter: {
                    ...this.state.filter,
                    paging: {
                        perpage: pageSize,
                        page: page
                    }
                },
                loading: true
            },
            async () => {
                try {
                    await this.props._getAll(this.state.filter);
                    this.setState({
                        ...this.state,
                        loading: false
                    });
                } catch (error) {
                    this.setState({
                        ...this.state,
                        loading: false
                    })
                }
            }
        );
    }
    //paging end


    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };



    //add 
    onAdd = () => {
        this.setState({ isOpenModal: true });
    };
    onEdit(record) {
        this.setState({
            isOpenModal: true,
            current_record: record,
            edit: true
        });
    }
    onClose = () => {
        this.setState({
            isOpenModal: false,
            current_record: null,
            isSubmiting: false,
            edit: false
        });
    };
    onSave = (data, id) => {
        console.log(data)
        this.setState({
            ...this.state,
            isSubmiting: true
        });
        if (this.state.edit) {
            var dataSubmit = { ...data, id: id };
            this.props
                ._update(dataSubmit)
                .then(res => {
                    this.setState({
                        ...this.state,
                        isSubmiting: false,
                        isOpenModal: false,
                        current_record: null,
                        edit: false
                    });
                })
                .catch(err => {
                    this.setState({
                        ...this.state,
                        isSubmiting: false
                    });
                });
        } else {
            var { auth } = this.props;
            data.cid = auth.id;
            this.props
                ._create(data)
                .then(res => {
                    this.setState({
                        ...this.state,
                        isSubmiting: false,
                        isOpenModal: false,
                        current_record: null,
                        edit: false
                    });
                })
                .catch(err => {
                    this.setState({
                        ...this.state,
                        isSubmiting: false
                    });
                });
        }

    };
    //add  end


    onRefresh() {
        this.props._getAll(this.state.filter);
        this.setState({
            selectedRowKeys: []
        });
    }


    //sort, filter start
    getOrder(order) {
        if (order === "ascend") return "asc";
        if (order === "descend") return "desc";
        return "desc";
    }

    onChangeTable = (
        pagination,
        filters,
        sorter,
        extra = { currentDataSource: [] }
    ) => {
        this.setState(
            {
                ...this.state,
                loading: true,
                filter: {
                    ...this.state.filter,
                    paging: {
                        page: pagination.current,
                        perpage: pagination.pageSize
                    },
                    sort: {
                        type: this.getOrder(sorter.order),
                        attr: sorter.columnKey
                    }
                }
            },
            async () => {
                try {
                    await this.props._getAll(this.state.filter);
                    this.setState({
                        ...this.state,
                        loading: false
                    });
                } catch (error) {
                    this.setState({
                        ...this.state,
                        loading: false
                    })
                }
            }
        );
    };

    onDelete() {
        this.setState({
            ...this.state,
            isSubmiting: true
        }, async () => {
            try {
                await this.props._delete({ id: this.state.selectedRowKeys })
                this.setState({
                    ...this.state,
                    selectedRowKeys: [],
                    isSubmiting: false
                });
            } catch (error) {
                this.setState({
                    ...this.state,
                    isSubmiting: false
                });
            }
        })
    }
    filter = (value, name, type) => {
        if (type === "search") {
            this.setState(
                {
                    ...this.state,
                    loading: true,
                    filter: {
                        ...this.state.filter,
                        search: value
                    }
                },
                async () => {
                    try {
                        await this.props._getAll(this.state.filter);
                        this.setState({
                            ...this.state,
                            loading: false
                        });
                    } catch (error) {
                        this.setState({
                            ...this.state,
                            loading: false
                        })
                    }
                }
            );
        } else
            this.setState(
                {
                    ...this.state,
                    loading: true,
                    filter: {
                        ...this.state.filter,
                        [name]: {
                            type: "=",
                            value: value
                        }
                    }
                },
                async () => {
                    try {
                        await this.props._getAll(this.state.filter);
                        this.setState({
                            ...this.state,
                            loading: false
                        });
                    } catch (error) {
                        this.setState({
                            ...this.state,
                            loading: false
                        })
                    }
                }
            );
    };
    //sort filter end



    render() {

        const { selectedRowKeys, loading, isSubmiting } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        const hasSelected = selectedRowKeys.length > 0;

        const { list, paging } = this.props;
        return (
            <Card bordered={false} style={{height:'100%'}}>
                
                <PageTitle
                    title={<IntlMessages id="sidebar.promotion" />}
                    routes={routes}
                />
                <TableActionBar
                    onAdd={() => this.onAdd()}
                    onDelete={() => this.onDelete()}
                    onRefresh={() => this.onRefresh()}
                    isDisabled={!hasSelected}
                    rows={this.state.selectedRowKeys}
                    table="price"
                    isShowPublishButtons={false}
                    showFilter={true}
                    onFilter={this.filter}
                    data={dataFilter}
                    textSearch={true}
                    loadingSubmit={isSubmiting}
                >
                    {hasSelected ? <IntlMessages id="global.selected_items" values={{ count: selectedRowKeys.length }} /> : null}
                </TableActionBar>

               
                    <Table
                        loading={loading}
                        rowSelection={rowSelection}
                        columns={this.columns}
                        dataSource={list}
                        tableLayout="auto"
                        rowKey="id"
                        size="middle"
                        pagination={{
                            pageSizeOptions: ["15", "30", "50"],
                            total: paging.count,
                            showSizeChanger: true,
                            current: this.state.filter.paging.page,
                            pageSize: this.state.filter.paging.perpage
                        }}
                        onChange={this.onChangeTable}
                    />
              

                <Add
                    open={this.state.isOpenModal}
                    onSave={this.onSave}
                    onClose={this.onClose}
                    isSubmiting={this.state.isSubmiting}
                    edit={this.state.edit}
                    record={this.state.current_record}
                />
            </Card>
        );
    }
}
const mapStateToProps = state => {
    return {
        list: state.promotion.list,
        paging: state.promotion.paging,
        auth: state.auth.authUser
    };
};

const mapDispatchToProps = dispatch => {
    return {
        _getAll: (filter) => dispatch(_getAll(filter)),
        _create: data => dispatch(_create(data)),
        _update: data => dispatch(_update(data)),
        _delete: data => dispatch(_delete(data)),
    };
};
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Promotion)
);
