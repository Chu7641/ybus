import React, { Component } from 'react'
import { Card, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

export default class CardWithIcon extends Component {
    render() {
        var { className, link, title, description, icon, ...rest } = this.props;

        return (
            <Link to={link}>
                <Card className={`module-card`} {...rest} hoverable>
                    <div className="module-card-icon">{icon}</div>
                    <div className="d-flex justify-content-start align-items-baseline">
                        <Typography.Title level={4} >{title}</Typography.Title>
                        <span className="module-card-view-more-icon ml-2">{<RightOutlined />}</span>
                    </div>
                    <div>
                        <Typography.Text type="secondary">{description}</Typography.Text>
                    </div>
                </Card>
            </Link>
        )
    }
}
