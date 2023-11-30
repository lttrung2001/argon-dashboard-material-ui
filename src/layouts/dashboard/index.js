/* eslint-disable no-unused-vars */
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

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Argon Dashboard 2 MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DetailedStatisticsCard from "examples/Cards/StatisticsCards/DetailedStatisticsCard";
import SalesTable from "examples/Tables/SalesTable";
import CategoriesList from "examples/Lists/CategoriesList";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";

// Argon Dashboard 2 MUI base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
import Slider from "layouts/dashboard/components/Slider";

// Data
import gradientLineChartData from "layouts/dashboard/data/gradientLineChartData";
import salesTableData from "layouts/dashboard/data/salesTableData";
import categoriesListData from "layouts/dashboard/data/categoriesListData";

import apiHelper, { MESSAGE_INVALID_TOKEN, SERVICE_UNAVAILABLE } from "../../utils/Axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Default() {
  const { size } = typography;

  const navigator = useNavigate();
  const [data, setData] = React.useState();
  const [courses, setCourses] = React.useState([]);
  const [error, setError] = React.useState();

  const callGetStatistics = async () => {
    try {
      apiHelper().get("/statistics").then((res) => {
        setData(res.data);
        setCourses(Array.from(res.data.courses).map((course) => {
          return {
            course: [course.courseUrl, course.courseName],
            opened: course.numberOfStudents,
            total: `${course.numberOfStudents * course.tuition} VND`,
            bounce: "29.9%",
          };
        }));
      }, (e) => {
        if (e.message == MESSAGE_INVALID_TOKEN) {
          localStorage.clear();
          navigator(0);
        } else {
          setError(SERVICE_UNAVAILABLE);
        }
      });
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  useState(() => {
    callGetStatistics();
  }, [])

  const getPercentString = (number) => {
    if (number > 0) {
      return `+${Number(number).toFixed(2)}%`;
    } else if (number < 0) {
      return `-${Number(number).toFixed(2)}%`;
    } else {
      return "0%";
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        {
          data ? <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="today's money"
              count={`${data.todayMoney} VND`}
              icon={{ color: "info", component: <i className="ni ni-money-coins" /> }}
              percentage={{ color: "success", count: `${getPercentString(data.todayPercentCompareToYesterday)}`, text: "since yesterday" }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="Opened courses"
              count={`${data.openedCourses} courses`}
              icon={{ color: "error", component: <i className="ni ni-world" /> }}
              percentage={{ color: "success", count: "0%" }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="Opened classrooms"
              count={`${data.openedClassrooms} classrooms`}
              icon={{ color: "success", component: <i className="ni ni-paper-diploma" /> }}
              percentage={{ color: "success", count: "0%" }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <DetailedStatisticsCard
              title="Revenue"
              count={`${data.totalOfYear} VND`}
              icon={{ color: "warning", component: <i className="ni ni-cart" /> }}
              percentage={{ color: "success", count: getPercentString(data.totalOfYearCompareToLastYear), text: "than last year" }}
            />
          </Grid>
        </Grid> : <></>
        }
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} lg={7}>
            <GradientLineChart
              title="Sales Overview"
              description={
                <ArgonBox display="flex" alignItems="center">
                  <ArgonBox fontSize={size.lg} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                    <Icon sx={{ fontWeight: "bold" }}>arrow_upward</Icon>
                  </ArgonBox>
                  <ArgonTypography variant="button" color="text" fontWeight="medium">
                    4% more{" "}
                    <ArgonTypography variant="button" color="text" fontWeight="regular">
                      in 2022
                    </ArgonTypography>
                  </ArgonTypography>
                </ArgonBox>
              }
              chart={gradientLineChartData}
            />
          </Grid>
          <Grid item xs={12} lg={5}>
            <Slider />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <SalesTable title="Sales by Course" rows={courses} />
          </Grid>
          <Grid item xs={12} md={4}>
            <CategoriesList title="categories" categories={categoriesListData} />
          </Grid>
        </Grid>
      </ArgonBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Default;
