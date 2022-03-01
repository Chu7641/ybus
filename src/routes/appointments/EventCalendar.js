import { Empty, message, Spin } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-day-picker/lib/style.css";
import LayoutContent from "../../components/LayoutContent";
import appointmentApi from '../../api/appointment';
import 'moment/locale/vi';



moment.locale("vi");
// BigCalendar.momentLocalizer(moment);
const localizer = momentLocalizer(moment);

export default function EventCalendar() {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [month, setmonth] = useState();
    const [year, setyear] = useState();

    const messages = {
        agenda: 'Lịch',
        allDay: 'Cả ngày',
        month: 'Tháng',
        day: 'Ngày',
        today: 'Hôm nay',
        previous: 'Trước',
        next: 'Sau',
        date: 'Ngày',
        noEventsInRange: 'Không có lịch nào',
        time: 'Giờ',
        tomorrow: 'Ngày mai',
        week: 'Tuần',
        work_week: 'Werkweek',
        yesterday: 'Hôm qua'
    }


    // state = {
    //     visible: false,
    //     focusedEvent: null,
    //     uid: "",
    //     currentMonth: moment().month() + 1,
    //     currentYear: moment().year(),
    //     isOpenCreateModal: false,
    //     isOpenUpdateModal: false,
    //     isOpenRemoveModal: false,
    //     selectedDays: [],
    //     currentRate: {
    //         selectedDays: [],
    //         startdate: moment()
    //     },
    //     removeConditionals: {
    //         selectedDays: [],
    //     },
    //     filter: {
    //         sort: {
    //             type: "desc",
    //             attr: "",
    //         },
    //         paging: {
    //             perpage: 15,
    //             page: 1,
    //         },
    //         search: "",
    //     },
    //     property_id: null,
    //     loading: true
    // };

    const [filter, setFilter] = useState({
        page: 1,
        limit: 10,
        keyword: "",
        order_by: 'id',
        order_dir: 'DESC',


    });

    useEffect(() => {

        async function fetchData() {
            setLoading(true);
            let result = await appointmentApi.getAll(filter);
            let events = result.data;
            events = events.map(item => {
                return {
                    start: new Date(item.scheduled_date),
                    end: new Date(item.end_date),
                    title: `${item.patient_firstname} ${item.patient_mobile}`,
                    ...item
                }
            });

            console.log('events', events);
            setItems(events);
            setLoading(false);

        }
        fetchData();

    }, []);


    const onChangeDate = async (date) => {
        let nextMonth = moment(date).month() + 1;
        let nextYear = moment(date).year();

        if (nextMonth != month || nextYear != year) {
            setmonth(nextMonth);
            setyear(nextYear);

            let result = await appointmentApi.getAll(filter);
            let events = result.data;
            events = events.map(item => {
                return {
                    start: new Date(item.scheduled_date),
                    end: new Date(item.end_date),
                    title: `${item.patient_firstname} ${item.patient_mobile}`,
                    ...item
                }
            });
            setItems(events);

        }
    }

    var months = [];
    for (let i = 1; i <= 24; i++) {
        months.push({ id: i, title: i });
    }

    return (


        <React.Fragment>


            {loading ? <Spin /> :

                <Calendar

                    events={items}
                    localizer={localizer}
                    defaultDate={new Date()}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, width: "100%" }}
                    defaultView={Views.WEEK}
                    culture={'vi'}
                    timeslots={3}
                    scrollToTime={new Date()}

                    toolbar={true}
                    onNavigate={value => onChangeDate(value)}
                    // onSelectEvent={event => this.onClickEvent(event)}
                    // components={{
                    //     event: (event) => CustomEventComponent(event, this.props.config.url_asset_root)
                    // }}
                    selectable={true}
                    messages={messages}
                // onSelectSlot={data => this.selectDates(data.slots)}

                />

            }
        </React.Fragment>


    );
}

// function mapStateToProps(state) {
//     return {
//         rates: state.property.listOrder,
//         nodata: state.property.nodata,
//         detailProperty: state.property.detail,
//         list: state.property.list,
//         config: state.config

//     };
// }

// function mapDispatchToProps(dispatch) {
//     return {
//         getPropertyOrders: (id, month, year) => dispatch(getPropertyOrder(id, month, year)),
//         _getAll: (filter) => dispatch(_getAll(filter)),
//     }
// }

// export default withRouter(
//     connect(mapStateToProps, mapDispatchToProps)(CalendarOrder)
// );

