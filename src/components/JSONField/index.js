import { Tag, Typography, Form, Input, Row, Col } from 'antd';
import React from 'react';
import IntlMessages from "../../components/IntlMessage";


const JSONField = (props) => {

    var { json } = props;

    // label={<IntlMessages id={`global.field_${field.name}`} />} 
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    return (
        <Form.List name="healthindex" {...layout} layout="horizontal">


            {

                fields => (

                    <>
                        {fields.map((field, index) => (

                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item key={1} label={<IntlMessages id="global.field_bloodpressure" />} name={[field.name, "bloodpressure"]} fieldKey={[field.fieldKey, "bloodpressure"]} >
                                        {/* {console.log(fields)} */}
                                        <Input></Input>

                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item key={2} label={<IntlMessages id="global.field_bpm" />} name={[field.name, "bpm"]} fieldKey={[field.fieldKey, "bpm"]} >
                                        {/* {console.log(fields)} */}
                                        <Input></Input>

                                    </Form.Item>
                                </Col>
                                <Col span={12}>

                                    <Form.Item key={3} label={<IntlMessages id="global.field_spo2" />} name={[field.name, "spo2"]} fieldKey={[field.fieldKey, "spo2"]} >
                                        {/* {console.log(fields)} */}
                                        <Input></Input>

                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item key={4} label={<IntlMessages id="global.field_weight" />} name={[field.name, "weight"]} fieldKey={[field.fieldKey, "weight"]} >
                                        {/* {console.log(fields)} */}
                                        <Input></Input>

                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item key={5} label={<IntlMessages id="global.field_height" />} name={[field.name, "height"]} fieldKey={[field.fieldKey, "height"]} >
                                        {/* {console.log(fields)} */}
                                        <Input></Input>

                                    </Form.Item>
                                </Col>
                            </Row>

                        )
                        )}
                    </>

                )
            }
        </Form.List>
    )
}




export default JSONField;