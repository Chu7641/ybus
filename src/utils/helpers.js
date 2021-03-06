/**
 * Helpers Functions
 */
import moment from 'moment';
import React, { Component } from 'react';
import { Tag, Row, Col, } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import NumberFormat from 'react-number-format';
import { Link } from 'react-router-dom';

/**
 * Function to convert hex to rgba
 */
export function hexToRgbA(hex, alpha) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
    }
    throw new Error('Bad Hex');
}

/**
 * Text Truncate
 */
export function textTruncate(str, length, ending) {
    if (length == null) {
        length = 100;
    }
    if (ending == null) {
        ending = '...';
    }
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
    } else {
        return str;
    }
}

/**
 * Get Date
 */
export function getTheDate(timestamp, format) {
    let time = timestamp * 1000;
    let formatDate = format ? format : 'MM-DD-YYYY';
    return moment(time).format(formatDate);
}

/**
 * Convert Date To Timestamp
*/
export function convertDateToTimeStamp(date, format) {
    let formatDate = format ? format : 'YYYY-MM-DD';
    return moment(date, formatDate).unix();
}

/**
 * Function to return current app layout
 */
export function getAppLayout(url) {
    let location = url.pathname;
    let path = location.split('/');
    return path[1];
}

/**
 * 
 * @param {int} x 
 * Thousand delimiter
 */
export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * 
 * @param {*function} callback 
 * @param {*number} delay 
 * @param  {...any} args 
 * 
 */
export function debounce(callback, delay, ...args) {
    const timerClear = () => clear = true;
    var clear = true;
    return event => {
        if (clear) {
            clear = false;
            setTimeout(timerClear, delay);
            callback(event, ...args);
        }
    }
}


