import React from 'react';
import config from '../../../config';
const { URL_ASSET } = config.MEDIA_URL;

class AvatarConversation extends React.Component {

    render() {
        const { detailChat } = this.props;
        var { data } = this.props;
        if (detailChat) {
            if (data.length >= 2)
                return (
                    <div className="mr-20">
                        <img className="conversation-photo user-avatar-0" src={`${URL_ASSET}${data[0]}`} alt="user" />
                        <img className="conversation-photo user-avatar-3" src={`${URL_ASSET}${data[1]}`} alt="user" />
                    </div>
                )
            if (data.length == 1)
                return (
                    <img src={`${URL_ASSET}${data[0]}`} className="avatar-chat rounded-circle" alt="user profile" width="40" height="40" />
                )
            return (
                <React.Fragment></React.Fragment>
            )
        }
        else {
            if (data.length >= 2)
                return (
                    <div>
                        <img className="conversation-photo user-avatar-0" src={`${URL_ASSET}${data[0]}`} alt="user" />
                        <img className="conversation-photo user-avatar-1" src={`${URL_ASSET}${data[1]}`} alt="user" />
                    </div>
                )
            if (data.length == 1)
                return (
                    <img src={`${URL_ASSET}${data[0]}`} className="avatar-chat rounded-circle" alt="user profile" width="50" height="50" />
                )
            return (
                <React.Fragment></React.Fragment>
            )
        }
    }
}

export default AvatarConversation;

