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
import { Autocomplete, Box, Button, CardMedia, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, Grid, Input, InputLabel, List, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, TextField, Typography } from "@mui/material";
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
import { DataGrid } from "@mui/x-data-grid";
import { useDemoData } from '@mui/x-data-grid-generator';

function TeachersTable() {
  const [error, setError] = React.useState();
  const [teachers, setTeachers] = React.useState([]);
  const [showCreateTeacherDialog, setShowCreateTeacherDialog] = React.useState();
  const [selectedTeacher, setSelectedTeacher] = React.useState();
  const [createTeacherDobSelected, setCreateTeacherDobSelected] = React.useState();
  const [updateTeacherDobSelected, setUpdateTeacherDobSelected] = React.useState();

  const callGetTeachers = async () => {
    try {
      const response = await apiHelper().get(`/teachers`);
      const teachers = response.data;
      setTeachers(teachers);
    } catch (e) {
      setError(e);
    }
  };

  const callCreateTeacher = async (data) => {
    try {
      await apiHelper().post("/teachers/create", data);
      callGetTeachers();
    } catch (e) {
      setError(e);
    }
  };

  const callUpdateTeacher = async (data) => {
    try {
      await apiHelper().put("/teachers/update", data);
      callGetTeachers();
    } catch (e) {
      setError(e);
    }
  };

  const callDeleteTeacher = async (teacherId) => {
    try {
      await apiHelper().delete(`/teachers/delete?teacherId=${teacherId}`);
      setSelectedTeacher(null);
      callGetTeachers();
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    callGetTeachers();
  }, []);

  const handleTeacherClicked = (params) => {
    const teacherSelected = params.row;
    setUpdateTeacherDobSelected(dayjs(teacherSelected.dob).format("DD/MM/YYYY"));
    setSelectedTeacher(teacherSelected);
  };

  const handleCloseCreateTeacherPopup = () => {
    setShowCreateTeacherDialog(false);
  };

  const handleCloseUpdateTeacherPopup = () => {
    setSelectedTeacher(null);
  };

  const handleCreateTeacher = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const createTeacherData = {
      fullName: data.get("fullName"),
      gender: data.get("gender"),
      dob: createTeacherDobSelected,
      address: data.get("address"),
      phoneNumber: data.get("phoneNumber"),
      email: data.get("email")
    }
    console.log("DATA::");
    console.log(createTeacherData);

    handleCloseCreateTeacherPopup();
    callCreateTeacher(createTeacherData);
  };

  const handleUpdateTeacher = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const updateTeacherData = {
      teacherId: selectedTeacher.id,
      fullName: data.get("fullName"),
      gender: data.get("gender"),
      dob: updateTeacherDobSelected,
      address: data.get("address"),
      phoneNumber: data.get("phoneNumber"),
      email: data.get("email")
    }
    console.log("DATA::");
    console.log(updateTeacherData);

    handleCloseUpdateTeacherPopup();
    callUpdateTeacher(updateTeacherData);
  };

  const handleDeleteTeacher = () => {
    callDeleteTeacher(selectedTeacher.id);
  }

  const handleCloseErrorDialog = () => {
    setError(null);
  };

  ///////////////// BEGIN DEMO TABLE
  const teacherColumns = [
    { field: "id", headerName: "ID" },
    { field: "fullName", headerName: "Fullname", flex: 1 },
    { field: "gender", headerName: "Gender" },
    { field: "dob", headerName: "DOB", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "phoneNumber", headerName: "Phone number", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
  ]

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
              <ArgonTypography variant="h6">Teachers table</ArgonTypography>
              <Button onClick={() => {
                setShowCreateTeacherDialog(true);
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
                  columns={teacherColumns}
                  rows={teachers}
                  onRowClick={handleTeacherClicked} {...teachers}
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
        // Create teacher dialog
        showCreateTeacherDialog ? <Dialog
          fullWidth
          open={showCreateTeacherDialog}
          // TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseCreateTeacherPopup}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Create new teacher"}</DialogTitle>
          <Box component="form" onSubmit={handleCreateTeacher}>
            <Box mx={2} my={1}>
              <Typography>Full name</Typography>
              <TextField id="fullName" name="fullName" fullWidth />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Gender</Typography>
              <TextField id="gender" name="gender" fullWidth />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Date of birth</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    format="DD/MM/YYYY"
                    onAccept={(newDate) => {
                      setCreateTeacherDobSelected(dayjs(newDate).format("DD/MM/YYYY"));
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
              <Button onClick={handleCloseCreateTeacherPopup}>Cancel</Button>
              <Button type="submit">Create</Button>
            </DialogActions>
          </Box>
        </Dialog> : <></>
      }
      {
        // Update teacher dialog
        selectedTeacher ? <Dialog
          fullWidth
          open={selectedTeacher}
          // TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseUpdateTeacherPopup}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Update teacher information"}</DialogTitle>
          <Box component="form" onSubmit={handleUpdateTeacher}>
            <Box mx={2} my={1}>
              <Typography>Full name</Typography>
              <TextField id="fullName" name="fullName" fullWidth defaultValue={selectedTeacher.fullName} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Gender</Typography>
              <TextField id="gender" name="gender" fullWidth defaultValue={selectedTeacher.gender} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Date of birth</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    format="DD/MM/YYYY"
                    onAccept={(newDate) => {
                      setUpdateTeacherDobSelected(dayjs(newDate).format("DD/MM/YYYY"));
                    }}
                    defaultValue={dayjs(selectedTeacher.dob)}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Box>
            <Box mx={2} my={1}>
              <Typography>Address</Typography>
              <TextField id="address" name="address" fullWidth defaultValue={selectedTeacher.address} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Phone number</Typography>
              <TextField id="phoneNumber" name="phoneNumber" fullWidth defaultValue={selectedTeacher.phoneNumber} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Email</Typography>
              <TextField id="email" name="email" fullWidth defaultValue={selectedTeacher.email} />
            </Box>
            <DialogActions>
              <Button onClick={handleDeleteTeacher}>Delete</Button>
              <Button onClick={handleCloseUpdateTeacherPopup}>Cancel</Button>
              <Button type="submit">Update</Button>
            </DialogActions>
          </Box>
        </Dialog> : <></>
      }
      <Footer />
    </DashboardLayout>
  );
}

export default TeachersTable;