export function capitalize(s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export function getFirstLetterOfWords(str) {
    var acronym = '';
    let temp = str.split(" ");
    if (temp.length >= 2) acronym = temp[temp.length - 2].charAt(0) + temp[temp.length - 1].charAt(0);
    else acronym = str.charAt(0);
    // var matches = str.match(/\b(\w)/g);
    // if(!matches) return str.charAt(0);

    return acronym;
}

export function cleanObject(obj) {
    Object.keys(obj).map(key => {
        if (obj[key] === "" || obj[key] === null || obj[key] === undefined) {
            delete obj[key];
        }
    });

    return obj;
}

export function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

/**
 * render function for breadcrumb
 * @param {*} route 
 * @param {*} params 
 * @param {*} routes 
 * @param {*} paths 
 */
export const itemRender = (route, params, routes, paths) => {
    const last = routes.indexOf(route) === routes.length - 1;
    return last ? (
        <span>{route.breadcrumbName}</span>
    ) : (
            <Link to={`/${paths.join('/')}`}>{route.breadcrumbName}</Link>
        );
}

/**
 * 
 * @param {*} type 
 * mapping request type
 */
export function convertRequestType(type) {
    switch (type) {
        // old types
        case 0: return <Tag color="purple">H??? tr???</Tag>;
        case 1: return <Tag color="purple">Kh???i t???o</Tag>;
        case 2: return <Tag color="red">C???t h???y</Tag>;
        case 3: return <Tag color="gold">T???m d???ng</Tag>;
        case 4: return <Tag color="blue">B???t l???i</Tag>;
        case 5: return <Tag color="lime">B??? sung</Tag>;
        // new types
        case 10: return <Tag color="#f50">H??? tr??? k??? thu???t</Tag>;
        case 20: return <Tag color="#f50">H??? tr??? t?? v???n ????ng k?? m???i d???ch v???</Tag>;
        case 21: return <Tag color="#f50">H??? tr??? c??c v???n ????? cho kh??ch h??ng l?? ?????i l??</Tag>;
        case 22: return <Tag color="#f50">H??? tr??? t?? v???n gia h???n d???ch v???</Tag>;
        case 30: return <Tag color="#f50">Than phi???n - G??p ??</Tag>;
        case 40: return <Tag color="#f50">H??? tr??? d???ch v??? H??a ????n ??i???n t???</Tag>;
        case 41: return <Tag color="#f50">H??? tr??? chuy??n s??u v??? nghi???p v??? k??? to??n</Tag>;
        case 50: return <Tag color="#f50">H??? tr??? thay ?????i Th??ng tin- H??? s?? - H???p ?????ng</Tag>;
        case 60: return <Tag color="#f50">Ph???n h???i ?????n gi??m ?????c</Tag>;
        default: return null;
    }
}

/**
 * 
 * @param {*} url URL need to download
 * Downlaod without pop-up block warning
 */
export const downloadFromLink = (url, filename) => {
    let link = document.createElement("a");
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(link.href);
}

/**
 * 
 * @param {*} type 
 * mapping customer source
 */
export function convertCustomerSource(type) {
    switch (type) {
        case 1: return "Kh??ch h??ng t??? chat";
        case 2: return "Kh??ch h??ng g???i ??i???n";
        case 3: return "Kh??ch c?? d??ng l???i";
        case 4: return "Kh??ch h??ng gi???i thi???u";
        case 5: return "Kh??ch h??ng t??? t??m";
        case 6: return "Kh??ch c?? d??ng th??m";
        default: return null;
    }
}

export function handleProductHistoryItem(item) {
    delete item['customer_id'];
    delete item['customer_id_change'];
    delete item['category_id'];
    delete item['category_id_change'];
    delete item['user_id'];
    delete item['user_id_change'];
    // delete item['user_change'];
    // delete item['user_change_name'];
    // delete item['product_id'];
    // delete item['created_at'];



    return Object.keys(item).map(key => {
        let label = '';
        let type = 'normal';
        let isValid = true; // valid field

        switch (key) {
            case 'customer_name': {
                label = 'Kh??ch h??ng';
                break;
            }
            case 'contract_no': {
                label = 'S??? H??';
                break;
            }
            case 'category_title': {
                label = 'Danh m???c d???ch v???';
                break;
            }
            case 'datacenter': {
                label = 'Datacenter';
                break;
            }
            case 'description': {
                label = 'M?? t??? g??i d???ch v???';
                break;
            }
            case 'os': {
                label = 'H??? ??i???u h??nh';
                break;
            }
            case 'accompanied_service': {
                label = 'D???ch v??? k??m theo';
                break;
            }
            case 'ip': {
                label = '?????a ch??? IP';
                break;
            }
            case 'sign_date': {
                label = 'Ng??y k?? H??';
                type = 'date';
                break;
            }
            case 'charging_date': {
                label = 'Ng??y t??nh c?????c';
                type = 'date';
                break;
            }
            case 'renew_date': {
                label = 'Ng??y gia h???n';
                type = 'date';
                break;
            }
            case 'term': {
                label = 'K??? h???n';
                break;
            }
            case 'revenue_per_month': {
                label = 'Doanh thu / Th??ng';
                type = 'money';
                break;
            }
            case 'total_without_vat': {
                label = 'Thanh to??n ch??a VAT';
                type = 'money';
                break;
            }
            case 'total_with_vat': {
                label = 'Thanh to??n c?? VAT';
                type = 'money';
                break;
            }
            case 'purchase_date': {
                label = 'Ng??y ti???n v???';
                type = 'date';
                break;
            }
            case 'purchase_amount': {
                label = 'Ti???n v???';
                type = 'money';
                break;
            }
            case 'real_revenue_per_month': {
                label = 'Doanh thu / Th??ng (DT th???c t???)';
                type = 'money';
                break;
            }
            case 'real_revenue_without_vat': {
                label = 'Thanh to??n ch??a VAT (DT th???c t???)';
                type = 'money';
                break;
            }
            case 'payment_status': {
                label = 'T??nh tr???ng thanh to??n';
                break;
            }
            case 'payment_type': {
                label = 'H??nh th???c thanh to??n';
                break;
            }
            case 'initial_status': {
                label = 'Tr???ng th??i kh???i t???o';
                break;
            }
            case 'is_overload': {
                label = 'T??nh tr???ng qu?? t???i';
                break;
            }
            case 'user_name': {
                label = 'Nh??n vi??n kinh doanh';
                break;
            }
            case 'is_confirm_sending_mail': {
                label = 'X??c nh???n g???i mail';
                break;
            }
            case 'note': {
                label = 'Ghi ch??';
                break;
            }
            case 'website': {
                label = 'Website';
                break;
            }
            case 'field': {
                label = 'L??nh v???c';
                break;
            }
            case 'source': {
                label = 'Ngu???n kh??ch h??ng';
                item.source = convertCustomerSource(item.source);
                item.source_change = convertCustomerSource(item.source_change);
                break;
            }
            case 'signer_name': {
                label = 'Ng?????i k?? H??';
                break;
            }
            case 'signer_position': {
                label = 'Ch???c v??? ng?????i k??';
                break;
            }
            case 'signer_email': {
                label = 'Email ng?????i k??';
                break;
            }
            case 'signer_phone': {
                label = 'S??? ??i???n tho???i ng?????i k??';
                break;
            }
            case 'contact_name': {
                label = 'Ng?????i li??n h???';
                break;
            }
            case 'contact_phone': {
                label = 'S??? ??i???n tho???i ng?????i li??n h???';
                break;
            }
            case 'contact_email': {
                label = 'Email ng?????i li??n h???';
                break;
            }
            case 'payer_name': {
                label = 'Ng?????i thanh to??n';
                break;
            }
            case 'payer_phone': {
                label = 'S??? ??i???n tho???i ng?????i thanh to??n';
                break;
            }
            case 'payer_email': {
                label = 'Email ng?????i thanh to??n';
                break;
            }
            case 'payer_address': {
                label = '?????a ch??? chuy???n ph??t nhanh';
                break;
            }
            default: {
                isValid = false;
                break;
            }
        }

        if (!isValid) return null;

        if (item[key] != item[`${key}_change`]) {
            return (
                <Row>
                    <Col span={10}>
                        <b>{label}</b>
                    </Col>
                    <Col span={6}>
                        <div>
                            {
                                type == 'date' ? moment(item[key]).format('DD/MM/YYYY') : (
                                    <React.Fragment>
                                        {
                                            type == 'money' ? <NumberFormat value={item[key]} displayType={'text'} thousandSeparator='.' decimalSeparator=',' /> : item[key]
                                        }
                                    </React.Fragment>
                                )
                            }
                        </div>
                    </Col>
                    <Col span={2}><ArrowRightOutlined /></Col>
                    <Col span={6} style={{ textAlign: "right" }}>
                        <div>
                            {
                                type == 'date' ? moment(item[`${key}_change`]).format('DD/MM/YYYY') : (
                                    <React.Fragment>
                                        {
                                            type == 'money' ? <NumberFormat value={item[`${key}_change`]} displayType={'text'} thousandSeparator='.' decimalSeparator=',' /> : item[`${key}_change`]
                                        }
                                    </React.Fragment>
                                )
                            }
                        </div>
                    </Col>
                </Row>
            )
        }
    });
}

/**
 * Format number thousand seperator
 * @param {*} num original number
 */
export function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}