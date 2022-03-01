import React, { useState } from 'react';
import {
    Form,
    Input,
    Select,
    Row,
    Col,
    Card,
    Checkbox,
    Button,
    Result,
    Modal,
    message
} from 'antd';
import { Link, Redirect } from 'react-router-dom';

import { signUp } from '../../redux/actions/UserAction';
import BaseSelect from '../../components/Elements/BaseSelect';
import IntlMessages from "../../components/IntlMessage";
import i18nHelper from "../../utils/i18n";
const { Option } = Select;

const countries = [
    { "title": "Afghanistan", "id": "AF" },
    { "title": "Åland Islands", "id": "AX" },
    { "title": "Albania", "id": "AL" },
    { "title": "Algeria", "id": "DZ" },
    { "title": "American Samoa", "id": "AS" },
    { "title": "AndorrA", "id": "AD" },
    { "title": "Angola", "id": "AO" },
    { "title": "Anguilla", "id": "AI" },
    { "title": "Antarctica", "id": "AQ" },
    { "title": "Antigua and Barbuda", "id": "AG" },
    { "title": "Argentina", "id": "AR" },
    { "title": "Armenia", "id": "AM" },
    { "title": "Aruba", "id": "AW" },
    { "title": "Australia", "id": "AU" },
    { "title": "Austria", "id": "AT" },
    { "title": "Azerbaijan", "id": "AZ" },
    { "title": "Bahamas", "id": "BS" },
    { "title": "Bahrain", "id": "BH" },
    { "title": "Bangladesh", "id": "BD" },
    { "title": "Barbados", "id": "BB" },
    { "title": "Belarus", "id": "BY" },
    { "title": "Belgium", "id": "BE" },
    { "title": "Belize", "id": "BZ" },
    { "title": "Benin", "id": "BJ" },
    { "title": "Bermuda", "id": "BM" },
    { "title": "Bhutan", "id": "BT" },
    { "title": "Bolivia", "id": "BO" },
    { "title": "Bosnia and Herzegovina", "id": "BA" },
    { "title": "Botswana", "id": "BW" },
    { "title": "Bouvet Island", "id": "BV" },
    { "title": "Brazil", "id": "BR" },
    { "title": "British Indian Ocean Territory", "id": "IO" },
    { "title": "Brunei Darussalam", "id": "BN" },
    { "title": "Bulgaria", "id": "BG" },
    { "title": "Burkina Faso", "id": "BF" },
    { "title": "Burundi", "id": "BI" },
    { "title": "Cambodia", "id": "KH" },
    { "title": "Cameroon", "id": "CM" },
    { "title": "Canada", "id": "CA" },
    { "title": "Cape Verde", "id": "CV" },
    { "title": "Cayman Islands", "id": "KY" },
    { "title": "Central African Republic", "id": "CF" },
    { "title": "Chad", "id": "TD" },
    { "title": "Chile", "id": "CL" },
    { "title": "China", "id": "CN" },
    { "title": "Christmas Island", "id": "CX" },
    { "title": "Cocos (Keeling) Islands", "id": "CC" },
    { "title": "Colombia", "id": "CO" },
    { "title": "Comoros", "id": "KM" },
    { "title": "Congo", "id": "CG" },
    { "title": "Congo, The Democratic Republic of the", "id": "CD" },
    { "title": "Cook Islands", "id": "CK" },
    { "title": "Costa Rica", "id": "CR" },
    {
        "title": "Cote D'Ivoire", "id": "CI"
    },
    { "title": "Croatia", "id": "HR" },
    { "title": "Cuba", "id": "CU" },
    { "title": "Cyprus", "id": "CY" },
    { "title": "Czech Republic", "id": "CZ" },
    { "title": "Denmark", "id": "DK" },
    { "title": "Djibouti", "id": "DJ" },
    { "title": "Dominica", "id": "DM" },
    { "title": "Dominican Republic", "id": "DO" },
    { "title": "Ecuador", "id": "EC" },
    { "title": "Egypt", "id": "EG" },
    { "title": "El Salvador", "id": "SV" },
    { "title": "Equatorial Guinea", "id": "GQ" },
    { "title": "Eritrea", "id": "ER" },
    { "title": "Estonia", "id": "EE" },
    { "title": "Ethiopia", "id": "ET" },
    { "title": "Falkland Islands (Malvinas)", "id": "FK" },
    { "title": "Faroe Islands", "id": "FO" },
    { "title": "Fiji", "id": "FJ" },
    { "title": "Finland", "id": "FI" },
    { "title": "France", "id": "FR" },
    { "title": "French Guiana", "id": "GF" },
    { "title": "French Polynesia", "id": "PF" },
    { "title": "French Southern Territories", "id": "TF" },
    { "title": "Gabon", "id": "GA" },
    { "title": "Gambia", "id": "GM" },
    { "title": "Georgia", "id": "GE" },
    { "title": "Germany", "id": "DE" },
    { "title": "Ghana", "id": "GH" },
    { "title": "Gibraltar", "id": "GI" },
    { "title": "Greece", "id": "GR" },
    { "title": "Greenland", "id": "GL" },
    { "title": "Grenada", "id": "GD" },
    { "title": "Guadeloupe", "id": "GP" },
    { "title": "Guam", "id": "GU" },
    { "title": "Guatemala", "id": "GT" },
    { "title": "Guernsey", "id": "GG" },
    { "title": "Guinea", "id": "GN" },
    { "title": "Guinea-Bissau", "id": "GW" },
    { "title": "Guyana", "id": "GY" },
    { "title": "Haiti", "id": "HT" },
    { "title": "Heard Island and Mcdonald Islands", "id": "HM" },
    { "title": "Holy See (Vatican City State)", "id": "VA" },
    { "title": "Honduras", "id": "HN" },
    { "title": "Hong Kong", "id": "HK" },
    { "title": "Hungary", "id": "HU" },
    { "title": "Iceland", "id": "IS" },
    { "title": "India", "id": "IN" },
    { "title": "Indonesia", "id": "ID" },
    { "title": "Iran, Islamic Republic Of", "id": "IR" },
    { "title": "Iraq", "id": "IQ" },
    { "title": "Ireland", "id": "IE" },
    { "title": "Isle of Man", "id": "IM" },
    { "title": "Israel", "id": "IL" },
    { "title": "Italy", "id": "IT" },
    { "title": "Jamaica", "id": "JM" },
    { "title": "Japan", "id": "JP" },
    { "title": "Jersey", "id": "JE" },
    { "title": "Jordan", "id": "JO" },
    { "title": "Kazakhstan", "id": "KZ" },
    { "title": "Kenya", "id": "KE" },
    { "title": "Kiribati", "id": "KI" },
    { "title": "Korea, Democratic People'S Republic of", "id": "KP" },
    { "title": "Korea, Republic of", "id": "KR" },
    { "title": "Kuwait", "id": "KW" },
    { "title": "Kyrgyzstan", "id": "KG" },
    { "title": "Lao People'S Democratic Republic", "id": "LA" },
    { "title": "Latvia", "id": "LV" },
    { "title": "Lebanon", "id": "LB" },
    { "title": "Lesotho", "id": "LS" },
    { "title": "Liberia", "id": "LR" },
    { "title": "Libyan Arab Jamahiriya", "id": "LY" },
    { "title": "Liechtenstein", "id": "LI" },
    { "title": "Lithuania", "id": "LT" },
    { "title": "Luxembourg", "id": "LU" },
    { "title": "Macao", "id": "MO" },
    { "title": "Macedonia, The Former Yugoslav Republic of", "id": "MK" },
    { "title": "Madagascar", "id": "MG" },
    { "title": "Malawi", "id": "MW" },
    { "title": "Malaysia", "id": "MY" },
    { "title": "Maldives", "id": "MV" },
    { "title": "Mali", "id": "ML" },
    { "title": "Malta", "id": "MT" },
    { "title": "Marshall Islands", "id": "MH" },
    { "title": "Martinique", "id": "MQ" },
    { "title": "Mauritania", "id": "MR" },
    { "title": "Mauritius", "id": "MU" },
    { "title": "Mayotte", "id": "YT" },
    { "title": "Mexico", "id": "MX" },
    { "title": "Micronesia, Federated States of", "id": "FM" },
    { "title": "Moldova, Republic of", "id": "MD" },
    { "title": "Monaco", "id": "MC" },
    { "title": "Mongolia", "id": "MN" },
    { "title": "Montserrat", "id": "MS" },
    { "title": "Morocco", "id": "MA" },
    { "title": "Mozambique", "id": "MZ" },
    { "title": "Myanmar", "id": "MM" },
    { "title": "Namibia", "id": "NA" },
    { "title": "Nauru", "id": "NR" },
    { "title": "Nepal", "id": "NP" },
    { "title": "Netherlands", "id": "NL" },
    { "title": "Netherlands Antilles", "id": "AN" },
    { "title": "New Caledonia", "id": "NC" },
    { "title": "New Zealand", "id": "NZ" },
    { "title": "Nicaragua", "id": "NI" },
    { "title": "Niger", "id": "NE" },
    { "title": "Nigeria", "id": "NG" },
    { "title": "Niue", "id": "NU" },
    { "title": "Norfolk Island", "id": "NF" },
    { "title": "Northern Mariana Islands", "id": "MP" },
    { "title": "Norway", "id": "NO" },
    { "title": "Oman", "id": "OM" },
    { "title": "Pakistan", "id": "PK" },
    { "title": "Palau", "id": "PW" },
    { "title": "Palestinian Territory, Occupied", "id": "PS" },
    { "title": "Panama", "id": "PA" },
    { "title": "Papua New Guinea", "id": "PG" },
    { "title": "Paraguay", "id": "PY" },
    { "title": "Peru", "id": "PE" },
    { "title": "Philippines", "id": "PH" },
    { "title": "Pitcairn", "id": "PN" },
    { "title": "Poland", "id": "PL" },
    { "title": "Portugal", "id": "PT" },
    { "title": "Puerto Rico", "id": "PR" },
    { "title": "Qatar", "id": "QA" },
    { "title": "Reunion", "id": "RE" },
    { "title": "Romania", "id": "RO" },
    { "title": "Russian Federation", "id": "RU" },
    { "title": "RWANDA", "id": "RW" },
    { "title": "Saint Helena", "id": "SH" },
    { "title": "Saint Kitts and Nevis", "id": "KN" },
    { "title": "Saint Lucia", "id": "LC" },
    { "title": "Saint Pierre and Miquelon", "id": "PM" },
    { "title": "Saint Vincent and the Grenadines", "id": "VC" },
    { "title": "Samoa", "id": "WS" },
    { "title": "San Marino", "id": "SM" },
    { "title": "Sao Tome and Principe", "id": "ST" },
    { "title": "Saudi Arabia", "id": "SA" },
    { "title": "Senegal", "id": "SN" },
    { "title": "Serbia and Montenegro", "id": "CS" },
    { "title": "Seychelles", "id": "SC" },
    { "title": "Sierra Leone", "id": "SL" },
    { "title": "Singapore", "id": "SG" },
    { "title": "Slovakia", "id": "SK" },
    { "title": "Slovenia", "id": "SI" },
    { "title": "Solomon Islands", "id": "SB" },
    { "title": "Somalia", "id": "SO" },
    { "title": "South Africa", "id": "ZA" },
    { "title": "South Georgia and the South Sandwich Islands", "id": "GS" },
    { "title": "Spain", "id": "ES" },
    { "title": "Sri Lanka", "id": "LK" },
    { "title": "Sudan", "id": "SD" },
    { "title": "Surilabel", "id": "SR" },
    { "title": "Svalbard and Jan Mayen", "id": "SJ" },
    { "title": "Swaziland", "id": "SZ" },
    { "title": "Sweden", "id": "SE" },
    { "title": "Switzerland", "id": "CH" },
    { "title": "Syrian Arab Republic", "id": "SY" },
    { "title": "Taiwan, Province of China", "id": "TW" },
    { "title": "Tajikistan", "id": "TJ" },
    { "title": "Tanzania, United Republic of", "id": "TZ" },
    { "title": "Thailand", "id": "TH" },
    { "title": "Timor-Leste", "id": "TL" },
    { "title": "Togo", "id": "TG" },
    { "title": "Tokelau", "id": "TK" },
    { "title": "Tonga", "id": "TO" },
    { "title": "Trinidad and Tobago", "id": "TT" },
    { "title": "Tunisia", "id": "TN" },
    { "title": "Turkey", "id": "TR" },
    { "title": "Turkmenistan", "id": "TM" },
    { "title": "Turks and Caicos Islands", "id": "TC" },
    { "title": "Tuvalu", "id": "TV" },
    { "title": "Uganda", "id": "UG" },
    { "title": "Ukraine", "id": "UA" },
    { "title": "United Arab Emirates", "id": "AE" },
    { "title": "United Kingdom", "id": "GB" },
    { "title": "United States", "id": "US" },
    { "title": "United States Minor Outlying Islands", "id": "UM" },
    { "title": "Uruguay", "id": "UY" },
    { "title": "Uzbekistan", "id": "UZ" },
    { "title": "Vanuatu", "id": "VU" },
    { "title": "Venezuela", "id": "VE" },
    { "title": "Viet Nam", "id": "VN" },
    { "title": "Virgin Islands, British", "id": "VG" },
    { "title": "Virgin Islands, U.S.", "id": "VI" },
    { "title": "Wallis and Futuna", "id": "WF" },
    { "title": "Western Sahara", "id": "EH" },
    { "title": "Yemen", "id": "YE" },
    { "title": "Zambia", "id": "ZM" },
    { "title": "Zimbabwe", "id": "ZW" }
]
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

