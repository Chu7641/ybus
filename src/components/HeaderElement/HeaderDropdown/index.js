import { Dropdown } from 'antd';
import React from 'react';

const HeaderDropdown = (props) => (
    <Dropdown
        {...props}
        trigger={["click"]}
        placement="bottomRight"
    />
);

export default HeaderDropdown;
