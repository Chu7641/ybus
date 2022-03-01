import { Typography } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
const { Text } = Typography;

const Currency = (props) => {

    const { value } = props;
    const user = useSelector(state => state.auth.authUser);
    let currency = 'USD';
    let local = 'en-US';

    if (user.currency)
        currency = user.currency;

    if (user.language)
        local = user.language;

    return (
        <Text>
            {new Intl.NumberFormat(local, { style: 'currency', currency: currency }).format(value)}
        </Text>
    );
};

export default Currency;