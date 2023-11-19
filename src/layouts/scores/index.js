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
import { CloudUploadRounded, UpdateRounded } from "@mui/icons-material";
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
import { DataGrid, GridEditInputCell } from "@mui/x-data-grid";
import { useDemoData } from '@mui/x-data-grid-generator';

function ScoresTable() {
  const changedMap = new Map();
  
  const [message, setMessage] = React.useState();
  const [error, setError] = React.useState();
  const [classrooms, setClassrooms] = React.useState([]);
  const [scores, setScores] = React.useState([]);
  const [selectedClassroom, setSelectedClassroom] = React.useState();
  const [selectedClassroomSubject, setSelectedClassroomSubject] = React.useState();

  const callGetClassrooms = async () => {
    try {
      const response = await apiHelper().get(`/classrooms`);
      const classrooms = response.data;
      setClassrooms(classrooms);
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  const callGetScores = async (classroomSubject) => {
    try {
      const requestData = {
        classroomId: selectedClassroom.id,
        subjectId: classroomSubject.subject.id
      };
      console.log(requestData);
      const response = await apiHelper().post(`/scores`, requestData);
      const scores = response.data;
      setScores(scores);
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  const callUpdateScores = async () => {
    try {
      const requestData = {
        classroomId: selectedClassroom.id,
        subjectId: selectedClassroomSubject.subject.id,
        scores: Object.fromEntries(changedMap)
      };
      console.log(requestData);
      await apiHelper().post(`/scores/update`, requestData);
      changedMap.clear();
      callGetScores(selectedClassroomSubject);
      setMessage("Update scores successful!");
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  useEffect(() => {
    callGetClassrooms();
  }, []);

  const handleGetScores = (classroomSubject) => {
    callGetScores(classroomSubject);
  };

  const handleSaveScores = () => {
    callUpdateScores();
  };

  const handleScoreBlur = (event) => {
    console.log(event);
    const input = event.target;
    const value = input.value;
    if (value > 10) {
      input.value = 10;
    } else if (value < 0) {
      input.value = 0;
    }
  };

  const processRowUpdate = (newRow) => {
    const newScore = { ...newRow };
    changedMap.set(newScore.student.id, newScore.score);
    console.log(changedMap);
    return newScore;
  };

  const handleCloseMessageDialog = () => {
    setMessage(null);
  };

  const handleCloseErrorDialog = () => {
    setError(null);
  };

  ///////////////// BEGIN DEMO TABLE
  const scoreColumns = [
    { field: "student.id", headerName: "Student ID", flex: 1, valueGetter: (params) => params.row?.student.id },
    { field: "student.fullName", headerName: "Fullname", flex: 1, valueGetter: (params) => params.row?.student.fullName },
    {
      field: "score", headerName: "Score", flex: 1, editable: true, type: 'number', max: 10, min: 0,
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            max: 10,
            min: 0,
            onChange: handleScoreBlur
          }}
        />
      )
    },
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
              <ArgonTypography variant="h6">Scores table</ArgonTypography>
              <Autocomplete
                onChange={(event, newValue) => {
                  if (newValue) {
                    setSelectedClassroom(newValue);
                    // setSelectedClassroomSubject(null);
                    setScores([]);
                    changedMap.clear();
                  }
                }}
                disablePortal
                id="combo-box-demo"
                options={classrooms}
                sx={{ width: 300 }}
                getOptionLabel={option => `${option.id} | ${option.name}`}
                renderInput={(params) => <TextField {...params} />}
              />
              <Autocomplete
                key={selectedClassroomSubject}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setSelectedClassroomSubject(newValue);
                    setScores([]);
                    handleGetScores(newValue);
                    changedMap.clear();
                  }
                }}
                disablePortal
                id="secondAutocomplete"
                options={selectedClassroom ? selectedClassroom.classroomSubjects : []}
                sx={{ width: 300 }}
                getOptionLabel={option => `${option.subject.name}`}
                renderInput={(params) => <TextField {...params} />}
              />
              { scores.length > 0 ? <Button onClick={handleSaveScores}>Save</Button> : <></>}
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
                  columns={scoreColumns}
                  rows={scores}
                  getRowId={(row) => {
                    return `${row.student.id}|${row.classroom.id}`
                  }}
                  processRowUpdate={processRowUpdate}
                // onRowClick={handleTeacherClicked} {...classrooms}
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
        message ? <Dialog
          open={message}
          onClose={handleCloseMessageDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Notification"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMessageDialog} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog> : <></>
      }
      <Footer />
    </DashboardLayout>
  );
}

export default ScoresTable;
