import { Tag, Typography } from 'antd';
import React from 'react';
import status from '../../utils/status';
import IntlMessages from "../../components/IntlMessage";

const AppointmentStatus = (props) => {

    var { value } = props;
    value = value ? value : 'confirmed';
    var color = status.appointmentStatus[value];



    return <Tag color={color}> <IntlMessages id={`appointment.status_${value}`} /></Tag>

};

export default AppointmentStatus;