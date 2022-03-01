import { Typography } from 'antd';
import React from 'react';
import IntlMessages from "../IntlMessage";
const { Text } = Typography;

const Gender = (props) => {

    const { gender } = props;
    return (
        gender == 1 ? <Text><IntlMessages id="global.male" /> </Text> : <Text><IntlMessages id="global.female" /> </Text>
    );
}

export default Gender;