import React, { Component } from 'react';
import { Tag, Icon } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// action

import { CheckSquareTwoTone, CloseSquareTwoTone } from '@ant-design/icons';
import { changeStatus} from '../../redux/actions/CommonActions';


/**
 * Button change status when click
 */
class StatusButton extends Component {
    state = {
        status: 0
    }

    static propTypes = {
        /** ID of object need to update */
        data_id: PropTypes.number.isRequired,
        /** Table name */
        table: PropTypes.string.isRequired,
        /** Initial status of object */
        // status: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.setState({
            status: this.props.status
        })
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.status != this.state.status) {
            this.setState({
                status: nextProps.status
            })
        }
    }

    click() {
        let newStatus = !this.state.status;

        this.props.changeStatus({
            id: this.props.data_id,
            table: this.props.table,
            status: newStatus
        }).then(() => {
            this.setState({
                status: newStatus
            });
        })
    }

    render() {
      

        return (
            <div onClick={() => this.click()}>
                {
                    this.state.status ? 
                    <CheckSquareTwoTone  twoToneColor='#52c41a'  />:
                    <CloseSquareTwoTone twoToneColor="#52c41a"/>
                }
               
               
            </div>
        )
    }
}

StatusButton.defaultProps = {
    status: 0,
}

function mapDispatchToProps(dispatch) {
    return {
        changeStatus: (data) => dispatch(changeStatus(data))
    }
}

export default connect(null, mapDispatchToProps)(StatusButton);