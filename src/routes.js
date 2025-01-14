/**
=========================================================
* Argon Dashboard 2 MUI - v3.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-material-ui
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Soft UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.
  Once you add a new route on this file it will be visible automatically on
  the Sidenav.
  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Argon Dashboard 2 MUI layouts
import Dashboard from "layouts/dashboard";
import CoursesTable from "layouts/courses";
import Billing from "layouts/billing";
import VirtualReality from "layouts/virtual-reality";
import RTL from "layouts/rtl";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import TeachersTable from "layouts/teachers";
import RoomsTable from "layouts/rooms";
import SubjectsTable from "layouts/subjects";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ScoresTable from "layouts/scores";
import RegistrationsTable from "layouts/registrations";
import StudentsTable from "layouts/students";
import { ACCESS_TOKEN } from "utils/Axios";
import { ROLE } from "utils/Axios";
import { MANAGER_ROLE } from "utils/Axios";
import TeachingTable from "layouts/teaching";
import SchedulingScreen from './layouts/scheduling/index';
import ScoreRateConfiguration from "layouts/configuration";
import ScoresViewTable from "layouts/scoresview";
import TeachingClassroomTable from "layouts/teaching-classrooms";

// localStorage.clear();
var routes = [];
if (localStorage.getItem(ACCESS_TOKEN)) {
  if (localStorage.getItem(ROLE) === MANAGER_ROLE) {
    routes = [
      {
        type: "route",
        name: "Dashboard",
        key: "dashboard",
        route: "/dashboard",
        icon: <ArgonBox component="i" color="primary" fontSize="14px" className="ni ni-tv-2" />,
        component: <Dashboard />,
      },
      {
        type: "route",
        name: "Courses",
        key: "courses",
        route: "/courses",
        icon: (
          <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-calendar-grid-58" />
        ),
        component: <CoursesTable />,
      },
      {
        type: "route",
        name: "Registrations",
        key: "registrations",
        route: "/registrations",
        icon: (
          <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-single-02" />
        ),
        component: <RegistrationsTable />,
      },
      // {
      //   type: "route",
      //   name: "Teaching classrooms",
      //   key: "teaching-classrooms",
      //   route: "/teaching-classrooms",
      //   icon: (
      //     <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-single-02" />
      //   ),
      //   component: <TeachingClassroomTable />,
      // },
      {
        type: "route",
        name: "Teachers",
        key: "teachers",
        route: "/teachers",
        icon: (
          <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-single-02" />
        ),
        component: <TeachersTable />,
      },
      {
        type: "route",
        name: "Students",
        key: "students",
        route: "/students",
        icon: (
          <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-single-02" />
        ),
        component: <StudentsTable />,
      },
      {
        type: "route",
        name: "Rooms",
        key: "rooms",
        route: "/rooms",
        icon: (
          <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-building" />
        ),
        component: <RoomsTable />,
      },
      {
        type: "route",
        name: "Subjects",
        key: "subjects",
        route: "/subjects",
        icon: (
          <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-books" />
        ),
        component: <SubjectsTable />,
      },
      {
        type: "route",
        name: "Scheduling",
        key: "scheduling",
        route: "/scheduling",
        icon: (
          <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-calendar-grid-58" />
        ),
        component: <SchedulingScreen />,
      },
      {
        type: "route",
        name: "Scores",
        key: "scores",
        route: "/scores",
        icon: (
          <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-books" />
        ),
        component: <ScoresTable />,
      },
      {
        type: "route",
        name: "Scores View",
        key: "scores-view",
        route: "/scores-view",
        icon: (
          <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-books" />
        ),
        component: <ScoresViewTable />,
      },
      {
        type: "route",
        name: "Configuration",
        key: "configuration",
        route: "/configuration",
        icon: (
          <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-single-02" />
        ),
        component: <ScoreRateConfiguration />,
      },
      {
        type: "route",
        name: "Billing",
        key: "billing",
        route: "/billing",
        icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-credit-card" />,
        component: <Billing />,
      },
      {
        type: "route",
        name: "Virtual Reality",
        key: "virtual-reality",
        route: "/virtual-reality",
        icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-app" />,
        component: <VirtualReality />,
      },
      {
        type: "route",
        name: "RTL",
        key: "rtl",
        route: "/rtl",
        icon: <ArgonBox component="i" color="error" fontSize="14px" className="ni ni-world-2" />,
        component: <RTL />,
      },
      { type: "title", title: "Account Pages", key: "account-pages" },
      {
        type: "route",
        name: "Profile",
        key: "profile",
        route: "/profile",
        icon: <ArgonBox component="i" color="dark" fontSize="14px" className="ni ni-single-02" />,
        component: <Profile />,
      },
    ];
  } else {
    routes = [
      {
        type: "route",
        name: "Teaching classrooms",
        key: "teaching-classrooms",
        route: "/teaching-classrooms",
        icon: (
          <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-single-02" />
        ),
        component: <TeachingClassroomTable />,
      },
      {
        type: "route",
        name: "Teaching",
        key: "teaching",
        route: "/teaching",
        icon: (
          <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-single-02" />
        ),
        component: <TeachingTable />,
      },
      {
        type: "route",
        name: "Scheduling",
        key: "scheduling",
        route: "/scheduling",
        icon: (
          <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-calendar-grid-58" />
        ),
        component: <SchedulingScreen />,
      },
      {
        type: "route",
        name: "Scores",
        key: "scores",
        route: "/scores",
        icon: (
          <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-books" />
        ),
        component: <ScoresTable />,
      },
      {
        type: "route",
        name: "Scores View",
        key: "scoresview",
        route: "/scores-view",
        icon: (
          <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-books" />
        ),
        component: <ScoresViewTable />,
      },
      { type: "title", title: "Account Pages", key: "account-pages" },
      {
        type: "route",
        name: "Profile",
        key: "profile",
        route: "/profile",
        icon: <ArgonBox component="i" color="dark" fontSize="14px" className="ni ni-single-02" />,
        component: <Profile />,
      },
    ]
  }
} else {
  routes = [
    {
      type: "route",
      name: "Sign In",
      key: "sign-in",
      route: "/authentication/sign-in",
      icon: (
        <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-single-copy-04" />
      ),
      component: <SignIn />,
    }
  ]
};

export default routes;
