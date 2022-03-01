import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Collapse, Form, Card, Input, DatePicker, Radio, Button, Row, Col, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import IntlMessages from "../../components/IntlMessage";
import noteApi from '../../api/note';
import moment from "moment";
import { ClockCircleOutlined, RightOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';



NoteForm.propTypes = {

};


function NoteForm(props) {
    const { item, onReload } = props;
    const [hideButtonEdit, setHideButonEdit] = useState(true);
    const [hideButtonDelete, setHideButonDelete] = useState(true);
    const [loading, setLoading] = useState(false);
    const { Panel } = Collapse;
    //console.log(valueInput);
    const [valueInput, setValueInput] = useState(item.description);
    const intl = useIntl();
    //console.log(patient_id);
    const [initialValues, setInitialValues] = useState({
        description: item.description,
    })

    useEffect(() => {
        setValueInput(item.description)
    }, [item])

    const handleClickInput = () => {
        setHideButonDelete(true);
        setHideButonEdit(false);
    }
    const handleBlurInput = () => {
        //  setHideButon(true);
    }
    const handleDeleteNote = async (id) => {
        Modal.confirm({
            title: intl.formatMessage({ id: 'global.delete_confirm' }),
            okText: intl.formatMessage({ id: 'global.yes' }),

            onOk: async () => {
                console.log(id);
                setLoading(true);
                console.log('delete' + id);
                await noteApi.delete(id);
                setLoading(false);
                message.success({ content: intl.formatMessage({ id: "global.deleted_success" }) });
                onReload();
            },
            onCancel() { },
        })
    }
    const handleEdit = async (id) => {
        setLoading(true)
        //  let value=form.getFieldValue();
        // console.log(value);
        await noteApi.update(id, { description: valueInput });
        setHideButonEdit(true);
        onReload();
        // setInitialValues({description: item.description,})
        setLoading(false);
    }
    const showDelete = () => {
        setHideButonDelete(!hideButtonEdit);
    }
    const hideDelete = () => {
        setHideButonDelete(true);
    }
    let date = moment(item.created_at).format(' MMMM YYYY');
    let dateExtraTitle = moment(item.created_at).format('Do MMMM YYYY, h:mm Z z')
    return (
        <>
            <Row style={{ backgroundColor: '#fafafa', minWidth: '100%', paddingBottom: '1.5em' }}>
                <h3 style={{ marginLeft: '21px', color: '#999999' }}><ClockCircleOutlined />{date}</h3>
                <div style={{ background: 'white', borderRadius: '5px', margin: '5px auto', padding: '10px 0px 0px 12px', width: '95%', minHeight: '130px', boxShadow: '0px 1px 5px 0px #e6e6e6 ' }}>
                    <div style={{ height: '20%' }}>
                        <p style={{ display: 'inline-block' }}><RightOutlined style={{ fontSize: '8px' }} /> {<IntlMessages id="global.note_by" />} {item.patient.fullname}</p>
                        <p style={{ display: 'inline-block', float: 'right', marginRight: '20px' }}>{dateExtraTitle} </p>
                    </div>
                    <div
                        onMouseLeave={hideDelete}
                        onMouseEnter={showDelete}
                        style={{ margin: '0.5rem' }}
                    >
                        <Input
                            autoComplete='off'
                            onClick={handleClickInput}
                            onBlur={handleBlurInput}
                            onChange={(e) => setValueInput(e.target.value)}
                            style={{ display: 'inline-block', width: '88%' }}
                            value={valueInput}
                            bordered={false}
                            key={item.id}
                        />

                        <Button
                            style={{ display: 'inline-block', float: 'right', marginRight: '13px' }}
                            loading={loading}
                            hidden={hideButtonEdit}
                            onClick={() => handleEdit(item.id)}
                            type="primary"
                            htmlType="submit"
                        >
                            {<IntlMessages id="global.save" />}
                        </Button>
                        <Button
                            style={{ display: 'inline-block', float: 'right', marginRight: '13px' }}
                            loading={loading}
                            hidden={hideButtonDelete}
                            onClick={() => handleDeleteNote(item.id)}
                            type="primary" htmlType="submit"
                        >
                            {<IntlMessages id="global.delete" />}
                        </Button>
                    </div>
                </div>
            </Row>
        </>)
}
export default NoteForm;