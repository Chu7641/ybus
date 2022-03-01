import React, { Component } from 'react'
import { connect } from "react-redux";
import { Table, Tag, Card, Spin, Avatar, Button, Modal } from "antd";
import { Link, withRouter } from "react-router-dom";
import PageTitle from '../../components/PageTitle';
import IntlMessages from "../../components/IntlMessage";
import Todo from './Todo';
import Overview from './Overview';
import Chart from './Transaction';
import ReviewDraw from './ReviewDraw';
import Transaction from './Transaction';
const routes = [
    {
        path: '/',
        breadcrumbName: 'Trang chủ',
    },
    {
        path: '/earning',
        breadcrumbName: 'Doanh thu hàng tháng',
    },
];
class Earning extends Component {
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
            visible: false,
        }

      
    }
    handleClick= ()=>{
        this.setState({
            visible: true
        })
    }
    onClose = () => {
        this.setState({
            visible: false,
           
        });
    };
    render() {
        const  {listOverview} = this.props
        return (
            <React.Fragment>
                <Card bordered={false}>

                    <PageTitle
                        title={<IntlMessages id="global.earning" />}
                        routes={routes}
                    />
                    <Todo />
                    <div className="mt-4"></div>
                    {
                        listOverview.in_wallet && listOverview.in_wallet.total>0 ?
                        <Button type="primary" onClick={()=>this.handleClick()}>
                        Yêu cau rut tiền
                    </Button>
                    :
                    null
                    }
                  
                    <div className="mt-4"></div>
                    <Overview />
                    <div className="mt-4"></div>
                    <Transaction />
                    <div className="mt-4"></div>
                </Card>
            <ReviewDraw 
                open= {this.state.visible}
                onClose={() => this.onClose()}
                /> 
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        listOverview: state.earning.listOverview,
        config: state.config,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Earning));