import React, { Component } from "react";
import { connect } from "react-redux";

import { Button, Divider, Modal, Icon, Tooltip, Input, Col, Row } from "antd";

import TableFilter from "../TableFilter/TableFilter";
import PropTypes from "prop-types";

import { FilterOutlined, PlusOutlined, FilterFilled } from '@ant-design/icons';
import { publish, unpublish } from "../../redux/actions/CommonActions";
import IntlMessages from "../IntlMessage";
const { Search } = Input;
const confirm = Modal.confirm;

class TableActionBar extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    textSearch: PropTypes.bool,
    onFilter: PropTypes.func,
    searchOpition: PropTypes.object,
    showFilter: PropTypes.bool,
    justify: PropTypes.oneOf(["start", "end", "center"]),
    showActionBar: PropTypes.bool
  };

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
      title: "Bạn có chắn chắn xoá các bản ghi này không?",
      okText: "Có",
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
      showFilter,
      isShowPublishButtons,
      onFilter,
      searchOpition,
      textSearch,
      data,
      justify,
      isShowDeleteButton,
      showActionBar,
      isShowAddButton,
      isShowCopyButton
    } = this.props;

    const style = {
      filterBody: {
        margin: "10px 0"
      }
    };
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
        <Col sm={{ span: 6 }} xs={{ span: 24 }} style={{ display: "flex" }}>
          {textSearch ? (
            <Search
              name="search"
              className="txtSearch"
              placeholder="Tìm kiếm..."
              allowClear
              onChange={e =>
                this.props.onFilter(e.target.value, e.target.name, "search")
              }
              style={{ width: "100%", position: 'relative', zIndex: 0 }}
              {...searchOpition}
            />
          ) : null}
          {showFilter && data.length ? (
            <Tooltip title="Bộ lọc">

              <div onClick={() => this.onOpenFilter()}>
                {
                  this.state.activeFilter ? <FilterFilled className="filter-icon" style={{ color: "#3498db" }} /> : <FilterOutlined className="filter-icon" />
                }
              </div>
            </Tooltip>
          ) : null}
        </Col>


        <TableFilter
          onFilter={onFilter}
          open={this.state.activeFilter}
          data={data}
          justify={justify}
        ></TableFilter>
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

export default connect(null, mapDispatchToProps)(TableActionBar);
