import { Empty, Modal, Tabs, Spin } from "antd";
import moment from "moment";
import React, { Component } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import "../orders/node_modules/react-big-calendar/lib/css/react-big-calendar.css";
import { DateUtils } from "react-day-picker";
import "../orders/node_modules/react-day-picker/lib/style.css";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import BaseSelect from "../../components/Elements/BaseSelect";
import IntlMessages from "../../components/IntlMessage";
import LayoutContent from "../../components/LayoutContent";
import PageTitle from "../../components/PageTitle";
import { getPropertyOrder, _getAll } from "../../redux/actions/PropertyAction";

import config from '../../config'
const { URL_ASSET } = config;

// actions
const routes = [
    {
        path: '/',
        breadcrumbName: 'Trang chủ',
    },
    {
        path: '/calendar',
        breadcrumbName: 'Quản lý đơn hàng',
    },
];

moment.locale("vi");
// BigCalendar.momentLocalizer(moment);
const localizer = momentLocalizer(moment);
const CustomEventComponent = ({ event }, url_asset_root) => {
    let customer_info = event.order.customer_info

    return (
        <React.Fragment>
            <div className='p-2 d-flex justify-content-center'>
                <div className='avatar-customer-order'>
                    <img src={(customer_info && customer_info.image) ? url_asset_root + customer_info.image : url_asset_root + 'backup.png'} className='avt' />
                </div>
                <div className="ml-2">
                    <div className='name-customer'>{customer_info ? customer_info.name_id : null}</div>
                    <div className='name-customer-order1'>
                        <div className='email-customer-order'>{customer_info ? customer_info.email : null}</div>
                        <div className='phone-customer-order'>{customer_info ? customer_info.phone : null}</div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
};

class CalendarOrder extends Component {
    formRef = React.createRef();
    state = {
        visible: false,
        focusedEvent: null,
        uid: "",
        currentMonth: moment().month() + 1,
        currentYear: moment().year(),
        isOpenCreateModal: false,
        isOpenUpdateModal: false,
        isOpenRemoveModal: false,
        selectedDays: [],
        currentRate: {
            selectedDays: [],
            startdate: moment()
        },
        removeConditionals: {
            selectedDays: [],
        },
        filter: {
            sort: {
                type: "desc",
                attr: "",
            },
            paging: {
                perpage: 15,
                page: 1,
            },
            search: "",
        },
        property_id: null,
        loading: true
    };

    async componentDidMount() {
        try {
            var res = await this.props._getAll(this.state.filter);
            if (res && res.data && res.data.list) {
                var list = res.data.list;
                if (list && list.length) {
                    await this.props.getPropertyOrders(list[0].id, this.state.currentMonth, this.state.currentYear);
                    this.setState({
                        ...this.state,
                        property_id: list[0].id,
                        loading: false
                    });
                }
                else this.setState({
                    ...this.state,
                    loading: false
                });
            }
        } catch (error) {
            this.setState({
                ...this.state,
                loading: false
            });
        }


    }

    onClickEvent(event) {

        this.setState({
            visible: true,
            focusedEvent: event.property[0]
        });
    }

    onChangeDate(date) {
        let nextMonth = moment(date).month() + 1;
        let nextYear = moment(date).year();

        if (nextMonth != this.state.currentMonth || nextYear != this.state.currentyear) {
            this.setState({
                currentMonth: nextMonth,
                currentYear: nextYear
            }, () => {
                this.props.getPropertyOrders(
                    this.state.property_id, this.state.currentMonth, this.state.currentYear
                );
            });
        }
    }

    selectDates(dates) {
        this.setState({
            isOpenCreateModal: true,
            currentRate: {
                selectedDays: [],
                startdate: moment(dates[0]),
                enddate: moment(dates[dates.length - 1])
            }
        });
    }

    onChangeMonth(value) {
        let a = this;
        var form = this.formRef.current;

        this.setState({
            currentRate: {
                ...this.state.currentRate,
                enddate: moment(this.state.currentRate.startdate).add(value, "months")
            }
        }, () => {
            form.setFieldsValue({ enddate: a.state.currentRate.enddate })

        });
    }

    handleSelectProperty = async (v, opition) => {
        this.setState({
            ...this.state,
            property_id: v,
            loading: true
        });
        await this.props.getPropertyOrders(v, this.state.currentMonth, this.state.currentYear);
        this.setState({
            ...this.state,
            loading: false
        })
    }

    render() {
        var { rates, nodata, list, config } = this.props;
        var { property_id } = this.state;

        var listProperty = list && list.length ? list.map((item) => {
            return {
                id: item.id,
                title: item.title,
            };
        }) : [];

        var events = rates.map(rate => {
            return {
                start: new Date(rate.date),
                end: new Date(rate.date),
                ...rate
            };
        });

        var months = [];
        for (let i = 1; i <= 24; i++) {
            months.push({ id: i, title: i });
        }

        return (
            <div>
                <LayoutContent>
                    <PageTitle
                        title={<IntlMessages id="global.calendar" />}

                    />
                    {
                        nodata ?
                            <Empty /> :
                            <React.Fragment>
                                {
                                    list && list.length ?
                                        <div>
                                            <div className="title-select-property">
                                                * Chọn một căn hộ để xem chi tiết các đơn hàng
                        </div>
                                            <div >
                                                <BaseSelect
                                                    options={listProperty}
                                                    placeholder="Chọn một căn hộ"
                                                    showSearch={true}
                                                    onChange={this.handleSelectProperty}
                                                    value={this.state.property_id}
                                                />
                                            </div>
                                        </div>
                                        : null
                                }
                                <div className="mt-4"></div>
                                <Spin spinning={this.state.loading}>
                                    <div style={{ minHeight: '550px' }}>
                                        <Calendar
                                            popup
                                            events={events}
                                            localizer={localizer}
                                            defaultDate={new Date()}
                                            startAccessor="start"
                                            endAccessor="end"
                                            style={{ height: 500 }}
                                            onView={() => { }}
                                            toolbar={true}
                                            onNavigate={value => this.onChangeDate(value)}
                                            // onSelectEvent={event => this.onClickEvent(event)}
                                            components={{
                                                event: (event) => CustomEventComponent(event, this.props.config.url_asset_root)
                                            }}
                                            selectable={true}
                                            onSelectSlot={data => this.selectDates(data.slots)}

                                        />
                                    </div>
                                </Spin>
                            </React.Fragment>
                    }
                </LayoutContent>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        rates: state.property.listOrder,
        nodata: state.property.nodata,
        detailProperty: state.property.detail,
        list: state.property.list,
        config: state.config

    };
}

function mapDispatchToProps(dispatch) {
    return {
        getPropertyOrders: (id, month, year) => dispatch(getPropertyOrder(id, month, year)),
        _getAll: (filter) => dispatch(_getAll(filter)),
    }
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(CalendarOrder)
);

