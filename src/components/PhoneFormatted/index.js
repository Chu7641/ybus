import { Typography } from 'antd';
import React, { useState } from 'react';
const { Text } = Typography;

const PhoneFormatter = (props) => {

    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
    const { phone } = props;
    const handleInput = (value) => {
        return value.replace(phoneRegex, '$1 $2 $3')

    }

    return (
        <Text type="secondary">
            {handleInput(phone)}
        </Text>
    );
};

export default PhoneFormatter;