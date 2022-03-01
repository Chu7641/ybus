import React, { Component, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import clinicApi from '../../api/clinic';
import { Button, Card, Col, Form, Input, Menu, Row, Select, Tag, Typography, message, List } from 'antd';
import { getDetailClinic } from "../../redux/actions/ClinicAction";

const { Text, Link } = Typography;



export default function ClinicSwitcher() {



    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)

    const authUser = useSelector(state => state.auth.authUser);
    // const [item]
    const [item, setItem] = useState(authUser);
    const clinic = useSelector(state => state.clinic.clinic);
    const dispatch = useDispatch();

    useEffect(() => {

        async function fetchData() {
            setLoading(true);

            if (authUser && authUser.clinic_id) {
                //console.log("call");
                let clinic = await dispatch(getDetailClinic(authUser.clinic_id));

                setItem(clinic);
                setLoading(false);
            }
        }
        fetchData();

    }, [])

    useEffect(() => {
        setItem(clinic);
    }, [clinic]);



    return (
        <React.Fragment>
            <Row>
                <h2>
                    <Text style={{ color: "#FFFFFF", fontSize: "32px" }} > {item ? item.name : ""}</Text>
                </h2>
            </Row>
        </React.Fragment >


    );
}


