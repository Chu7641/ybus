import { Select } from 'antd';
import React from 'react';
import IntlMessages from "../IntlMessage";
const { Option } = Select;

const PaymentMethod = () => {
    return (
        <Select style={{ width: '100%' }}>
            <Option value="cash"><IntlMessages id="global.cash" /></Option>
            <Option value="card"><IntlMessages id="global.card" /></Option>
            <Option value="bank"><IntlMessages id="global.bank" /></Option>
            <Option value="insurance"><IntlMessages id="global.insurance" /></Option>
        </Select>
    );
};

export default PaymentMethod;