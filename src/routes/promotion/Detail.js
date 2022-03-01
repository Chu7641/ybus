import { Table, Button, Col, Form, Input, InputNumber, Row, DatePicker, Spin, Select, Upload, Modal, Card } from "antd";
import PageTitle from "../../components/PageTitle";
import { DeleteOutlined } from '@ant-design/icons';
import IntlMessages from "../../components/IntlMessage";
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { _getAll, _create, _update, _delete, _getDetail, _getAllRoom, _createPromotionProduct, _getAllPromotionProduct, _deletePromotionProduct } from "../../redux/actions/PromotionAction";
import { debounce } from "lodash";
import BaseSelect from "../../components/Elements/BaseSelect";
// import InputChosseFile from "../fileManager/InputChosseFile";

const { confirm } = Modal;

const routes = [
    {
        path: '/',
        breadcrumbName: 'Trang chủ',
    },
    {
        path: '/app/promotion',
        breadcrumbName: 'Khuyến mại',
    },
    {
        path: '/promotion/:id',
        breadcrumbName: 'Chi tiết',
    },
]


const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
    }
};

const typeOption = [
    { title: <IntlMessages id="promotion.percent" />, id: "1" },
    { title: <IntlMessages id="promotion.fixed_number" />, id: "2" },
];

const styleOption = [
    { title: <IntlMessages id="promotion.normal" />, id: "1" },
    { title: <IntlMessages id="promotion.additional_of_admin" />, id: "2" },
]

const statusOption = [
    { title: <span><IntlMessages id="global.published" /></span>, id: "1" },
    { title: <span><IntlMessages id="global.unpublished" /></span>, id: "2" },
]