export default function SignUp() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [blur, setBlur] = useState(false)
    const showModal = (e) => {
        e.preventDefault();
        setIsModalVisible(true);
    };
    const handleOk = () => {
        setIsModalVisible(false);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    console.log('tz', Intl.DateTimeFormat().resolvedOptions().timeZone);
    // const validate = (rules, value) => {
    //     if (blur) {
    //         if (!value) {
    //             return Promise.resolve();
    //         }

    //         return Promise.reject("error error")
    //     }
    //     return Promise.resolve();


    // }

    // const blurEmail = (e) => {
    //     if (e.target.value) {
    //         setBlur(true);
    //         form.validateFields(['email'])
    //     }

    // }

    const onFinish = (values) => {
        let data = {
            ...values,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language ? navigator.language : 'en-US'
        };

        setLoading(true);
        signUp(data).
            then((res) => {
                console.log('res', res);
                setSuccess(true);
                setLoading(true);

            }).
            catch((error) => {
                console.log('error', error);
                setLoading(false)

                if (error.status == 400) {

                    message.error({
                        content: "Email has already exist",
                        className: 'ant-message',
                        style: {
                            marginTop: '30vh',
                        },
                    });

                }

            });

    };





    return (
        <div className="fullscreen">
            <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
                <Col xs={24} xl={8}>
                    {success ? (

                        <Card>
                            <Result
                                status="success"
                                title={<IntlMessages id="signup.send_activation_success" />}
                                subTitle={<IntlMessages id="signup.activation_guide" />}
                                extra={[
                                    <Link to='/login' key="login">
                                        <Button type="primary" key="console">
                                            <IntlMessages id="signup.back_to_login" />
                                        </Button>
                                    </Link>
                                ]}
                            />
                        </Card>

                    ) : (
                            <Card title={<IntlMessages id="global.registration_header" />} >
                                <Form
                                    {...formItemLayout}
                                    form={form}
                                    name="register"
                                    onFinish={onFinish}
                                    initialValues={{

                                    }}
                                    scrollToFirstError
                                >
                                    <Form.Item
                                        name="email"
                                        label="E-mail"
                                        hasFeedback
                                        rules={[
                                            {
                                                type: 'email',
                                                message: <IntlMessages id="global.emai_not_valid" />,
                                            },
                                            {
                                                required: true,
                                                message: <IntlMessages id="global.emai_required" />,
                                            },

                                            // {
                                            //     validator: validate

                                            // }



                                        ]}
                                    >
                                        {/* <Input onBlur={(e) => blurEmail(e)} /> */}
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        label={<IntlMessages id="global.password" />}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your password!',
                                            },
                                        ]}
                                        hasFeedback
                                    >
                                        <Input.Password />
                                    </Form.Item>



                                    <Form.Item
                                        name="clinic_name"
                                        label={
                                            <IntlMessages id="global.clinic_name" />
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message: <IntlMessages id="global.requiredfield" />,
                                                whitespace: true,
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name="firstname"
                                        label={<IntlMessages id="global.firstname" />}
                                        rules={[
                                            {
                                                required: true,
                                                message: <IntlMessages id="global.requiredfield" />,
                                                whitespace: true,
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        name="lastname"
                                        label={<IntlMessages id="global.lastname" />}
                                        rules={[
                                            {
                                                required: true,
                                                message: <IntlMessages id="global.requiredfield" />,
                                                whitespace: true,
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name="country_id"
                                        label={<IntlMessages id="global.country" />}
                                        rules={[
                                            {

                                                required: true,
                                                message: <IntlMessages id="global.requiredfield" />,
                                            },
                                        ]}
                                    >

                                        <Select

                                            showSearch={true}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }

                                        >
                                            {countries.map(item => {

                                                return <Option value={item.id} key={item.id}>{item.title}</Option>
                                            })
                                            }


                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        name="mobile"
                                        label={<IntlMessages id="global.mobile" />}
                                        rules={[
                                            {
                                                required: false,

                                            },
                                        ]}
                                    >
                                        <Input

                                            style={{
                                                width: '100%',
                                            }}
                                        />
                                    </Form.Item>


                                    <Form.Item
                                        name="agreement"
                                        valuePropName="checked"
                                        rules={[
                                            {
                                                validator: (_, value) =>
                                                    value ? Promise.resolve() : Promise.reject(<IntlMessages id="global.accept_agreement_warning" />),
                                            },
                                        ]}
                                        {...tailFormItemLayout}
                                    >
                                        <Checkbox>
                                            I have read and agree to the <a href="" onClick={showModal}>terms and conditions</a>
                                        </Checkbox>
                                    </Form.Item>
                                    <Form.Item {...tailFormItemLayout}>
                                        <Button type="primary" htmlType="submit" size="large" loading={loading} span={24}>
                                            {<IntlMessages id="global.continue" />}
                                        </Button>
                                    </Form.Item>
                                </Form>

                                <Row justify='center'>
                                    <Link to='/login' key="login">

                                        <IntlMessages id="signup.back_to_login" />

                                    </Link>

                                </Row>

                                <Modal title="SmilePos terms and conditions" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>

                                    <ul>
                                        <li>

                                            Transfer of Data
                                            Your information, including Personal Data, may be transferred to – and maintained on – computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.


                                            Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.

                                            SmilePos. will take all the steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organisation or a country unless there are adequate controls in place including the security of your data and other personal information.

                                        </li>
                                        <li>
                                            We do not disclose our data unless required to do so by law or in response to valid requests by public authorities.
</li>
                                        <li>
                                            Security of Data
                                            The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
</li>
                                    </ul>
                                </Modal>
                            </Card>
                        )}
                </Col>
            </Row>
        </div >
    );
};
