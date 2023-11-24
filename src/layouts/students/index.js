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
import { handleTextFieldNumberChange } from "layouts/courses";

function StudentsTable() {
  const [error, setError] = React.useState();
  const [confirm, setConfirm] = React.useState();
  const [confirmDelete, setConfirmDelete] = React.useState();
  const [students, setStudents] = React.useState([]);
  const [showCreatePopup, setShowCreatePopup] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState();
  const [createDob, setCreateDob] = React.useState();
  const [updateDob, setUpdateDob] = React.useState();

  const callGetStudents = async () => {
    try {
      const response = await apiHelper().get(`/students`);
      const students = response.data;
      setStudents(students);
    } catch (e) {
      setError(e.response.data.message);
    } finally {
      handleCloseCreatePopup();
      handleCloseUpdatePopup();
    }
  };

  const callCreateStudent = async (data) => {
    try {
      await apiHelper().post("/students/create", data);
      callGetStudents();
      setConfirm("Create student successfully!");
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  const callUpdateStudent = async (data) => {
    try {
      await apiHelper().put("/students/update", data);
      callGetStudents();
      setConfirm("Update student successfully!");
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  useEffect(() => {
    callGetStudents();
  }, []);

  const handleCloseCreatePopup = () => {
    setShowCreatePopup(false);
  };

  const handleCloseUpdatePopup = () => {
    setUpdateDob(null);
    setSelectedStudent(null);
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

  const handleUpdateStudent = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requestData = {
      studentId: selectedStudent.id,
      fullName: data.get("fullName"),
      gender: data.get("gender"),
      dob: updateDob,
      address: data.get("address"),
      phoneNumber: data.get("phoneNumber"),
      email: data.get("email"),
    };
    console.log("DATA::");
    console.log(requestData);

    callUpdateStudent(requestData);
  };

  const handleCloseErrorDialog = () => {
    setError(null);
  };

  const handleCloseConfirmDialog = () => {
    setConfirm(null);
  };

  const handleStudentClicked = (params) => {
    const student = params.row;
    setUpdateDob(dayjs(student.dob).format("DD/MM/YYYY"));
    setSelectedStudent(student);
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
              <ArgonTypography variant="h6">Student list</ArgonTypography>
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
      {
        showCreatePopup ? <Dialog
          fullWidth
          open={showCreatePopup}
          // TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseCreatePopup}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Create new student"}</DialogTitle>
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
              <TextField id="phoneNumber" name="phoneNumber" fullWidth inputProps={{
                onChange: handleTextFieldNumberChange,
                maxLength: 10
              }} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Email</Typography>
              <TextField id="email" name="email" fullWidth type="email" />
            </Box>
            <DialogActions>
              <Button type="submit">Create</Button>
              <Button onClick={handleCloseCreatePopup}>Cancel</Button>

            </DialogActions>
          </Box>
        </Dialog> : <></>
      }
      {
        selectedStudent ? <Dialog
          fullWidth
          open={selectedStudent}
          // TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseUpdatePopup}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Update student info"}</DialogTitle>
          <Box component="form" onSubmit={handleUpdateStudent}>
            <Box mx={2} my={1}>
              <Typography>Fullname</Typography>
              <TextField id="fullName" name="fullName" fullWidth defaultValue={selectedStudent.fullName} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Gender</Typography>
            </Box>
            <Box mx={3} my={1}>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="gender"
                defaultValue={selectedStudent.gender}
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
                    defaultValue={dayjs(selectedStudent.dob)}
                    format="DD/MM/YYYY"
                    onAccept={(newDate) => {
                      setUpdateDob(dayjs(newDate).format("DD/MM/YYYY"));
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Box>
            <Box mx={2} my={1}>
              <Typography>Address</Typography>
              <TextField id="address" name="address" fullWidth defaultValue={selectedStudent.address} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Phone number</Typography>
              <TextField id="phoneNumber" name="phoneNumber" fullWidth defaultValue={selectedStudent.phoneNumber} inputProps={{
                onChange: handleTextFieldNumberChange,
                maxLength: 10
              }} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Email</Typography>
              <TextField id="email" name="email" fullWidth defaultValue={selectedStudent.email} type="email" />
            </Box>
            <DialogActions>
              <Button type="submit">Update</Button>
              <Button onClick={handleCloseUpdatePopup}>Cancel</Button>

            </DialogActions>
          </Box>
        </Dialog> : <></>
      }
      {
        confirm ? <Dialog
          open={confirm}
          onClose={handleCloseConfirmDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Notification"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {confirm}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog> : <></>
      }
      {
        confirmDelete ? <Dialog
          open={confirmDelete}
          onClose={() => {
            setConfirmDelete(null);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Notification"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {confirmDelete.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
          <Button onClick={() => {
              callDeleteRoom(confirmDelete.data.id);
              setConfirmDelete(null);
            }} autoFocus>
              Agree
            </Button>
            <Button onClick={() => {
              setConfirmDelete(null);
            }} autoFocus>
              Cancel
            </Button>
            
          </DialogActions>
        </Dialog> : <></>
      }
      <Footer />
    </DashboardLayout>
  );
}

export default StudentsTable;

const ACTION_DELETE_STUDENT = "ACTION_DELETE_STUDENT";
