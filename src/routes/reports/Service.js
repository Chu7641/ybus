import React, { useState, useEffect } from 'react';
import { Card, message, Button, Divider, DatePicker, Spin, Table, Row, Col } from 'antd';
import moment from 'moment';
import { Line } from '@ant-design/charts';
import treatmentStatsApi from '../../api/treatmentStats';
import IntlMessages from "../../components/IntlMessage";
//import { getStatisticOrder } from '../../redux/actions/StatisticAction';
//import PageTitle from '../../components/PageTitle';
//import { SearchRoom } from '../../components/SearchRoom';
//import { ExportCSV } from '../../components/ExportExcel';

const { RangePicker } = DatePicker;
function getSum(array) {
    var sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum = +sum + parseInt(array[i].sum);
    }
    return { sum };
}
function getCount(array) {
    var count = 0;
    for (let i = 0; i < array.length; i++) {
        count = +count + parseInt(array[i].count);
    }
    return { count };
}

const columns = [
    {
        title: <IntlMessages id="global.day" />,
        dataIndex: 'date',
        sorter: (a, b) => {
            let date_a = new Date(a.date).getTime();
            let date_b = new Date(b.date).getTime();
            return date_a - date_b
        },
    },
    {
        title: 'Số ca',
        dataIndex: 'count',
        sorter: (a, b) => a.count - b.count,
    },
    {
        title: <IntlMessages id="bill.amount" />,
        dataIndex: 'sum',
        sorter: (a, b) => a.count - b.count,
        render: text => priceInVn(+text),
    },
 
]
const this_year = new Date().getFullYear();
const this_month = new Date().getMonth();
var last_month = this_month == 0 ? 11 : this_month - 1;
const today = moment().format("YYYY-MM-DD");
const last_30_day = moment().subtract(30, 'days').format("YYYY-MM-DD");
const last_7_day = moment().subtract(7, 'days').format("YYYY-MM-DD");
const start_this_month = moment().startOf('month').format("YYYY-MM-DD");
const end_this_month = moment().endOf('month').format("YYYY-MM-DD");
const start_last_month = moment(`${this_year}-${last_month + 1}`).startOf('month').format("YYYY-MM-DD");
const end_last_month = moment(`${this_year}-${last_month + 1}`).endOf('month').format("YYYY-MM-DD");
const array_day_this_month = Array.from({ length: moment().daysInMonth() }, (x, i) => moment().startOf('month').add(i, 'days').format('YYYY-MM-DD'));
const array_day_last_month = Array.from({ length: moment(`${this_year}-${last_month + 1}`).daysInMonth() }, (x, i) => moment(`${this_year}-${last_month + 1}`).startOf('month').add(i, 'days').format('YYYY-MM-DD'));
const array_day_last_7_day = Array.from({ length: 7 }, (x, i) => moment(last_7_day).add(i, 'days').format('YYYY-MM-DD'));
const array_day_last_30_day = Array.from({ length: 30 }, (x, i) => moment(last_30_day).add(i, 'days').format('YYYY-MM-DD'));
const priceInVn = (number) => {
    return (new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number));
}

