import React, { Component } from 'react';
import axios from 'axios';
import config from '../../config';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import {
    Form,
    Input,
    Row,
    Col,
    Button,
    Modal,
    Upload,
    Spin
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { object, string } from 'prop-types';

const { URL_ASSET, API_URL, URL_S3_ASSET } = config;

class UploadFile extends Component {
    constructor(props) {
        super(props)
        this.handleUpload = debounce(this.handleUpload, 300);
        this.state = {
            previewVisible: false,
            previewImage: "",
            fileList: [],
            value: [],
            defaultValue: [],
            loading: false,
            previewTitle: ""
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.defaultValue && props.defaultValue.length !== state.defaultValue.length) {
            return {
                defaultValue: props.defaultValue,
                fileList: props.defaultValue.length ? props.defaultValue.map((item, index) => {
                    return {
                        key: `${index}`,
                        uid: `${index}`,
                        name: `${index}`,
                        status: "done",
                        url: `${props.config.url_asset_root}${item}`
                    }
                }) : [],
                value: [...props.defaultValue]
            }
        }

        return null
    }

    static defaultProps = {
        width: "50%",
        style: {
            right: 0
        },
        zIndex: 1000,
        onChange: () => { },
        limit: 1,
        defaultValue: [],
        ismulti: false,
        limit: 1
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = file => {
     
        let newfile =  file.url.replace(`${this.props.config.url_asset_root}/supplier/`, '')
        this.setState({
            previewImage: file.url,
            previewVisible: true,
            previewTitle: newfile
        });
    }

    setData(list) {
        let listData = [];
        if (list.length) {
            for (let i = 0; i < list.length; i++) {
                let data = list[i].originFileObj ? list[i].originFileObj : null;
                if (data) {
                    listData.push(
                        data
                    )
                }
            }
        }

        return listData;
    }

    handleUpload = async ({ fileList }) => {
        let data = await this.setData(fileList)

        let formD = new FormData();
        if (data.length) {
            data.forEach(item => {
                if (item) formD.append("file[]", item)
            })
        }
        formD.append("folder", '/supplier');

        this.setState({
            ...this.state,
            loading: true
        })

        axios.post(API_URL + "/media/uploadFile", formD).then(res => {
            let data = res.data.data;

            this.props.onChange([...this.state.value, ...data])

            let newData = data.map((item, index) => {
                return {
                    key: `${item}`,
                    uid: `${index}`,
                    name: `${index}`,
                    status: "done",
                    url: `${this.props.config.url_asset_root}${item}`
                }
            });
            this.setState({
                ...this.state,
                fileList: [...this.state.fileList, ...newData],
                value: [...this.state.value, ...data],
                loading: false
            }
            )

        }).catch(err => {
            console.log("err", err);
        });
    }

    handleRemove = file => {
        return new Promise((resolve, reject) => {
            let a = this;

            let newfile =   file.url.replace(this.props.config.url_asset_root, '')
            let newvalue = a.state.value.filter(item => item.toString() !== newfile.toString())
console.log('newfile',newfile);
console.log('newvalue',newvalue);
            let fileList = a.state.fileList;

            let fileRemove = fileList.filter(item => item !== file)

            this.setState(
                {
                    ...this.state,
                    fileList: [...fileRemove],
                    value: newvalue
                }, () => a.props.onChange(newvalue)
            )
        })
    }

    render() {
        const { previewVisible, previewImage, fileList, value, previewTitle } = this.state;
        let openFileDialogOnClick = !this.props.ismulti && fileList.length ? false : true;

        return (
            <React.Fragment >
                {
                    this.state.loading ? (
                        <Spin tip="Uploading..." />
                    ) : (
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={this.handlePreview}
                                onChange={this.handleUpload}
                                onRemove={this.handleRemove}
                                beforeUpload={() => false}
                                multiple={this.props.ismulti}
                                beforeUpload={() => false}
                                accept="image/*"
                                openFileDialogOnClick={openFileDialogOnClick}
                            >
                                {
                                    fileList.length && fileList.length >= this.props.limit ? null : (
                                        <div>
                                            <UploadOutlined />
                                            <div className="ant-upload-text"> Upload</div>
                                        </div>
                                    )
                                }
                            </Upload>
                        )
                }

                <Modal
                    visible={previewVisible}
                    footer={null}
                    closable={true}
                    title={previewTitle}
                    onCancel={this.handleCancel}
                >
                    <img style={{ width: "100%" }} src={previewImage} />
                </Modal>
            </React.Fragment>
        )
    }
}


function mapStateToProps(state) {
    return {
        config: state.config
    }
}



export default withRouter(connect(mapStateToProps, null)(UploadFile));