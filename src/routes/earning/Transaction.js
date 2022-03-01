import { Line } from '@ant-design/charts';
import IntlMessages from "../../components/IntlMessage";
import React, { Component } from 'react';
import { connect } from 'react-redux';
import TableActionBar from '../../components/TableActionBar';
import { getTransaction, getTransactionDetail } from '../../redux/actions/TransactionAction';
import { Table, Tag, Card, Spin, Avatar, Button, Modal, DatePicker } from "antd";
import moment from 'moment'
import NumberFormat from 'react-number-format';
import { DeleteOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import DetailTransaction from './DetailTransaction';
class Transaction extends Component {
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
                title: <IntlMessages id='global.status' />,
                dataIndex: 'status',
                align: 'center',
                key: 'status',
                render: status => {
                    if (status == 'PENDING') return <Tag color='orange'><IntlMessages id='global.transaction_pending' /></Tag>
                    if (status == 'APPROVED') return <Tag color='green'><IntlMessages id='global.transaction_approved' /></Tag>
                    return <Tag color='red'><IntlMessages id='global.transaction_declined' /></Tag>
                }
            },
            {
                title: <IntlMessages id='global.count_order' />,
                dataIndex: 'count_order',
                align: 'center',
                key: 'count_order',
              
            },
            {
                title: <IntlMessages id="transaction.amount" />,
                key: "amount",
                sorter: true,
                dataIndex: "amount",
                render: (text, record) => {
                    return (
                        <NumberFormat value={+record.amount} thousandSeparator={true} displayType="text" suffix=" đ" />

                    );
                },
            },
            {
                title: <IntlMessages id="transaction.created_at" />,
                dataIndex: "created_at",
                key: "created_at",
                align: 'center',
                render: (text, record) => (
                    <React.Fragment>
                        <div>{moment(record.created_at).format("HH:mm")}</div>
                        <div>{moment(record.created_at).format("DD/MM/YYYY")}</div>
                    </React.Fragment>
                ),
                sorter: true
            },
            {
                title: <IntlMessages id="transaction.action" />,
                align: 'center',
                render: (text, record) => (
                    <div className='d-block'>
                        <span style={{ marginRight: '5px' }}
                            onClick={() => this.onEdit(record)}
                        >
                            <Button type="primary" shape="round" icon={<EditOutlined />} ><IntlMessages id="global.detail" /></Button>
                        </span>
                       
                    </div>
                )
            },

        ];
    }
    async componentDidMount() {
        await  this.props.getTransaction(this.state.filter)
        this.setState({
            loading: false
        })
      }
      onEdit = (record) =>{
        this.setState({
            open: true
        })
        this.props.getTransactionDetail(record.id)
      }
      onClose = () => {
        this.setState({
            open: false,
           
        });
    };
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
                await this.props.getTransaction(this.state.filter);
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
                    await this.props.getTransaction(this.state.filter);
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
                    await this.props.getTransaction(this.state.filter);
                    this.setState({
                        ...this.state,
                        loading: false
                    })
                }
            );
        }
    }
    render() {
       const {list,paging} = this.props
       const {loading , open} = this.state
       const listStatusfilter = [
        {
            id: 'APPROVED',
            title: <span><IntlMessages id='global.transaction_approved' /></span>
        },
        {
            id: 'PENDING',
            title:  <span><IntlMessages id='global.transaction_pending' /></span>
        },
        {
            id: 'DECLINED',
            title: <span><IntlMessages id='global.transaction_declined' /></span>
        }
    ]
        return (
            <React.Fragment>
               
                <Card style={{ width: "100%" }}>
                    <h2>Các giao dịch</h2>
                <TableActionBar
                    isShowAddButton={false}
                    isShowPublishButtons={false}
                    isShowCopyButton={false}
                    isShowDeleteButton={false}
                    onFilter={this.filter}
                    data={[

                        {
                            name: "status",
                            data: listStatusfilter,
                            placeholder: "Chọn trạng thái",
                        },

                    ]}
                >
                     </TableActionBar>
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
              <DetailTransaction
              open={open}
              onClose={() => this.onClose()}
              />
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {

        config: state.config,
        list: state.transaction.list,
        paging: state.transaction.paging,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getTransaction: (filter) => dispatch(getTransaction(filter)),
        getTransactionDetail: (id) => dispatch(getTransactionDetail(id)),
       
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);