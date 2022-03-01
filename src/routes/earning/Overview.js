import React, { Component } from 'react'
import { Table, Tag, Card, Spin, Avatar, Button, Modal, DatePicker } from "antd";
import TableActionBar from '../../components/TableActionBar';
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import IntlMessages from "../../components/IntlMessage";
import moment from 'moment'
import NumberFormat from 'react-number-format';
import { getEarningData } from '../../redux/actions/EarningActions';
class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {
                sort: {
                    type: "desc",
                    attr: "",
                },
                paging: {
                    perpage: 10,
                    page: 1,
                },
                search: "",
            },
            filterAll: {
                paging: 0
            },
            edit: false,
            isSubmiting: false,
            selectedRowKeys: [], // Check here to configure the default column
            loading: true,
            open: false,




        }

        this.columns = [

            {
                title: <IntlMessages id="global.order_number" />,
                key: "order_number",
                sorter: true,
                dataIndex: "order_number",
                render: (text, record) => {
                    return (
                        <Link to={`/app/reservations/${record.id}`}>
                            {record.order_number}
                        </Link>
                    );
                },
            },


            {
                title: <IntlMessages id="global.property_title" />,
                key: "property_title",
                sorter: true,
                dataIndex: "property_title",
                render: (text, record) => {
                    return (
                        <Link to={`/app/property/form?id=${record.object_id}`}>
                            {record.property_title}
                        </Link>
                    );
                },
            },
            {
                title: <IntlMessages id='global.status' />,
                dataIndex: 'withdraw_status',
                align: 'center',
                key: 'withdraw_status',
                render: withdraw_status => {
                    if (withdraw_status == 'PENDING') return <Tag color='orange'><IntlMessages id='global.earning_pending' /></Tag>
                    if (withdraw_status == 'AVAILABLE') return <Tag color='green'><IntlMessages id='global.earning_available' /></Tag>
                    return <Tag color='red'><IntlMessages id='global.earning_paid' /></Tag>
                }
            },


          
            {
                title: <IntlMessages id="global.total" />,
                key: "total",
                sorter: true,
                dataIndex: "total",
                render: (text, record) => {
                    return (
                        <NumberFormat value={+record.total} thousandSeparator={true} displayType="text" suffix=" đ" />

                    );
                },
            },

            {
                title: <IntlMessages id="global.earned" />,
                key: "sup_earning",
                sorter: true,
                dataIndex: "sup_earning",
                render: (text, record) => {
                    return (
                        <NumberFormat value={+record.sup_earning} thousandSeparator={true} displayType="text" suffix=" đ" />

                    );
                },
            },

            {
                title: <IntlMessages id="global.depart" />,
                dataIndex: "depart",
                key: "depart",
                align: 'center',
                render: (text, record) => (
                    <React.Fragment>
                        <div>{moment(record.depart).format("DD/MM/YYYY")}</div>
                    </React.Fragment>
                ),
                sorter: true
            },

            {
                title: <IntlMessages id="global.return_date" />,
                dataIndex: "return_date",
                key: "return_date",
                align: 'center',
                render: (text, record) => (
                    <React.Fragment>
                        <div>{moment(record.return_date).format("DD/MM/YYYY")}</div>
                    </React.Fragment>
                ),
                sorter: true
            },




        ];
    }
   async componentDidMount() {
      await  this.props.getEarningData(this.state.filter)
      this.setState({
          loading: false
      })
    }

    onChange = (date, dateString) => {
        console.log('date', moment(date).format('DD-MM-YYYY'));
    }
    getOrder(order) {
        if (order === "ascend") return "asc";
        if (order === "descend") return "desc";
        return "desc";
    }

    onChangTable = (
        pagination,
        filters,
        sorter,
        extra = { itemDataSource: [] }
    ) => {
        this.setState(
            {
                ...this.state,
                loading: true,
                filter: {
                    ...this.state.filter,
                    sort: {
                        type: this.getOrder(sorter.order),
                        attr: sorter.columnKey,
                    },
                    paging: {
                        perpage: pagination.pageSize,
                        page: pagination.current,
                    },
                },
            },
            async () => {
                await this.props.getEarningData(this.state.filter);
                this.setState({
                    ...this.state,
                    loading: false
                })

            }
        );
    };
    filter = (value, name, type) => {
        if (type === "search") {
            this.setState(
                {
                    ...this.state,
                    loading: true,
                    filter: {
                        ...this.state.filter,
                        search: value,
                    },
                },
                async () => {
                    await this.props.getEarningData(this.state.filter);
                    this.setState({
                        ...this.state,
                        loading: false
                    })
                }
            );
        } else {
            this.setState(
                {
                    ...this.state,
                    loading: true,
                    filter: {
                        ...this.state.filter,
                        [name]: {
                            type: "=",
                            value: value,
                        },
                    },
                },
                async () => {
                    await this.props.getEarningData(this.state.filter);
                    this.setState({
                        ...this.state,
                        loading: false
                    })
                }
            );
        }
    }
    render() {
        const { list, paging } = this.props
        const { loading } = this.state
      
        const listStatusfilter = [
            {
                id: 'AVAILABLE',
                title: <span><IntlMessages id='global.earning_available' /></span>
            },
            {
                id: 'PENDING',
                title:  <span><IntlMessages id='global.earning_pending' /></span>
            },
            {
                id: 'PAID',
                title: <span><IntlMessages id='global.earning_paid' /></span>
            }
        ]
        return (
            <Card>
                <TableActionBar
                    isShowAddButton={false}
                    isShowPublishButtons={false}
                    isShowCopyButton={false}
                    isShowDeleteButton={false}
                    onFilter={this.filter}
                    data={[

                        {
                            name: "withdraw_status",
                            data: listStatusfilter,
                            placeholder: "Chọn trạng thái",
                        },

                    ]}
                >

                </TableActionBar>
                {/* <div style={{ marginTop: '-40px', marginBottom: '10px' }}>
                    <DatePicker onChange={this.onChange} picker="month" />

                </div> */}
                <Table
                    tableLayout="auto"
                    columns={this.columns}
                    dataSource={list}
                    onChange={this.onChangTable}
                    rowKey="id"
                    size="small"
                    loading={loading}
                    pagination={{
                        showSizeChanger: true,
                        pageSizeOptions: ["1", "5", "10", "20", "30"],
                        total: paging.count,
                    }}
                />
            </Card>
        )
    }
}

const mapStateToProps = (state) => {
    return {

        config: state.config,
        list: state.earning.list,
        paging: state.earning.paging,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getEarningData: (filter) => dispatch(getEarningData(filter)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Overview));