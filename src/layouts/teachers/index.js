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
import { Autocomplete, Box, Button, CardMedia, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, FormControlLabel, Grid, Input, InputLabel, List, ListItemButton, ListItemIcon, ListItemText, MenuItem, Radio, Select, TextField, Typography } from "@mui/material";
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
import RadioGroup from '@mui/material/RadioGroup';
import ConfirmDeleteData from "utils/ConfirmDeleteData";

function TeachersTable() {
  const [error, setError] = React.useState();
  const [confirm, setConfirm] = React.useState();
  const [confirmDelete, setConfirmDelete] = React.useState();
  const [teachers, setTeachers] = React.useState([]);
  const [showCreateTeacherDialog, setShowCreateTeacherDialog] = React.useState();
  const [selectedTeacher, setSelectedTeacher] = React.useState();
  const [createTeacherDobSelected, setCreateTeacherDobSelected] = React.useState();
  const [updateTeacherDobSelected, setUpdateTeacherDobSelected] = React.useState();

  const callGetTeachers = async () => {
    try {
      const response = await apiHelper().get(`/teachers`);
      const teachers = response.data.map((teacher) => {
        teacher.dob = dayjs(teacher.dob).format("DD/MM/YYYY")
        return teacher;
      });
      setTeachers(teachers);
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  const callCreateTeacher = async (data) => {
    try {
      await apiHelper().post("/teachers/create", data);
      callGetTeachers();
      setConfirm("Create teacher successfully!");
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  const callUpdateTeacher = async (data) => {
    try {
      await apiHelper().put("/teachers/update", data);
      callGetTeachers();
      setConfirm("Update teacher successfully!");
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  const callDeleteTeacher = async (teacherId) => {
    try {
      await apiHelper().delete(`/teachers/delete?teacherId=${teacherId}`);
      setSelectedTeacher(null);
      callGetTeachers();
      setConfirm("Delete teacher successfully!");
    } catch (e) {
      setError(e.response.data.message);
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

  const handleDeleteTeacher = (teacher) => {
    setConfirmDelete(new ConfirmDeleteData(
      ACTION_DELETE_TEACHER,
      `Are you sure to delete teacher with name ${teacher.fullName}`,
      teacher
    ));
  }

  const handleCloseErrorDialog = () => {
    setError(null);
  };

  const handleCloseConfirmDialog = () => {
    setConfirm(null);
  };

  ///////////////// BEGIN DEMO TABLE
  const teacherColumns = [
    { field: "id", headerName: "ID" },
    { field: "fullName", headerName: "Fullname", flex: 1 },
    { field: "gender", headerName: "Gender", valueGetter: (params) => params.row?.gender ? "Male" : "Female" },
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
              <ArgonTypography variant="h6">Teacher list</ArgonTypography>
              <Autocomplete
                onChange={(event, newValue) => {
                  if (newValue) {
                    setSelectedTeacher(newValue);
                  }
                }}
                disablePortal
                id="combo-box-demo"
                options={teachers}
                sx={{ width: 300 }}
                getOptionLabel={option => `${option.id} | ${option.fullName}`}
                renderInput={(params) => <TextField {...params} placeholder="Search teacher" />}
              />
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
            </Box>
            <Box mx={3} my={1}>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="gender"
                defaultValue={true}
              >
                <FormControlLabel value={true} control={<Radio />} label="Male" />
                <FormControlLabel value={false} control={<Radio />} label="Female" />
              </RadioGroup>
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
              <Button type="submit">Create</Button>
              <Button onClick={handleCloseCreateTeacherPopup}>Cancel</Button>

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
            </Box>
            <Box mx={3} my={1}>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="gender"
                defaultValue={selectedTeacher.gender}
              >
                <FormControlLabel value={true} control={<Radio />} label="Male" />
                <FormControlLabel value={false} control={<Radio />} label="Female" />
              </RadioGroup>
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
              <Button type="submit">Update</Button>
              <Button onClick={() => {
                handleDeleteTeacher(selectedTeacher);
              }}>Delete</Button>
              <Button onClick={handleCloseUpdateTeacherPopup}>Cancel</Button>

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
              setConfirmDelete(null);
            }} autoFocus>
              Cancel
            </Button>
            <Button onClick={() => {
              callDeleteTeacher(confirmDelete.data.id);
            }} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog> : <></>
      }
      <Footer />
    </DashboardLayout>
  );
}

export default TeachersTable;

const ACTION_DELETE_TEACHER = "ACTION_DELETE_TEACHER";
