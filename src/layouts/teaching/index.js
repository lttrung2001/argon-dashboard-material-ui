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
import Card from "@mui/material/Card";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Argon Dashboard 2 MUI examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import React, { useEffect, useState } from "react";
import apiHelper, { MESSAGE_INVALID_TOKEN, SERVICE_UNAVAILABLE } from "../../utils/Axios";
import { Autocomplete, Box, Button, CardMedia, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, Grid, IconButton, Input, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DialogTitle } from '@mui/material';
import { CloudUploadRounded } from "@mui/icons-material";
import { VisuallyHiddenInput } from "components/UploadFileButton";
import ArgonBadge from "components/ArgonBadge";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DataGrid, GridDeleteIcon, GridViewColumnIcon } from "@mui/x-data-grid";
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from "react-router-dom";

function TeachingTable() {
  const [error, setError] = React.useState();
  const [students, setStudents] = React.useState([]);
  const [classrooms, setClassrooms] = React.useState([]);
  const navigator = useNavigate();

  const callGetTeachingClassrooms = async () => {
    try {
      apiHelper().get(`/classroom-subject/teaching`).then((response) => {
        const idList = [];
        const classroomList = [];
        Array.from(response.data).forEach((item) => {
          const classroom = item.classroom;
          if (!idList.includes(classroom.id)) {
            idList.push(classroom.id);
            classroomList.push(classroom);
          }
        });
        setClassrooms(classroomList);
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
    } finally {
    }
  };

  useEffect(() => {
    callGetTeachingClassrooms();
  }, []);

  const handleCloseErrorDialog = () => {
    setError(null);
  };

  const handleStudentClicked = (params) => {
    const studentSelected = params.row;
  };

  ///////////////// BEGIN DEMO TABLE
  const studentColumns = [
    { field: "id", headerName: "ID" },
    { field: "fullName", headerName: "Fullname", flex: 1 },
    { field: "dob", headerName: "Day of birth", flex: 1, valueGetter: (params) => dayjs(params.row?.dob).format("DD/MM/YYYY") },
    { field: "gender", headerName: "Gender", flex: 1, valueGetter: (params) => getGenderTitle(params.row?.gender) },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phoneNumber", headerName: "Phone number", flex: 1 },
  ]

  const getGenderTitle = (gender) => {
    return gender ? "Male" : "Female";
  };

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 25,
    page: 0,
  });
  ///////////////// END DEMO TABLE

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <ArgonBox mb={3}>
          <Card>
            <ArgonBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <ArgonTypography variant="h6">Teaching classroom list</ArgonTypography>
              <Autocomplete
                onChange={(event, newValue) => {
                  if (newValue) {
                    const studentList = Array.from(newValue.registrationList).map((item) => {
                      return item.student;
                    });
                    setStudents(studentList);
                  }
                }}
                disablePortal
                id="combo-box-demo"
                options={classrooms}
                sx={{ width: 300 }}
                getOptionLabel={option => `${option.id} | ${option.name}`}
                renderInput={(params) => <TextField {...params} placeholder="Select classroom" />}
              />
            </ArgonBox>
            <ArgonBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  },
                },
              }}
            >

              <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  columns={studentColumns}
                  rows={students}
                  onRowClick={handleStudentClicked} {...students}
                />
              </div>

            </ArgonBox>
          </Card>
        </ArgonBox>
      </ArgonBox>
      {
        error ? <Dialog
          open={error}
          onClose={handleCloseErrorDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Notification"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            {error}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseErrorDialog} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog> : <></>
      }
      <Footer />
    </DashboardLayout>
  );
}

export default TeachingTable;