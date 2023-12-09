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
import { DataGrid, GridEditInputCell, GridToolbar, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { useDemoData } from '@mui/x-data-grid-generator';
import { useNavigate } from "react-router-dom";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

function ScoresViewTable() {
  const changedMap = new Map();

  const [message, setMessage] = React.useState();
  const [error, setError] = React.useState();
  const [classrooms, setClassrooms] = React.useState([]);
  const [scores, setScores] = React.useState([]);
  const [selectedClassroom, setSelectedClassroom] = React.useState(null);
  const [selectedClassroomSubject, setSelectedClassroomSubject] = React.useState(null);
  const navigator = useNavigate();

  const callGetClassrooms = async () => {
    try {
      apiHelper().get(`/classrooms`).then((response) => {
        const classrooms = Array.from(response.data).filter((c) => {
          return c.registrationList.length > 0;
        });
        setClassrooms(classrooms);
        if (classrooms.length > 0) {
          const firstClassroom = classrooms[0];
          setSelectedClassroom(firstClassroom);
          setSelectedClassroomSubject(
            firstClassroom.classroomSubjects.length > 0 ? firstClassroom.classroomSubjects[0] : null
          );
        }
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

  const callGetScores = async (classroomSubject) => {
    try {
      const requestData = {
        classroomId: selectedClassroom.id,
        subjectId: classroomSubject.subject.id
      };
      apiHelper().post(`/scores`, requestData).then((response) => {
        const scores = response.data;
        setScores(scores);
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

  const callUpdateScores = async () => {
    try {
      const requestData = {
        classroomId: selectedClassroom.id,
        subjectId: selectedClassroomSubject.subject.id,
        scores: Object.fromEntries(changedMap)
      };
      console.log(requestData);
      apiHelper().post(`/scores/update`, requestData).then((response) => {
        changedMap.clear();
        callGetScores(selectedClassroomSubject);
        setMessage("Update scores successful!");
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
    const input = event.target;
    const value = input.value;
    const reg = new RegExp('^[0-9]+$');
    if (value > 10) {
      input.value = 10;
    } else if (!reg.test(value) || value < 0) {
      input.value = 0;
    }
  };

  const processRowUpdate = (newRow) => {
    const newScore = { ...newRow };
    changedMap.set(newScore.student.id, {
      score1: newScore.score1,
      score2: newScore.score2,
      score3: newScore.score3
    });
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
      field: "score1", headerName: "Score 1", flex: 1, editable: false, type: 'number', max: 10, min: 0,
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
    {
      field: "score2", headerName: "Score 2", flex: 1, editable: false, type: 'number', max: 10, min: 0,
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
    {
      field: "score3", headerName: "Score 3", flex: 1, editable: false, type: 'number', max: 10, min: 0,
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
    {
      field: "average", headerName: "Avg", flex: 1, editable: false, type: 'number', max: 10, min: 0, valueGetter: (params) => calculateAvg(params.row),
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            max: 10,
            min: 0,
          }}
        />
      )
    },
  ]

  const calculateAvg = (scores) => {
    const a = scores.score1 * (scores.classroom.rate1 / 100);
    const b = scores.score2 * (scores.classroom.rate2 / 100);
    const c = scores.score3 * (scores.classroom.rate3 / 100);
    return a + b + c;
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
              <ArgonTypography variant="h6">Score list of classroom subject</ArgonTypography>
              <Autocomplete
                defaultValue={selectedClassroom}
                value={selectedClassroom}
                onChange={(event, newValue) => {
                  setSelectedClassroom(newValue);
                  setSelectedClassroomSubject(null);
                  setScores([]);
                  changedMap.clear();
                }}
                disablePortal
                id="combo-box-demo"
                options={classrooms}
                sx={{ width: 300 }}
                getOptionLabel={option => `${option.id} | ${option.name}`}
                renderInput={(params) => <TextField {...params} placeholder="Select classroom" />}
              />
              <Autocomplete
                defaultValue={selectedClassroomSubject}
                value={selectedClassroomSubject}
                onChange={(event, newValue) => {
                  setSelectedClassroomSubject(newValue);
                  setScores([]);
                  changedMap.clear();
                  if (newValue) {
                    handleGetScores(newValue);
                  }
                }}
                disablePortal
                id="secondAutocomplete"
                options={selectedClassroom ? selectedClassroom.classroomSubjects : []}
                sx={{ width: 300 }}
                getOptionLabel={option => `${option.subject.name}`}
                renderInput={(params) => <TextField {...params} placeholder="Select subject" />}
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
                  columns={scoreColumns}
                  rows={scores}
                  getRowId={(row) => {
                    return `${row.student.id}|${row.classroom.id}`
                  }}
                  processRowUpdate={processRowUpdate}
                  slots={{ toolbar: CustomToolbar }}
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

export default ScoresViewTable;