function Service(props) {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState({ page: 1, limit: 5, from_date: last_30_day, to_date: today, type: "LAST_30_DAYS" });
    useEffect(() => {
        setLoading(true)
       getData();
    }, [filter])

    const getData=async()=>{
       await treatmentStatsApi.getAll(filter).then(res => {
            setData(res.data);
       //     console.log(res)
            setLoading(false)
        }).catch(err => {
            setLoading(false);
            message.error(err)
        })
    }
    const amount= <IntlMessages id="bill.amount" />;
    const dataChart = data.map((item, key) => {
        return (
            {   
                name: 'Số tiền',
                date: item.created_at,
                total: item.sum,
            }
        )
    })
   // console.log(dataChart);
    const option = {
        data: dataChart,
        xField: 'date',
        yField: 'total',
        seriesField: 'name',
        yAxis: {
            label: {
                formatter: (v) => priceInVn(v),
            },
        },
        legend: {
            position: 'top',
        },
        smooth: true,
        animation: {
            appear: {
                animation: 'path-in',
                duration: 1000,
            },
        },
        color: ['#1979C9', '#D62A0D'],
    }

    const footer = () => {
        var {count} =getCount(data)
        var  {sum} = getSum(data);
        return (
            <p style={{ marginTop: "20px" }}><b style={{ marginRight: "20px" }}><IntlMessages id= "bill.total_cases"/> {count}</b>
                <b style={{ marginRight: "20px" }}><IntlMessages id="bill.total_amount" /> {priceInVn(sum)}</b>
            </p>
        )
    }

    // const setDataExport = () => {
    //     var arr = setDataTable();
    //     arr.unshift({ date: "Ngày", ORDER_CONFIRMED: 'Đơn hàng đã xác nhận', ORDER_COMPLETED: "Đơn hàng đã hoàn thành", ORDER_CANCELLED: "Đơn hàng đã huỷ", total: "Tổng cộng" })
    //     return arr;
    // }

    const dataTable = data.map((item, key) => {
        return (
            {
                date: item.created_at,
                count: item.count,
                sum:item.sum,
            }
        )
    })

    return (
        <Card bordered={false} style={{ minHeight: "100%" }}>

            <Spin spinning={loading}>
                <Row type="flex" justify="space-between">
                    <Col></Col>
                    <Col style={{ padding: "16px 0px" }}>
                        {/* <ExportCSV
                            //csvData={setDataExport()}
                            fileName={`Báo cáo đơn hàng ${filter.order_type} từ ngày ${filter.start_date} đến ngày ${filter.end_date}`}
                        /> */}
                    </Col>
                </Row>
                <div style={{ display: "flex", marginBottom: "20px" }}>
                    <Button
                        type={filter.type == "LAST_30_DAYS" ? "primary" : "default"}
                        onClick={() => setFilter(filter => { return { ...filter, from_date: last_30_day, to_date: today, type: "LAST_30_DAYS" } })}
                    ><IntlMessages id="global.last_30_day" /></Button>
                    <Divider type="vertical" style={{ height: "auto" }}></Divider>
                    <Button
                        type={filter.type == "LAST_7_DAYS" ? "primary" : "default"}
                        onClick={() => setFilter(filter => { return { ...filter, from_date: last_7_day, to_date: today, type: "LAST_7_DAYS" } })}
                    ><IntlMessages id="global.last_7_day" /></Button>
                    <Divider type="vertical" style={{ height: "auto" }}></Divider>
                    <Button
                        type={filter.type == "LAST_MONTH" ? "primary" : "default"}
                        onClick={() => setFilter(filter => { return { ...filter, from_date: start_last_month, to_date: end_last_month, type: "LAST_MONTH" } })}
                    ><IntlMessages id="global.last_month" /></Button>
                    <Divider type="vertical" style={{ height: "auto" }}></Divider>
                    <Button
                        type={filter.type == "THIS_MONTH" ? "primary" : "default"}
                        onClick={() => setFilter(filter => { return { ...filter, from_date: start_this_month, to_date: end_this_month, type: "THIS_MONTH" } })}
                    ><IntlMessages id="global.this_month" /></Button>
                    <Divider type="vertical" style={{ height: "auto" }}></Divider>
                    <RangePicker
                        value={[moment(filter.from_date), moment(filter.to_date)]}
                        onOk={() => { }}
                        onChange={(d, dstr) => setFilter(filter => { return { ...filter, from_date: dstr[0], to_date: dstr[1], type: "CUSTOM" } })}
                    />
                </div>
                <Line
                    {...option}
                />
                <div style={{ marginBottom: "40px" }}></div>
                <Table
                    columns={columns}
                    dataSource={dataTable}
                    size={"small"}
                    rowKey={"date"}
                    footer={footer}
                />
            </Spin>
        </Card>
    )
}

export default Service;