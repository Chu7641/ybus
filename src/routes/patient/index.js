import { Card, Col, Row, Table, Tabs, Spin } from "antd";
import { withRouter } from "react-router-dom";
import React, { Component } from "react";
import { connect } from "react-redux";
import IntlMessages from "../../components/IntlMessage";
// actions
import { getDetailPatient } from "../../redux/actions/PatientAction";
import Avatar from "antd/lib/avatar/avatar";
import { UserOutlined } from "@ant-design/icons";
import PatientForm from "./PatientForm";
import Treatments from "./Treatments";
import Appointments from "./Appointments";
import Bills from "./Bills";
import PatientCard from "./PatientCard";
import Documents from "./Documents";
import Notes from "./Notes";

const { TabPane } = Tabs;

const PatientContext = React.createContext();

class Patient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      isSubmiting: false,
      loading: true,
      visible: false,
      patient: null,
      doctors: [],
    };
  }

  componentDidMount() {
    this.props.getDetailPatient(this.props.match.params.id).then((result) => {
      this.setState({
        patient: result,
        loading: false,
      });
    });
  }

  render() {
    var { patient, loading } = this.state;

    return (
      <React.Fragment>
        {loading ? (
          <Spin></Spin>
        ) : (
          <PatientContext.Provider value={{ patient: patient }}>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={8}>
                {/* <PatientCard></PatientCard> */}

                <PatientForm patient={patient} loading={this.state.loading} />
              </Col>

              <Col span={16}>
                <Card>
                  <Tabs defaultActiveKey="1">
                    <TabPane
                      tab={<IntlMessages id="global.treatment" />}
                      key="1"
                    >
                      <Treatments
                        patient_id={patient && patient.id ? patient.id : null}
                      />
                    </TabPane>
                    <TabPane
                      tab={<IntlMessages id="global.calendar" />}
                      key="2"
                    >
                      <Appointments
                        patient_id={patient && patient.id ? patient.id : null}
                      />
                    </TabPane>

                    <TabPane tab={<IntlMessages id="global.payment" />} key="5">
                      <Bills
                        patient_id={patient && patient.id ? patient.id : null}
                      />
                    </TabPane>

                    <TabPane
                      tab={<IntlMessages id="global.document" />}
                      key="document"
                    >
                      <Documents
                        patient_id={patient && patient.id ? patient.id : null}
                      />
                    </TabPane>

                    <TabPane tab={<IntlMessages id="global.note" />} key="note">
                      <Notes
                        patient_id={patient && patient.id ? patient.id : null}
                      />
                    </TabPane>
                  </Tabs>
                </Card>
              </Col>
            </Row>
          </PatientContext.Provider>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    patient: state.patient,
    listDoctors: state.doctor.list,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getDetailPatient: (filter) => dispatch(getDetailPatient(filter)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Patient)
);
