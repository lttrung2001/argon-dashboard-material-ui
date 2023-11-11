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
import apiHelper from "../../utils/Axios";
import { Autocomplete, Box, Button, CardMedia, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, FormControlLabel, Grid, IconButton, Input, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Radio, Select, TextField, Typography } from "@mui/material";
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
import RadioGroup from '@mui/material/RadioGroup';

function StudentsTable() {
  const [error, setError] = React.useState();
  const [students, setStudents] = React.useState([]);
  const [showCreatePopup, setShowCreatePopup] = React.useState(false);
  const [createDob, setCreateDob] = React.useState([]);

  const callGetStudents = async () => {
    try {
      const response = await apiHelper().get(`/students`);
      const students = response.data;
      setStudents(students);
    } catch (e) {
      setError(e);
    } finally {
      setShowCreatePopup(false);
    }
  };

  const callCreateStudent = async (data) => {
    try {
      await apiHelper().post("/students/create", data);
      callGetStudents();
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    callGetStudents();
  }, []);

  const handleCloseCreatePopup = () => {
    setShowCreatePopup(false);
  };

  const handleCreateStudent = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requestData = {
      fullName: data.get("fullName"),
      gender: data.get("gender"),
      dob: createDob,
      address: data.get("address"),
      phoneNumber: data.get("phoneNumber"),
      email: data.get("email"),
    };
    console.log("DATA::");
    console.log(requestData);

    callCreateStudent(requestData);
  };

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
              <ArgonTypography variant="h6">Students table</ArgonTypography>
              <Button onClick={() => {
                setShowCreatePopup(true);
              }}>Create</Button>
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
              The system was interrupted, please reload the website
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseErrorDialog} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog> : <></>
      }
      {
        // Create new classroom dialog
        showCreatePopup ? <Dialog
          fullWidth
          open={showCreatePopup}
          // TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseCreatePopup}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Create new clasroom"}</DialogTitle>
          <Box component="form" onSubmit={handleCreateStudent}>
            <Box mx={2} my={1}>
              <Typography>Fullname</Typography>
              <TextField id="fullName" name="fullName" fullWidth />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Gender</Typography>
            </Box>
            <Box mx={3} my={1}>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="gender"
              >
                <FormControlLabel value={true} control={<Radio />} label="Male" />
                <FormControlLabel value={false} control={<Radio />} label="Female" />
              </RadioGroup>
            </Box>

            <Box mx={2} my={1}>
              <Typography>Day of birth</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    format="DD/MM/YYYY"
                    onAccept={(newDate) => {
                      setCreateDob(dayjs(newDate).format("DD/MM/YYYY"));
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Box>
            <Box mx={2} my={1}>
              <Typography>Address</Typography>
              <TextField id="address" name="address" fullWidth />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Phone number</Typography>
              <TextField id="phoneNumber" name="phoneNumber" fullWidth />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Email</Typography>
              <TextField id="email" name="email" fullWidth />
            </Box>
            <DialogActions>
              <Button onClick={handleCloseCreatePopup}>Cancel</Button>
              <Button type="submit">Create</Button>
            </DialogActions>
          </Box>
        </Dialog> : <></>
      }
      <Footer />
    </DashboardLayout>
  );
}

export default StudentsTable;
