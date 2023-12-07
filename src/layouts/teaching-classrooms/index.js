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

function TeachingClassroomTable() {
  const [error, setError] = React.useState();
  const [originClassrooms, setOriginClassrooms] = React.useState([]);
  const [classrooms, setClassrooms] = React.useState([]);
  const [confirmPayment, setConfirmPayment] = React.useState();
  const navigator = useNavigate();

  const callGetClassrooms = async () => {
    try {
      apiHelper().get(`/classrooms`).then((response) => {
        const data = Array.from(response.data).filter((value) => {
          return value.registrationList.length > 0;
        });
        setOriginClassrooms(data);
        setClassrooms(data);
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
    } finally {
    }
  };

  useEffect(() => {
    callGetClassrooms();
  }, []);

  const handleCloseErrorDialog = () => {
    setError(null);
  };

  const handleSearchClassroomName = (event) => {
    const searchValue = event.target.value;
    if (searchValue) {
      const filtered = originClassrooms.filter((c) => {
        return c.name.toLowerCase().includes(searchValue.toLowerCase())
      });
      setClassrooms(filtered);
    } else {
      setClassrooms(originClassrooms);
    }
  }

  ///////////////// BEGIN DEMO TABLE
  const classroomColumns = [
    { field: "id", headerName: "ID", valueGetter: (params) => params.row?.id },
    { field: "classroomName", headerName: "Classroom name", flex: 1, valueGetter: (params) => params.row?.name },
    { field: "startDate", headerName: "Start date", flex: 0.5, valueGetter: (params) => dayjs(params.row?.startDate).format("DD/MM/YYYY") },
    { field: "endDate", headerName: "End date", flex: 0.5, valueGetter: (params) => dayjs(params.row?.endDate).format("DD/MM/YYYY") },
    { field: "registered", headerName: "Registered students", flex: 0.5, valueGetter: (params) => params.row?.registrationList.length },
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
              <ArgonTypography variant="h6">Registration list of classroom</ArgonTypography>
              <Box width={400}>
              <TextField onChange={handleSearchClassroomName} fullWidth placeholder="Search classroom"/>
              </Box>
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
                  columns={classroomColumns}
                  rows={classrooms}
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

export default TeachingClassroomTable;
