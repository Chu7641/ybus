import React from 'react';
import { connect } from 'react-redux';
import config from '../../config';
import { updateAvatar } from "../../redux/actions/AuthActions";
import { CameraOutlined, UserOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Avatar } from 'antd';


const { URL_ASSET, URL_S3_ASSET } = config;




class UploadAvatar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgSrc: null,
            loading: false
        }
    }

    handleImageUpdate = async (event) => {
        var file = event.target.files[0];

        let formD = new FormData();
        formD.append("file", file)
        this.setState({
            loading: true
        })
        await this.props.updateUserInformation(formD).then(res =>
            this.setState({
                loading: false,
                imgSrc: res.data
            }))
    }

    render() {
        var user = this.props.user ? this.props.user : {};
        console.log('user', user)
        return (
            <React.Fragment>
                {this.state.loading ?
                    <div className="container-avatar">
                        <img src={this.state.imgSrc ? URL_ASSET + this.state.imgSrc : (user.image ? this.props.config.url_asset_root + user.image : URL_ASSET + "/backup.png")} alt="Avatar" className="image-avatar-loading" />
                        <div className="middle-avatar-loading">
                            <div className="text-avatar">
                                <Spin />
                            </div>
                        </div>
                    </div>
                    :

                    <div className="container-avatar">
                        {this.state.imgSrc ?
                            <Avatar src={URL_ASSET + this.state.imgSrc} /> : <Avatar size={64} icon={<UserOutlined />} />

                        }
                        <div className="middle-avatar">
                            <div className="text-avatar">
                                <label htmlFor="upload-btn-avatar" style={{ cursor: "pointer" }}><CameraOutlined /></label>
                                <input
                                    type="file"
                                    id="upload-btn-avatar"
                                    accept="image/*"
                                    name="avatar"
                                    className="d-none"
                                    onChange={this.handleImageUpdate}
                                />
                            </div>
                        </div>
                    </div>
                }
            </React.Fragment>


        );
    }
}


function mapStateToProps(state) {
    return {
        user: state.auth.authUser,
        config: state.config
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateUserInformation: (data) => dispatch(updateAvatar(data)),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)((UploadAvatar));