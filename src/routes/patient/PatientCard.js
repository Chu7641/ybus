import React, { useEffect, useRef, useState } from 'react';
import { Card, Tag, Typography, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import UploadAvatar from '../../components/UploadAvatar';
import PhoneFormatter from '../../components/PhoneFormatted';
const { Title } = Typography;


export default function PatientCard() {
    const isMount = useRef(false)

    const patient = useSelector(state => state.patient.patient);


    useEffect(() => {
        isMount.current = true;


        return () => {
            isMount.current = false
        }
    }, [])

    return (


        <Card hoverable>
            <Row justify="center" gutter={[16, 16]} align="middle">
                <Col>
                    <UploadAvatar />
                </Col>
                <Col>
                    <Title level={3} className="your-name">{patient.fullname}</Title>
                    <PhoneFormatter phone={patient.mobile || ""}>{patient.mobile}</PhoneFormatter>
                </Col>
            </Row>

        </Card>


    )
}
