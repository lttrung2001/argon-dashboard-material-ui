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
// import gradientLineChartData from "layouts/dashboard/data/gradientLineChartData";
import salesTableData from "layouts/dashboard/data/salesTableData";
import categoriesListData from "layouts/dashboard/data/categoriesListData";

import apiHelper, { MESSAGE_INVALID_TOKEN, SERVICE_UNAVAILABLE } from "../../utils/Axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Dialog, DialogContent, MenuItem, Typography, DialogTitle, DialogActions } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

function Default() {
  const { size } = typography;

  const navigator = useNavigate();
  const [data, setData] = React.useState({
    totalOfYearCompareToLastYear: 0
  });
  const [courses, setCourses] = React.useState([]);
  const [years, setYears] = React.useState([]);
  const [selectedYear, setSelectedYear] = React.useState(null);
  const [error, setError] = React.useState();
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [otherStatistic, setOtherStatistic] = React.useState(null);
  const [gradientLineChartData, setGradientLineChartData] = React.useState({
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Revenue",
        color: "info",
        data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
      },
    ],
  });

  const getTotal = (course) => {
    return course.numberOfStudents * course.tuition;
  }

  const callGetStatistics = async (year) => {
    try {
      const requestData = otherStatistic ? {
        startDate: startDate,
        endDate: endDate
      } : {
        year: year
      }
      apiHelper().post(`/statistics`, requestData).then((res) => {
        setData(res.data);
        setCourses(Array.from(res.data.courses).sort((firstCourse, secondCourse) => {
          return getTotal(secondCourse) - getTotal(firstCourse);
        }).map((course) => {
          return {
            course: [course.courseUrl, course.courseName],
            students: course.numberOfStudents,
            total: `${course.numberOfStudents * course.tuition} VND`,
          };
        }));
        const lbls = Array.from(res.data.monthlyStatisticList).map((item) => {
          switch (item.month) {
            case 1: return "Jan"
            case 2: return "Feb"
            case 3: return "Mar"
            case 4: return "Apr"
            case 5: return "May"
            case 6: return "Jun"
            case 7: return "Jul"
            case 8: return "Aug"
            case 9: return "Sep"
            case 10: return "Oct"
            case 11: return "Nov"
            case 12: return "Dec"
          }
        })
        const valueList = Array.from(res.data.monthlyStatisticList).map((item) => {
          return item.total;
        })
        setGradientLineChartData({
          labels: lbls,
          datasets: [
            {
              label: "Revenue",
              color: "info",
              data: valueList,
            },
          ],
        })
      }, (e) => {
        if (e.message == MESSAGE_INVALID_TOKEN) {
          localStorage.clear();
          navigator(0);
        } else {
          setError(e.response.data.message);
        }
      });
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  const callGetYears = async () => {
    try {
      apiHelper().get("/statistics/years").then((res) => {
        setYears(res.data);
        setSelectedYear(res.data[0]);
        onYearChanged(res.data[0]);
      }, (e) => {
        if (e.message == MESSAGE_INVALID_TOKEN) {
          localStorage.clear();
          navigator(0);
        } else {
          setError(e.response.data.message);
        }
      });
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  useState(() => {
    callGetYears();
  }, [])

  const handleSelectYear = (event) => {
    setSelectedYear(event.target.value);
    onYearChanged(event.target.value);
  };

  const onYearChanged = (year) => {
    callGetStatistics(year);
  }

  const getPercentString = (number) => {
    if (number > 0) {
      return `+${Number(number).toFixed(2)}%`;
    } else if (number < 0) {
      return `-${Number(number).toFixed(2)}%`;
    } else {
      return "0%";
    }
  }

  const getIcon = () => {
    if (data.totalOfYearCompareToLastYear >= 0) return `arrow_upward`
    else return `arrow_downward`
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
        <Box mb={2} width={300}>
          {
            otherStatistic ? <>
              <Typography fontSize={14}>Date range</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    maxDate={endDate}
                    disableFuture
                    format="DD/MM/YYYY"
                    onAccept={(newDate) => {
                      setStartDate(newDate);
                    }}
                    defaultValue={startDate}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    minDate={startDate}
                    disableFuture
                    format="DD/MM/YYYY"
                    onAccept={(newDate) => {
                      setEndDate(newDate);
                    }}
                    defaultValue={endDate}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <Button onClick={() => {
                setOtherStatistic(false);
                setStartDate(null);
                setEndDate(null);
              }}>View by year</Button>
            </> : <>
              <Typography fontSize={14}>Year</Typography>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue={selectedYear}
                value={selectedYear}
                label="Year"
                onChange={handleSelectYear}
              >
                {
                  Array.from(years).map((year) => {
                    return <MenuItem key={year} value={year}>{year}</MenuItem>
                  })
                }
              </Select>
              <Button onClick={() => {
                setStartDate(dayjs(new Date()));
                setEndDate(dayjs(new Date()));
                setOtherStatistic(true);
              }}>View by date range</Button></>
          }
        </Box>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} lg={7}>
            <GradientLineChart
              title="Sales Overview"
              description={
                <ArgonBox display="flex" alignItems="center">
                  <ArgonBox fontSize={size.lg} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                    <Icon sx={{ fontWeight: "bold" }}>{getIcon()}</Icon>
                  </ArgonBox>
                  <ArgonTypography variant="button" color="text" fontWeight="medium">
                    {`${getPercentString(data.totalOfYearCompareToLastYear)} more`}{" "}
                    <ArgonTypography variant="button" color="text" fontWeight="regular">
                      {`in ${new Date().getFullYear()}`}
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
