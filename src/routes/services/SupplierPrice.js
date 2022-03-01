import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Tag, Typography, Form, Input, Row, Col, Button, Select, InputNumber } from 'antd';
import React from 'react';
import IntlMessages from "../../components/IntlMessage";
const { Option } = Select;


const SupplierPrice = (props) => {

    var { suppliers } = props;

    // label={<IntlMessages id={`global.field_${field.name}`} />} 
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    const rules = [{
        required: true,
        message: <IntlMessages id="global.requiredfield" />
    }];


    return (
        <Form.List name="suppliers" {...layout} layout="horizontal">



            {(fields, { add, remove }) => {

                return (

                    <>
                        {fields.map((field, index) => (

                            <Row gutter={12} key={index + 1000}>
                                <Col span={12}>
                                    <Form.Item rules={rules} key={1} label={<IntlMessages id="global.supplier" />} name={[field.name, "supplier_id"]} fieldKey={[field.fieldKey, "supplier_id"]} >

                                        <Select
                                            placeholder={<IntlMessages id="global.select_supplier" />}
                                            showSearch={true}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }



                                        >
                                            {suppliers.map(item => {

                                                return <Option value={item.id} key={item.id}>{item.name}</Option>
                                            })
                                            }


                                        </Select>

                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item rules={rules} key={2} label={<IntlMessages id="global.price" />} name={[field.name, "price"]} fieldKey={[field.fieldKey, "price"]} >
                                        {/* {console.log(fields)} */}
                                        <InputNumber formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} style={{ width: "100%" }}></InputNumber>

                                    </Form.Item>
                                </Col>
                                <Col flex="none" span={4}>

                                    <MinusCircleOutlined
                                        className="dynamic-delete-button"
                                        style={{ margin: "0 8px", fontSize: 18 }}
                                        onClick={() => {
                                            remove(field.name);
                                        }}
                                    />

                                </Col>

                            </Row>

                        )
                        )}
                        <Row >
                            <Col span={24}>
                                <Form.Item wrapperCol={24} key={4}>
                                    <Button
                                        type="dashed"
                                        onClick={() => {
                                            add();
                                        }}
                                        style={{ width: "100%" }}
                                    >
                                        <PlusOutlined /><IntlMessages id="global.add_supplier" />
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                )


            }
            }
        </Form.List >
    )
}




export default SupplierPrice;