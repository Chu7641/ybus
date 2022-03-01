import PropTypes from 'prop-types';
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { Component, useState, useEffect } from "react";
import DocumentApi from '../../api/document';
import { identity } from 'lodash-es';
import { getCookie } from '../../utils/cookie';
import doctorApi from '../../api/doctor';
import documentApi from '../../api/document';

Documents.propTypes = {
    items: PropTypes.array
};
Documents.defaultProps = {
    items: []


};
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
function Documents(props) {
    const [loading, setLoading] = useState();
    const { patient_id } = props;
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [reload, setReload] = useState(false);
    const [filter, setFilter] = useState({
        page: 1,
        limit: 100,
        keyword: "",
        order_by: 'id',
        order_dir: 'ASC',
        filter_value: [patient_id],
        filter_name: ['patient_id']
    });
    const action = 'https://api.smilepos.me/document/' + patient_id;
    const userToken = getCookie('token');
    const [fileList, setFileList] = useState([])
    const handleCancel = () => setPreviewVisible(false);
    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    }
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    const handleChange = ({ file, fileList, event }) => {
        setFileList(fileList)
        if (file.status == "done") {
            fetchData();
        }
    }
    const fileRemove = async (file) => {
        console.log("file ", file.id);
        await documentApi.delete(file.id);
        setReload(!reload);
        console.log(fileList);
    }
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            let result = await DocumentApi.getAll(filter);
            console.log('document: ', result.data);
            var items = result.data.map((item, index) => {
                return { ...item, uid: item.id, name: item.name, url: item.path }
            }
            )
            console.log(items);
            setFileList(items);
            setLoading(false);
        }
        fetchData();
    }, [])

    const fetchData = async () => {
        setLoading(true);
        let result = await DocumentApi.getAll(filter);
        console.log('document: ', result.data);
        var items = result.data.map((item, index) => {
            return { ...item, uid: item.id, name: item.name, url: item.path }

        }
        )
        console.log(items);
        setFileList(items);
        setLoading(false);

    }


    return (
        <>
            <Upload
                action={action}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                headers={{
                    'Authorization': "Bearer " + userToken
                }}
                onRemove={fileRemove}
                
            >
                {uploadButton}
            </Upload>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
}

export default Documents;