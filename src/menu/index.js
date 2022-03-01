import {
  BarChartOutlined,
  HddOutlined,
  HomeOutlined,
  SettingOutlined,
  SnippetsOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect } from "react";
// import agentApi from "../api/agent";
import IntlMessages from "../components/IntlMessage";

// const listAgent = async() => {
//   let result =await agentApi.getAll();
//   console.log(result);
//   let aaa = result.data.list.map((res, index) => {
//     return {
//       path: `/app/companies/${res.id}`,
//       name: res.brandname,
//       permission: null,
//     };
//   });
//   return aaa
// };

const menu = [
  {
    path: "/app/home",
    name: <IntlMessages id="global.dashboard" />,
    icon: <HomeOutlined />,
    permission: null,
    children: null,
  },
  {
    path: "/app/account",
    name: <IntlMessages id="global.account" />,
    icon: <TeamOutlined />,
    permission: null,
    children: null,
  },
  {
    path: "/app/orders",
    name: <IntlMessages id="global.orders" />,
    icon: <SnippetsOutlined />,
    permission: null,
    children: null,
  },
  // {
  //     path: '/app/agent',
  //     name: <IntlMessages id="global.bus_agent" />,
  //     icon: <UserOutlined />,
  //     permission: null,
  //     children: null

  // },
  // {
  //   path: "/app/companies",
  //   name: <IntlMessages id="sidebar.companies" />,
  //   icon: <HddOutlined />,
  //   permission: null,
  //   children: [
  //     {
  //       path: "/app/companies/1",
  //       name: "Companies Name 1",
  //       permission: null,
  //     },
  //     {
  //       path: "/app/companies/2",
  //       name: "Companies Name 2",
  //       permission: null,
  //     },
  //   ],
  // },
  {
    path: "/app/cities",
    name: <IntlMessages id="sidebar.cities" />,
    icon: <UserOutlined />,
    permission: null,
    children: null,
  },
  {
    path: "/app/setting",
    name: <IntlMessages id="global.setting" />,
    icon: <SettingOutlined />,
    permission: null,
    children: null,
  },
  {
    path: "/app/stats",
    name: <IntlMessages id="sidebar.stats" />,
    icon: <BarChartOutlined />,
    permission: null,
    children: null,
  },
  // {
  //     path: '/app/seattemplate',
  //     name: <IntlMessages id="global.bus_seat_template" />,
  //     icon: <UserOutlined />,
  //     permission: null,
  //     children: null

  // },
  // {
  //     path: '/app/bus',
  //     name: <IntlMessages id="global.bus" />,
  //     icon: <UserOutlined />,
  //     permission: null,
  //     children: null

  // },

  // {

  //     path: '/app/destination',
  //     name: <IntlMessages id="global.destination" />,
  //     icon: <CalendarOutlined />,
  //     permission: null,
  //     children: null
  // },
  // {
  //     path: '/app/routegroup',
  //     name: <IntlMessages id="global.routegroup" />,
  //     icon: <ReconciliationOutlined />,
  //     permission: null,
  //     children: null
  // },
  // {
  //     path: '/app/busroute',
  //     name: <IntlMessages id="global.route" />,
  //     icon: <SettingOutlined />,
  //     permission: null,
  //     children: null
  // },

  // {
  //     path: '/app/earning',
  //     name: <IntlMessages id="global.earning" />,
  //     icon: <DollarCircleOutlined />,
  //     permission: null,
  //     children: null
  // },
  // {
  //     path: '/app/bills',
  //     name: <IntlMessages id="sidebar.bills" />,
  //     icon: <PercentageOutlined />,
  //     permission: null,
  //     children: null
  // },
  // {
  //     path: '/app/doctors',
  //     name: <IntlMessages id="sidebar.doctors" />,
  //     icon: <UserOutlined />,
  //     permission: null,
  //     children: null
  // },

  // {
  //     path: '/app/orders',
  //     name: <IntlMessages id="sidebar.orders" />,
  //     icon: <UnorderedListOutlined />,
  //     permission: null,
  //     children: null
  // },

  // {
  //     path: '/app/reports',
  //     name: <IntlMessages id="sidebar.reports" />,
  //     icon: <LineChartOutlined />,
  //     permission: null,
  //     children: [
  //         // {
  //         //     path: '/app/reports/overview',
  //         //     name: "Tổng quát",
  //         //     permission: null,
  //         // },
  //         {
  //             path: '/app/reports/service',
  //             name: <IntlMessages id="sidebar.services" />,
  //             permission: null
  //         },

  //         {
  //             path: '/app/reports/revenue',
  //             name: <IntlMessages id="sidebar.earning" />,
  //             permission: null
  //         },

  //         // {
  //         //     path: '/app/reports/room_performance',
  //         //     name: "Công suất bán phòng",
  //         //     permission: null
  //         // },
  //     ]
  // },

  // {
  //     path: '/app/services',
  //     name: <IntlMessages id="sidebar.services" />,
  //     icon: <UnorderedListOutlined />,
  //     permission: null,
  //     children: null
  // },
];

export default menu;
