import { Line } from '@ant-design/charts';
import { Card } from "antd";
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Chart extends Component {

    render() {
        const data = [
            {
                date: '1',
                type: 'lịch hẹn',
                value: 300,
            },
            {
                date: '1',
                type: 'đăng kí',
                value: 208,
            },
            {
                date: '1',
                type: 'xác nhận',
                value: 182,
            },
            {
                date: '5',
                type: 'lịch hẹn',
                value: 400,
            },
            {
                date: '5',
                type: 'đăng kí',
                value: 218,
            },
            {
                date: '5',
                type: 'xác nhận',
                value: 200,
            },
            {
                date: '9',
                type: 'lịch hẹn',
                value: 72,
            },
            {
                date: '9',
                type: 'đăng kí',
                value: 188,
            },
            {
                date: '9',
                type: 'xác nhận',
                value: 212,
            },
            {
                date: '13',
                type: 'lịch hẹn',
                value: 392,
            },
            {
                date: '13',
                type: 'đăng kí',
                value: 135,
            },
            {
                date: '13',
                type: 'xác nhận',
                value: 150,
            },
            {
                date: '17',
                type: 'lịch hẹn',
                value: 192,
            },
            {
                date: '17',
                type: 'đăng kí',
                value: 325,
            },
            {
                date: '17',
                type: 'xác nhận',
                value: 250,
            },
            {
                date: '21',
                type: 'lịch hẹn',
                value: 392,
            },
            {
                date: '21',
                type: 'đăng kí',
                value: 235,
            },
            {
                date: '21',
                type: 'xác nhận',
                value: 250,
            },
            {
                date: '25',
                type: 'lịch hẹn',
                value: 48,
            },
            {
                date: '25',
                type: 'đăng kí',
                value: 210,
            },
            {
                date: '25',
                type: 'xác nhận',
                value: 220,
            },
            {
                date: '30',
                type: 'lịch hẹn',
                value: 348,
            },
            {
                date: '30',
                type: 'đăng kí',
                value: 110,
            },
            {
                date: '30',
                type: 'xác nhận',
                value: 220,
            },
           
          
        ];
        const config = {
            title: {
                visible: true,
                text: 'Biểu đồ thống kê',
            },
            padding: 'auto',
            forceFit: true,
            data,
            xField: 'date',
            yField: 'value',
            yAxis: { label: { formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`) } },
            legend: { position: 'right-top' },
            seriesField: 'type',
            color: (d) => {
                return d === 'lịch hẹn' ? '#93D072' : d==='đăng kí'? '#2D71E7':'red';
            },
            responsive: true,
            smooth: true,
        };
        return (
            <React.Fragment>
               
                <Card style={{ width: "100%" }}>
                    <Line {...config} />
                </Card>
              
            </React.Fragment>
        )
    }
}



export default connect(null, null)(Chart);