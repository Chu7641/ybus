import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import ConfigReducer from "./ConfigReducer";
import PatientReducer from "./PatientReducer";
import ClinicReducer from "./ClinicReducer";
import DoctorReducer from './DoctorReducer';
import TreatmentReducer from './TreatmentReducer'

const rootReducer = combineReducers({
    auth: AuthReducer,
    config: ConfigReducer,
    patient: PatientReducer,
    clinic: ClinicReducer,
    doctor: DoctorReducer,
    treatment: TreatmentReducer
});

export default rootReducer;