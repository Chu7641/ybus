import React, { useEffect, useRef, useState } from 'react';
import { Modal, Form, Input, DatePicker, Button, Radio, Switch, Select, Tabs, InputNumber } from 'antd';
import { createService, updateService } from '../../redux/actions/ServiceAction';
import moment from 'moment';
import IntlMessages from "../../components/IntlMessage";
import Checkbox from 'antd/lib/checkbox/Checkbox';
import supplierApi from '../../api/supplier';
import { useIntl } from 'react-intl'
import SupplierPrice from './SupplierPrice';
import ServiceGroup from '../../components/ServiceGroup';
const { TabPane } = Tabs;
const { Option } = Select;


const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};


export default function ServiceForm(props) {
    const isMount = useRef(false)
    const { onClose, currentData, open } = props;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [suppliers, setSuppliers] = useState([])
    const intl = useIntl();
    useEffect(() => {
        //isMount.current = true;
        async function fetchData() {

            if (isMount) {
                var filter = {
                    page: 1,
                    limit: 1000,
                    keyword: "",
                    order_by: 'name',
                    order_dir: 'ASC',


                };
                setLoading(true);
                let suppliers = await supplierApi.getAll(filter);

                setSuppliers(suppliers.data);
                setLoading(false);

            }
        }
        fetchData();
        return () => {
            isMount.current = false
        }

    }, [])

    const handleSubmit = () => {
        setLoading(true);

        form.validateFields().then(values => {
            let data = { ...values };
            data.suppliers = JSON.stringify(data.suppliers);
            console.log("values", data);


            if (currentData) {
                (updateService(currentData.id, data)).
                    then(() => {
                        setLoading(false);
                        handleCancel()
                        props.onReload()
                    }).
                    catch(() => setLoading(false));
            } else {
                createService(data).
                    then(() => {
                        setLoading(false);
                        handleCancel();
                        props.onReload()
                    }).
                    catch(() => setLoading(false));
            }
        }).catch(() => setLoading(false));
    }



    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const handleCancel = () => {
        //form.resetFields();
        onClose()
    }

    let initialValue = {
        clinic_id: currentData && currentData.clinic_id ? currentData.clinic_id : "",
        unit: currentData && currentData.unit ? currentData.unit : "",
        description: currentData && currentData.description ? currentData.description : "",
        name: currentData && currentData.name ? currentData.name : "",
        price: currentData && currentData.price ? currentData.price : "",
        //supplies_price: currentData && currentData.supplies_price ? currentData.supplies_price : "",
        warranty_desc: currentData && currentData.warranty_desc ? currentData.warranty_desc : "",
        is_warrantable: currentData && currentData.is_warrantable ? currentData.is_warrantable : false,
        status: currentData && currentData.status ? currentData.status : true,
        category: currentData && currentData.category ? currentData.category : "",
        suppliers: currentData && currentData.suppliers ? JSON.parse(currentData.suppliers) : [
            { supplier_id: "", price: "" }

        ]

    }

    //console.log("initialValue", initialValue);


    return (
        <Modal
            title={currentData ? <IntlMessages id="global.edit" /> : <IntlMessages id="global.add" />}
            visible={open}
            destroyOnClose={true}
            onCancel={handleCancel}
            width="60%"
            onOk={handleSubmit}


            footer={[
                <Button key="back" type="default" onClick={handleCancel} >
                    {<IntlMessages id="global.cancel" />}
                </Button>,
                <Button key="submit" type="primary" htmlType="submit" loading={loading} onClick={handleSubmit}>
                    {<IntlMessages id="global.save" />}
                </Button>,
            ]}
        >


            <Form
                {...layout}
                form={form}
                initialValues={initialValue}
                labelAlign="left"
                onFinish={handleSubmit}
                onFinishFailed={onFinishFailed}

            >
                <Tabs defaultActiveKey="1">
                    <TabPane tab={<IntlMessages id="global.treatment" />} key="1">




                        <Form.Item label={<IntlMessages id="global.name" />} name="name" rules={[{
                            required: true,
                            message: <IntlMessages id="global.requiredfield" />
                        }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item label={<IntlMessages id="global.category" />} name="category" rules={[{
                            required: true,
                            message: <IntlMessages id="global.requiredfield" />
                        }]}>
                            <ServiceGroup>

                            </ServiceGroup>
                        </Form.Item>


                        <Form.Item label={<IntlMessages id="global.price" />} name="price" rules={[{
                            required: true,
                            message: <IntlMessages id="global.requiredfield" />
                        }]}>
                            <InputNumber formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} style={{ width: "100%" }} />
                        </Form.Item>


                        <Form.Item label={<IntlMessages id="global.supplies_price" />} name="supplies_price" rules={[{
                            required: false,
                            message: <IntlMessages id="global.requiredfield" />
                        }]}>
                            <Input />
                        </Form.Item>


                        <Form.Item label={<IntlMessages id="global.unit" />} name="unit" rules={[{
                            required: true,
                            message: <IntlMessages id="global.requiredfield" />
                        }]}>
                            <Select style={{ width: '100%' }}>
                                <Option value="item"><IntlMessages id="unit.item" /></Option>
                                <Option value="teeth"><IntlMessages id="unit.teeth" /></Option>
                                <Option value="tooth"><IntlMessages id="unit.tooth" /></Option>
                                <Option value="time"><IntlMessages id="unit.time" /></Option>
                            </Select>
                        </Form.Item>




                        <Form.Item label={<IntlMessages id="global.is_warrantable" />} name="is_warrantable" valuePropName="checked" rules={[{
                            required: false,
                        }]}>

                            <Checkbox></Checkbox>

                        </Form.Item>

                        <Form.Item label={<IntlMessages id="global.warranty" />} name="warranty_desc" rules={[{
                            required: false,
                        }]}>

                            <Input />

                        </Form.Item>

                        <Form.Item label={<IntlMessages id="global.description" />} name="description" rules={[{
                            required: false,
                        }]}>
                            <Input />
                        </Form.Item>

                        {/* <Form.Item
                            name="supplier_id" label={<IntlMessages id="global.supplier" />} rules={[{
                                required: true,
                                message: <IntlMessages id="global.requiredfield" />
                            }]}

                        >

                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                                placeholder={intl.formatMessage({ id: "global.select_supplier" })}

                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }

                            >
                                {suppliers.map((option, index) => {

                                    return (
                                        <Option
                                            key={`${option.id}_${index}`}
                                            value={option.id}
                                        >
                                            {option.name}
                                        </Option>
                                    );
                                })}
                            </Select>


                        </Form.Item> */}

                        <Form.Item label={<IntlMessages id="global.status" />} name="status" rules={[{
                            required: true,
                        }]}>
                            <Radio.Group>
                                <Radio value={false}><IntlMessages id="global.inactive" /></Radio>
                                <Radio value={true}><IntlMessages id="global.active" /></Radio>
                            </Radio.Group>
                        </Form.Item>





                    </TabPane>
                    <TabPane tab={<IntlMessages id="global.supplier" />} key="2">

                        <SupplierPrice suppliers={suppliers}></SupplierPrice>
                    </TabPane>
                </Tabs>
            </Form>

        </Modal>




    )
}
