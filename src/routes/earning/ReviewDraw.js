import React, { Component } from 'react'
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Tabs, Radio } from "antd";
import IntlMessages from "../../components/IntlMessage";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { getEarningData, getEarningOverview, getEarningReview, requestEarning } from '../../redux/actions/EarningActions';
class ReviewDraw extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {
        this.props.getEarningReview().then(res => (
            this.setState({
                data_order: res.data.data_order,
                data_withdraw: res.data.data_withdraw
            })
        ))
    }
    onHandleClose = () => {
        this.props.onClose();
    };
    handleOk = () => {
        let { data_order, data_withdraw } = this.state
        let amount = data_withdraw && data_withdraw.length ? data_withdraw[0] && data_withdraw[0].total ? data_withdraw[0].total : 0 : 0
        let order_ids = data_order && data_order.length ? data_order.map(item=>(
            item.id
        ))
        : []
        let dataSub = {
            amount:amount,
            order_ids:order_ids
        }
        this.props.requestEarning(dataSub).then(
            res=>(
                this.props.getEarningData(),
                this.props.getEarningOverview(),
                this.props.getEarningReview(),
                this.props.onClose()
            )
        )
    }
    render() {
        const { open } = this.props
        return (
            <Modal
                visible={open}
                onOk={this.handleOk}
                onCancel={this.onHandleClose}
            >
                <div style={{ textAlign: 'left' }}>
                Bạn có chắc chắn muốn rút tiền không?
                </div>
            
            </Modal>

        )
    }
}

const mapStateToProps = (state) => {
    return {

        config: state.config,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getEarningReview: () => dispatch(getEarningReview()),
        requestEarning: (data) => dispatch(requestEarning(data)),
        getEarningData: (filter) => dispatch(getEarningData(filter)),
        getEarningOverview: () => dispatch(getEarningOverview()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReviewDraw));
