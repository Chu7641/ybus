import React, { Component } from "react";
import { connect } from "react-redux";

import { Button, Divider, Modal, Input, Col, Row } from "antd";

import PropTypes from "prop-types";

import { publish, unpublish } from "../../redux/actions/CommonActions";
import IntlMessages from "../IntlMessage";
import { injectIntl } from 'react-intl'
const confirm = Modal.confirm;

class ActionBar extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    textSearch: PropTypes.bool,
    onFilter: PropTypes.func,
    searchOpition: PropTypes.object,
    showFilter: PropTypes.bool,
    justify: PropTypes.oneOf(["start", "end", "center"]),
    showActionBar: PropTypes.bool
  };
  formatMessage = this.props.intl.formatMessage;

  static defaultProps = {
    data: [],
    onFilter: () => { },
    textSearch: true,
    searchOpition: {},
    isShowPublishButtons: true,
    isShowDeleteButton: true,
    isShowAddButton: true,
    isShowCopyButton: false,
    showFilter: true,
    justify: "end",
    showActionBar: true
  };

  state = {
    activeFilter: false,
    rows: 0,
    isDisabledCopyButton: true
  };

  onOpenFilter() {
    this.setState({
      activeFilter: !this.state.activeFilter
    });
  }

  onPublish() {
    this.props
      .publish({
        rows: this.props.rows,
        table: this.props.table
      })
      .then(() => {
        this.props.onRefresh();
      });
  }

  onUnpublish() {
    this.props
      .unpublish({
        rows: this.props.rows,
        table: this.props.table
      })
      .then(() => {
        this.props.onRefresh();
      });
  }



  openAlert() {
    confirm({
      title: this.formatMessage({ id: "global.delete_confirm" }),
      okText: this.formatMessage({ id: "global.yes" }),
      okType: "danger",
      onOk: () => this.delete(),
      onCancel() { }
    });
  }

  delete() {
    this.props.onDelete();
  }

  render() {

    const {
      isShowPublishButtons,
      isShowDeleteButton,
      showActionBar,
      isShowAddButton } = this.props;

    return (
      <Row type="flex" gutter={[16, 24]} justify="space-between">

        {showActionBar ? (
          <Col sm={{ span: 18 }} xs={{ span: 24 }}>
            {isShowAddButton ? (
              <React.Fragment>
                <Button
                  type="primary"

                  onClick={() => this.props.onAdd()}
                >

                  <IntlMessages id="global.add_new" />
                </Button>
              </React.Fragment>
            ) : null}
            {isShowPublishButtons ? (
              <React.Fragment>
                <Divider type="vertical" />
                <Button
                  type="primary"
                  onClick={() => this.onPublish()}
                  disabled={this.props.isDisabled}
                >
                  <IntlMessages id="global.published" />
                </Button>
                <Divider type="vertical" />
                <Button
                  type="primary"
                  onClick={() => this.onUnpublish()}
                  disabled={this.props.isDisabled}
                >
                  <IntlMessages id="global.unpublished" />
                </Button>
              </React.Fragment>
            ) : null}

            {isShowDeleteButton ? (
              <React.Fragment>
                <Divider type="vertical" />
                <Button
                  type="danger"
                  onClick={() => this.openAlert()}
                  disabled={this.props.isDisabled}
                >
                  <IntlMessages id="global.delete" />
                </Button>
              </React.Fragment>
            ) : null}
            <span className="ml-2">{this.props.children}</span>
          </Col>
        ) : (
            <Col sm={{ span: 18 }} xs={{ span: 24 }}></Col>
          )}

      </Row>

    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    publish: data => dispatch(publish(data)),
    unpublish: data => dispatch(unpublish(data)),

  };
}

export default injectIntl(connect(null, mapDispatchToProps)(ActionBar));
