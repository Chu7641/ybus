import React from 'react';
import PropTypes from 'prop-types';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
const locales = {
  'en-US': require('date-fns/locale/en-US'),
}
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})
CreateRoomrate.propTypes = {
    
};

function CreateRoomrate(props) {
    console.log(props);
    const myEventsList = [
        {
            allDay: [0,1,2,3],
          start: new Date('5, 1, 2021 9:13:00'),
          end: new Date('6, 20, 2021 11:13:00'),
          title: 'hi',
        },
        {
          allDay: false,
          start: new Date('December 01, 2017 11:13:00'),
          end: new Date('December 09, 2017 15:13:00'),
          title: 'All Day Event',
        },
      ];
    return (
        <div>
        <Calendar
          localizer={localizer}
          events={myEventsList}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>
    );
}

export default CreateRoomrate;