class PromotionDetail extends Component {


    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            loading: true,
            isSubmiting: false,
            edit: false,
            productType: "1",
            list: [],
            loadingProduct: false,
            image: ""
        };

        this.columns = [
            {
                key: "created_at",
                title: "STT",
                dataIndex: "created_at",
                align: "left",
                width: "15%",
                render: (text, record, rest) => {
                    let { filter } = this.state;
                    let index = rest + 1;
                    return index;
                }

            },
            // {
            //     key: "product_id",
            //     title: "ID",
            //     dataIndex: "product_id",
            //     width: "15%",
            //     align: "center",
            // },
            {
                title: <IntlMessages id="global.title" />,
                dataIndex: "title",
                key: "title",
                width: "70%",
            },
            {
                key: "updated_at",
                title: <IntlMessages id="global.actions" />,
                dataIndex: "updated_at",
                render: (text, record, rest) => (
                    <Button shape="circle" type="danger" onClick={() => this.onDelete(record.id)}>
                        <DeleteOutlined />
                    </Button>
                )
            },
        ];

    }


    async componentDidMount() {

        try {
            let { id } = this.props.match.params
            await this.props._getDetail(id);
            await this.props._getAllPromotionProduct(id);
            let res = await _getAllRoom({ paging: 0, approved: 1, status: 1 });

            this.setState({
                ...this.state,
                loading: false,
                list: res && res.list ? res.list : []
            });
        } catch (error) {
            this.setState({
                ...this.state,
                loading: false
            })
        }

    }

    handleSubmit = values => {
        var record = {
            ...values,
            start_date: values.start_date.format("YYYY-MM-DD HH:mm:ss"),
            start_buy: values.start_buy.format("YYYY-MM-DD HH:mm:ss"),
            end_date: values.end_date.format("YYYY-MM-DD HH:mm:ss"),
            end_buy: values.end_buy.format("YYYY-MM-DD HH:mm:ss"),
            image: this.state.image,
            style: "1"
        };

        this.onSave(
            record,
            this.props.record ? this.props.record.id : null
        )
    };

    onSave = (data, id) => {
        console.log(data)
        this.setState({
            ...this.state,
            isSubmiting: true
        });
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
    };
    //add  end


    onSelectProduct = (v, option) => {
        let data = {
            product_id: v,
            promotion_id: this.props.match.params.id,
            type_product: 4,
        }
        this.props._createPromotionProduct(data, option.props.title)
    }


    onDelete(id) {
        this.setState({
            ...this.state,
            isSubmiting: true
        }, async () => {
            try {
                await this.props._deletePromotionProduct(id);
                this.setState({
                    ...this.state,
                    isSubmiting: false
                })
            } catch (error) {
                this.setState({
                    ...this.state,
                    isSubmiting: false
                })

            }
        })
    }

    getValueChosseFile = data => {
        this.setState({
            ...this.state,
            image: data[0] ? data[0].path_relative : ""
        });
    };

    render() {

        const { loading, isSubmiting, loadingProduct } = this.state;
        const { list } = this.state;
        const {
            record,
            promotion_product
        } = this.props;
        if (loading) return (
            <Spin>
                <Card bordered={false} style={{ height: "100%" }}>
                    <PageTitle
                        title={<IntlMessages id="sidebar.promotionDetail" />}
                        routes={routes}
                    />
                </Card>
            </Spin>
        )
        return (
            <Card bordered={false} >
                
                <PageTitle
                    title={<IntlMessages id="sidebar.promotionDetail" />}
                    routes={routes}
                />

                <Row gutter={[10, 10]}>
                    <Col span={14} >
                        <Card title={<IntlMessages id="promotion.information" />} style={{ height: "100%" }}>
                            <Form
                                ref={this.formRef}
                                {...formItemLayout}
                                onFinish={this.handleSubmit}
                                initialValues={record ? {
                                    ...record,
                                    start_date: record.start_date ? moment(record.start_date) : null,
                                    end_date: record.end_date ? moment(record.end_date) : null,
                                    start_buy: record.start_buy ? moment(record.start_buy) : null,
                                    end_buy: record.end_buy ? moment(record.end_buy) : null,
                                    type: record.type ? record.type.toString() : "1",
                                    status: record.status ? record.status.toString() : "1"
                                }
                                    : {
                                        type: "1",
                                        status: "1"
                                    }}
                            >
                                <Form.Item label={<IntlMessages id="global.title" />} name="title" rules={[
                                    {
                                        required: true,
                                        message: "Please input title"
                                    }
                                ]}>
                                    <Input placeholder="Title of promotion" />
                                </Form.Item>
                                <Form.Item label={<IntlMessages id="global.description" />} name="description" rules={[
                                    {
                                        required: true,
                                        message: "Please input description"
                                    }
                                ]} >
                                    <Input placeholder="Description of promotion" />
                                </Form.Item>
                                <Form.Item label={<IntlMessages id="promotion.amount" />} name="amount" rules={[
                                    {
                                        required: true,
                                        message: "Please input amount"
                                    }
                                ]} >
                                    <InputNumber style={{ width: "100%" }} placeholder="Amount of promotion" />
                                </Form.Item>
                                <Form.Item label={<IntlMessages id="global.type" />} name="type" rules={[
                                    {
                                        required: true,
                                        message: "Select type of promotion"
                                    }
                                ]}>
                                    <BaseSelect
                                        showSearch
                                        options={typeOption}
                                        selected={record ? record.type ? record.type.toString() : "1" : "1"}
                                  
                                    />
                                </Form.Item>

                                <Form.Item label={<IntlMessages id="global.status" />} name="status" rules={[
                                    {
                                        required: true,
                                        message: "Select status of promotion"
                                    }
                                ]} >
                                    <BaseSelect
                                        showSearch
                                        options={statusOption}
                                        selected={record ? record.status ? record.status.toString() : "1" : "1"}
                                    // onChange={value => console.log(value)}
                                    />
                                </Form.Item>

                                <Row>
                                    <Col span={12} >
                                        <Form.Item label={<IntlMessages id="promotion.start_date" />} name="start_date" rules={[
                                            {
                                                required: true,
                                                message: "Select start date of promotion"
                                            }
                                        ]} >
                                            <DatePicker
                                                disabledTime={d => !d || d.isSameOrBefore(record && record.end_date)}
                                                showTime
                                                style={{ width: "100%" }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item label={<IntlMessages id="promotion.end_date" />} name="end_date" rules={[
                                            {
                                                required: true,
                                                message: "Select end date of promotion"
                                            }
                                        ]} >
                                            <DatePicker
                                                disabledTime={d => !d || d.isSameOrAfter(record && record.start_date)}
                                                showTime
                                                style={{ width: "100%" }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={12}>

                                        <Form.Item label={<IntlMessages id="promotion.start_buy_date" />} name="start_buy" rules={[
                                            {
                                                required: true,
                                                message: "Select start buy date of promotion"
                                            }
                                        ]} >
                                            <DatePicker
                                                disabledTime={d => !d || d.isSameOrBefore(record && record.end_buy)}
                                                showTime
                                                style={{ width: "100%" }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>

                                        <Form.Item label={<IntlMessages id="promotion.end_buy_date" />} name="end_buy" rules={[
                                            {
                                                required: true,
                                                message: "Select end buy date of promotion"
                                            }
                                        ]} >
                                            <DatePicker
                                                disabledTime={d => !d || d.isSameOrAfter(record && record.start_buy)}
                                                showTime
                                                style={{ width: "100%" }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>


                                {/* <Form.Item label={<IntlMessages id="global.image" />}>

                                    </Form.Item> */}

                                <div className="d-flex justify-content-end">
                                    <Button
                                        style={{ marginLeft: 8 }}
                                        type='default'
                                        onClick={() => this.formRef.current.resetFields()}
                                    >
                                        <IntlMessages id="global.cancel" />
                                    </Button>
                                    <Button
                                        type="primary"
                                        style={{ marginLeft: 8 }}
                                        htmlType="submit"
                                        loading={isSubmiting}
                                    >
                                        <IntlMessages id="global.save" />
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </Col>

                    <Col span={10}>
                        <Card title={<IntlMessages id="promotion.items" />} style={{ height: "100%" }} >
                            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
                                <div style={{ fontSize: "16px", fontWeight: "500", marginRight: "20px" }}>
                                    <IntlMessages id="promotion.choose_item" />
                                </div>
                                <Select
                                    onSelect={this.onSelectProduct}
                                    loading={loadingProduct}
                                    className="w-75"
                                    placeholder="Select items product to apply the promotion"
                                    showSearch={true}
                                    allowClear={true}
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {list && list.length ?
                                        list.map(item => (
                                            <Select.Option key={item.id} value={item.id} title={item.title}>{item.title}</Select.Option>
                                        ))
                                        : null
                                    }
                                </Select>
                            </div>
                            <Table
                                columns={this.columns}
                                dataSource={promotion_product}
                                tableLayout="auto"
                                rowKey="id"
                                size="middle"
                                // scroll={{ y: "80vh" }}
                                pagination={false}
                            />
                        </Card>
                    </Col>
                </Row>

            </Card>

        );
    }
}
const mapStateToProps = state => {
    return {
        auth: state.auth.authUser,
        record: state.promotion.detail,
        promotion_product: state.promotion.promotion_product
    };
};

const mapDispatchToProps = dispatch => {
    return {
        _getAll: (filter) => dispatch(_getAll(filter)),
        _create: data => dispatch(_create(data)),
        _update: data => dispatch(_update(data)),
        _delete: data => dispatch(_delete(data)),
        _getDetail: id => dispatch(_getDetail(id)),
        _createPromotionProduct: (data, title) => dispatch(_createPromotionProduct(data, title)),
        _getAllPromotionProduct: id => dispatch(_getAllPromotionProduct(id)),
        _deletePromotionProduct: id => dispatch(_deletePromotionProduct(id)),


    };
};
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(PromotionDetail)
);
