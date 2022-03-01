import Account from "./account";
import Profile from "./auth/Profile";
import Bus from "./bus";
import BusAgent from "./busAgent";
import Destination from "./busDestination";
import Order from "./busOrders";
import OrderDetail from "./busOrders/OrderDetail";
import BusRoute from "./busRoute";
import CreateRoomrate from "./busRoute/CreateRoomrate";
import UpdateRoomrate from "./busRoute/UpdateRoomrate";
import BusRouteGroup from "./busRouteGroup";
import SeatTemplate from "./busSeatTemplate";
import Companies from "./companies";
import Dashboard from "./dashboard";
import Setting from "./setting";
import Stats from "./stats";


export const routes = [
  {
    path: "home",
    component: Dashboard,
    permission: null,
  },
  {
    path: "account",
    component: Account,
    permission: null,
  },
  {
    path: "stats",
    component: Stats,
    permission: null,
  },
  {
    path: "orders",
    component: Order,
    permission: null,
  },
  // {
  //   path: "companies",
  //   component: Companies,
  //   permission: null,
  // },
  {
    path: "companies/:id",
    component: Companies,
    permission: null,
  },
  {
    path: "orders",
    component: Order,
    permission: null,
  },
  {
    path: "account/agent",
    component: BusAgent,
    permission: null,
  },
  {
    path: "companies/seattemplate",
    component: SeatTemplate,
    permission: null,
  },
  {
    path: "companies/bus",
    component: Bus,
    permission: null,
  },

  {
    path: "cities",
    component: Destination,
    permission: null,
  },

  {
    path: "routegroup",
    component: BusRouteGroup,
    permission: null,
  },
  {
    path: "companies/busroute",
    component: BusRoute,
    permission: null,
  },
  {
    path: "companies/busroute/createroomrate/:id",
    component: CreateRoomrate,
    permission: null,
  },
  {
    path: "companies/busroute/updateroomrate/:id",
    component: UpdateRoomrate,
    permission: null,
  },

  {
    path: "orders/:id",
    component: OrderDetail,
    permission: null,
  },
  {
    path: "profile",
    component: Profile,
    permission: null,
  },
  {
    path: "setting",
    component: Setting,
    permission: null,
  },
  // {
  //     path: 'suppliers',
  //     component: Suppliers,
  //     permission: null
  // },
  // {
  //     path: 'organization',
  //     component: Organization,
  //     permission: null
  // },

  // {
  //     path: 'reports/service',
  //     component: Service,
  //     permission: null
  // },
  // {
  //     path: 'reports/revenue',
  //     component: Revenue,
  //     permission: null
  // },
  // {
  //     path: 'reports/room_performance',
  //     component: PerformanceRoom,
  //     permission: null
  // },
];
