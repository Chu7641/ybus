import { Select, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import IntlMessages from "../IntlMessage";
import serviceApi from '../../api/service';
const { Option } = Select;

const ServiceGroup = (props) => {


    const [items, setItems] = useState([])
    const isMount = useRef(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        //isMount.current = true;

        async function fecthData() {
            if (isMount) {
                let result = await serviceApi.getGroup();

                let items = result;
                setItems(items);
                setLoading(false);

            }
        }
        fecthData();
        return () => {
            isMount.current = false
        }

    }, []);

    return (
        <>
            {
                loading ? <Spin /> :
                    < Select style={{ width: '100%' }
                    } loading={loading}
                        placeholder={<IntlMessages id="global.select_category" />}
                        {...props}
                    >

                        {
                            Object.keys(items).map((item, index) => {

                                let key = "group." + items[item];
                                return <Option value={items[item]} key={index}>{<IntlMessages id={key} />}  </Option>

                            })
                        }

                    </Select >
            }
        </>
    );
};

export default ServiceGroup;