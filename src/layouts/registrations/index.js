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

function RegistrationsTable() {
  const [error, setError] = React.useState();
  const [classroomRegistrationList, setClassroomRegistrationList] = React.useState([]);
  const [classrooms, setClassrooms] = React.useState([]);
  const [confirmPayment, setConfirmPayment] = React.useState();

  const callGetClassrooms = async () => {
    try {
      const response = await apiHelper().get(`/classrooms`);
      const data = response.data;
      setClassrooms(data);
      if (Array.from(data).length > 0) {
        handleShowStudentList(data[0]);
      }
    } catch (e) {
      setError(e.response.data.message);
    } finally {
    }
  };

  const callGetStudents = async (classroomId) => {
    try {
      const response = await apiHelper().get(`/registrations?classroomId=${classroomId}`);
      const registrations = response.data;
      setClassroomRegistrationList(registrations);
    } catch (e) {
      setError(e.response.data.message);
    } finally {
    }
  };

  const callUpdatePaymentStatus = async (classroomId, studentId) => {
    try {
      const requestData = {
        classroomId: classroomId,
        studentId: studentId
      };
      await apiHelper().put(`/registrations/update`, requestData);
      callGetStudents(classroomId);
    } catch (e) {
      setError(e.response.data.message);
    } finally {
    }
  };

  useEffect(() => {
    callGetClassrooms();
  }, []);

  const handleCloseErrorDialog = () => {
    setError(null);
  };

  const handleShowStudentList = (classroom) => {
    callGetStudents(classroom.id);
  };

  const handleStudentClicked = (params) => {
    const studentSelected = params.row;
    // Show student details
  };

  ///////////////// BEGIN DEMO TABLE
  const registrationColumns = [
    { field: "id", headerName: "ID", valueGetter: (params) => params.row?.student.id },
    { field: "fullName", headerName: "Fullname", flex: 1, valueGetter: (params) => params.row?.student.fullName },
    { field: "dob", headerName: "Day of birth", flex: 1, valueGetter: (params) => dayjs(params.row?.student.dob).format("DD/MM/YYYY") },
    { field: "email", headerName: "Email", flex: 1, valueGetter: (params) => params.row?.student.email },
    { field: "phoneNumber", headerName: "Phone number", flex: 1, valueGetter: (params) => params.row?.student.phoneNumber },
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      renderCell: ({ row }) => (
        <ArgonBadge variant="gradient" badgeContent={row.isPaid ? "Paid" : "Unpaid"} color={row.isPaid ? "success" : "error"} size="xs" container />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      renderCell: ({ row }) => (
        row.isPaid ? <></> : <Button onClick={() => {
          setConfirmPayment({
            message: `Are you sure to confirm payment for this student?`,
            data: row
          });
        }}>
          Pay
        </Button>

      ),
    }

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
              <ArgonTypography variant="h6">Registration list of classroom</ArgonTypography>
              <Autocomplete
                style={{
                  width: 500
                }}
                onChange={(event, newValue) => {
                  if (newValue) {
                    handleShowStudentList(newValue);
                  }
                }}
                value={classrooms[0]}
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
                  getRowId={(row) => `${row.student.id}|${row.classroom.id}`}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  columns={registrationColumns}
                  rows={classroomRegistrationList}
                  onRowClick={handleStudentClicked} {...classroomRegistrationList}
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
        confirmPayment ? <Dialog
          open={confirmPayment}
          onClose={() => {
            setConfirmPayment(null);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Notification"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {confirmPayment.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              // call update status
              callUpdatePaymentStatus(
                confirmPayment.data.classroom.id,
                confirmPayment.data.student.id
              );
              setConfirmPayment(null);
            }} autoFocus>
              Agree
            </Button>
            <Button onClick={() => {
              setConfirmPayment(null);
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

export default RegistrationsTable;
