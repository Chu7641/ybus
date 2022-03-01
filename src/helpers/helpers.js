/**
 * Helpers Functions
 */
import moment from 'moment';
import axios from 'axios';

import 'moment/locale/vi';
moment.locale('vi')

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
    if (str && str.length > length) {
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
    var matches = str.match(/\b(\w)/g);
    if (!matches) return str.charAt(0);

    var acronym = matches.join('');
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

/**
 * convert image to base64 string
 * @param {*} file File
 */
export function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

/**
 * convert image url to base64 string
 * @param {*} img Image URL
 */
export function getBase64FromURL(url) {
    // handle cors when get images: https://cors-anywhere.herokuapp.com/
    return axios.get('https://cors-anywhere.herokuapp.com/' + url, {
        responseType: 'arraybuffer',
    }).then(response => Buffer.from(response.data, 'binary').toString('base64'))
        .catch(err => {
            console.log('======', err)
        })
}

/**
 * 
 * @param {*} name 
 * lay ten dem va ten 
 */
export function handleName(name) {
    let arr = name.split(' ');
    let length = arr.length;

    if (length >= 2) return arr[length - 2] + ' ' + arr[length - 1];
    else return name;
}

/**
 * handle province name, mapping to province db
 */
export function matchProvince(name, provinces) {
    // let province_arr = [...provinces];

    name = name.replace('tỉnh', '').replace('Tỉnh', '');
    name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
    name = name.trim();

    let selected = null;
    provinces.forEach(province => {
        let temp = province.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
        temp = temp.toLowerCase().trim();

        if (temp == name) selected = province._id;
    });

    return selected;
}

/**
 * handle province name, mapping to province array
 */
export function matchProvinceInArray(name, provinces) {
    // let province_arr = [...provinces];

    name = name.replace('tỉnh', '').replace('Tỉnh', '');
    name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
    name = name.trim();

    let selected = null;
    provinces.forEach(province => {
        let temp = province.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
        temp = temp.toLowerCase().trim();

        if (temp == name) selected = province;
    });

    return selected;
}
//time zone
export const convertTimezone = (date, format) => {
    var m = moment.utc(date).locale('vi'); // parse input as UTC
    // console.log('date', date)
    // var m = moment(date);
    return m.clone().local().format(format);
}