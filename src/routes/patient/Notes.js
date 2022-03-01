import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
// import { getAllNote } from '../../redux/actions/NoteAction';
import IntlMessages from "../../components/IntlMessage";
import { Button, Card, Form, Table, Tag, Modal, Switch, Collapse, Row, Col, Space, Input, Divider, message } from 'antd';
import { WechatOutlined, DeleteOutlined, ClockCircleFilled, ClockCircleOutlined, EditOutlined } from '@ant-design/icons';
import moment from "moment";
import { useParams } from 'react-router-dom';
import noteApi from '../../api/note';
import NoteForm from './NoteForm';
// import ActionBar from '../../components/ActionBar';
import { useForm } from 'antd/lib/form/Form';
import { useIntl } from 'react-intl';
import Item from 'antd/lib/list/Item';

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

Notes.propTypes = {
    items: PropTypes.array
};
Notes.defaultProps = {
    items: []
};


export default function Notes(props) {
    const intl = useIntl();
    const isMount = useRef(false);
    const { patient_id } = props;
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(true);
    const { id } = useParams();
    const [filter, setFilter] = useState({
        page: 1,
        limit: 10,
        keyword: "",
        //  order_by: 'id',
        order_dir: 'DESC',
        filter_value: [id],
        filter_name: ['patient_id']
    });
    const [form] = useForm();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            let res = await noteApi.getAllNote(filter);
            console.log(res);
            setItems(res.data);
            //console.log(items);
            setLoading(false);
        }
        fetchData();
    }, [filter, reload])
    const { Panel } = Collapse;
    const getOrder = (order) => {
        if (order === "ascend") return "ASC";
        if (order === "descend") return "DESC";
        return "DESC";
    }
    const onReload = () => {
        setReload(!reload)
    }
    const onSubmit = () => {
        form.validateFields().then(async () => {
            setLoading(true);
            let value = form.getFieldValue();
            let dataNote = {
                'patient_id': patient_id,
                'description': value.description,
            };
        //    console.log(dataNote);
            await noteApi.create(dataNote)
            setReload(!reload);
            setLoading(false);
            form.resetFields();
            message.success({ content: intl.formatMessage({ id: "global.save_success" }) });
        })
    }
    const placeholder = intl.formatMessage({ id: "global.note_placeholder" })
    //console.log(items)
    return (
        <div style={{ overflowY: 'auto', height: 650 }}>
            <Row justify="space-between">
                <div className="site-card-border-less-wrapper" style={{ backgroundColor: '#fafafa', width: '100%', }}>
                    <div
                        style={{ backgroundColor: 'white', width: '95%', padding: 0.5, margin: '10px auto', borderRadius: '5px', boxShadow: '0px 1px 5px 0px #e6e6e6 ' }}
                    >
                        <Form
                            style={{ margin: '20px' }}
                            form={form}
                            {...layout}
                            onFinish={onSubmit}
                        >
                            <Form.Item

                                label={<IntlMessages id="global.note" />}
                                name="description"
                                rules={[{ required: true, message: <IntlMessages id="global.requiredfield" /> }]}
                            >
                                <Input bordered={false} placeholder={placeholder} autoComplete='off' style={{ display: 'inline-block', width: "100%", }} />
                            </Form.Item>
                            <Form.Item
                            >
                                <Button loading={loading} style={{ float: 'right' }} type="primary" htmlType="submit">
                                    {<IntlMessages id="global.save" />}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Row>
            <Row>
                <div style={{ minWidth: '100%', }}>
                    {items.map(item => {
                        return <NoteForm key={item.id} item={item} onReload={onReload} loading={loading} />
                    })}</div>

            </Row>
        </div>
    )
}
