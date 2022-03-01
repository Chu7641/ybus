import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import format from "date-fns/format";
import IntlMessages from "../../components/IntlMessage";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import roomrateApi from "../../api/roomrate";
import moment from "moment";
import UpdateRoomratetForm from "./UpdateRoomrateForm";
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
UpdateRoomrate.propTypes = {};

function UpdateRoomrate(props) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(1);
  const [item, setItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(true);
  const [modal, setModal] = useState(false);
  const date = new Date();
  // console.log(date.getFullYear());
  // console.log(date.getMonth() + 1);
  const [filter, setFilter] = useState({
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  });
  const bigTitle = (price, bus, start, end) => {
    // console.log(start.slice(0,-3));
    return (
      <>
        <div className="roomrate-item">
          <p>{price} CFA </p>
          <p>
            {start.slice(0, -3)} - {end.slice(0, -3)}
          </p>
        </div>
      </>
    );
  };
  console.log(props.match.params.id);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      //   console.log(filter);
      let result = await roomrateApi.getData(filter, props.match.params.id);
      console.log(result.data);
      let items = result.data;
      // console.log(moment(items[0].start).format('MM,DD,YYYY'));
      items = items.map((item) => {
        let start = moment(item.date + " " + item.start_time);
        let end = moment(item.date + " " + item.end_time);
        return {
          adult: item.adult,
          bus_id: item.bus_id,
          id: item.id,
          title: bigTitle(
            item.adult,
            item.bus_id,
            item.start_time,
            item.end_time
          ),
          start: new Date(start.format()),
          end: new Date(end.format()),
          allDay: false,
        };
      });
      // console.log('items', items);
      setItems(items);
      setLoading(false);
      setDeleting(false);
    }
    fetchData();
  }, [filter, deleting, reload]);
  // const myEventsList = [
  //   {
  //     title: "string",
  //     start: new Date('6-11-2021'),
  //     end: new Date(),
  //     allDay: false
  //   },
  //   {
  //     allDay: false,
  //     start: new Date('December 01, 2017 11:13:00'),
  //     end: new Date('December 09, 2017 15:13:00'),
  //     title: 'All Day Event',
  //   },
  // ];
  // console.log(myEventsList);
  const onReload = () => {
    setReload((reload) => !reload);
  };

  const onOpenModal = (record = null) => {
    setModal(true);
    setItem(record);
  };
  const onCloseModal = () => {
    setModal(false);
  };
  const handleSelect = (events) => {
    setModal(true);
    // console.log(events);
    setItem(events);
  };
  const onChangeDate = (date) => {
    let month = moment(date).format("MM");
    let year = moment(date).format("YYYY");
    setFilter({
      month: month,
      year: year,
    });
  };
  return (
    <div>
      <Calendar
        localizer={localizer}
        events={items}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={(event) => handleSelect(event)}
        onNavigate={(date) => onChangeDate(date)}
      />
      {modal ? (
        <UpdateRoomratetForm
          open={modal}
          onClose={onCloseModal}
          currentData={item}
          onReload={onReload}
        />
      ) : null}
    </div>
  );
}

export default UpdateRoomrate;
