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

function SubjectsTable() {
  const [error, setError] = React.useState();
  const [subjects, setSubjects] = React.useState([]);
  const [files, setFiles] = React.useState([]);
  const [showCreateSubjectDialog, setShowCreateSubjectDialog] = React.useState();
  const [selectedSubject, setSelectedSubject] = React.useState();

  const callGetSubjects = async () => {
    try {
      const response = await apiHelper().get(`/subjects`);
      const subjects = response.data;
      setSubjects(subjects);
    } catch (e) {
      setError(e.response.data.message);
    } finally {
      handleCloseCreateSubjectPopup();
      handleCloseUpdateSubjectPopup();
    }
  };

  const callCreateSubject = async (data) => {
    try {
      await apiHelper().post("/subjects/create", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      callGetSubjects();
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  const callUpdateSubject = async (data) => {
    try {
      await apiHelper().put("/subjects/update", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      callGetSubjects();
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  const callDeleteSubject = async (id) => {
    try {
      await apiHelper().delete(`/subjects/delete?subjectId=${id}`);
      setSelectedSubject(null);
      callGetSubjects();
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  useEffect(() => {
    callGetSubjects();
  }, []);

  const onFilesSelected = (e) => {
    const newFiles = e.target.files;
    console.log(newFiles);
    const distinctFiles = []
    Array.from(newFiles).forEach((item) => {
      if (!files.includes(item)) distinctFiles.push(item);
    });
    setFiles([...files, ...distinctFiles]);
  };

  const onFilesSelectedForUpdate = (e) => {
    const subject = { ...selectedSubject };
    Array.from(e.target.files).forEach((file) => {
      const url = URL.createObjectURL(file)
      const newFile = {
        id: url,
        name: file.name,
        url: file,
        isLocal: true
      };
      subject.documents.push(newFile);
    });
    setSelectedSubject(subject);
  };

  const handleSubjectClicked = (params) => {
    const subjectSelected = params.row;
    setSelectedSubject(subjectSelected);
  };

  const handleCloseCreateSubjectPopup = () => {
    setShowCreateSubjectDialog(false);
    setFiles([]);
  };

  const handleCloseUpdateSubjectPopup = () => {
    setSelectedSubject(null);
    setFiles([]);
  };

  const handleCreateSubject = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requestData = {
      name: data.get("name"),
      files: files
    };
    console.log("DATA::");
    console.log(requestData);

    callCreateSubject(requestData);
  };

  const handleUpdateSubject = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newFiles = selectedSubject.documents.filter((doc) => {
      return doc.isLocal
    });
    const existedDocs = selectedSubject.documents.filter((doc) => {
      return !doc.isLocal
    });
    const requestData = {
      subjectId: selectedSubject.id,
      changedDocuments: JSON.stringify(existedDocs),
      name: data.get("name"),
      files: newFiles.map((item) => {
        return item.url;
      })
    };
    console.log("DATA::");
    console.log(requestData);

    callUpdateSubject(requestData);
  };

  const handleDeleteSubject = () => {
    callDeleteSubject(selectedSubject.id);
  }

  const handleRemoveFileFromCreateList = (file) => {
    const filtered = [];
    Array.from(files).forEach((item) => {
      if (item != file) filtered.push(item);
    });
    setFiles(filtered);
  };

  const handleRemoveDocument = (document) => {
    const subject = { ...selectedSubject };
    subject.documents = Array.from(subject.documents).filter((doc) => {
      return doc.id != document.id;
    });
    setSelectedSubject(subject);
  };

  const handleCloseErrorDialog = () => {
    setError(null);
  };

  ///////////////// BEGIN DEMO TABLE
  const subjectColumns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Subject name", flex: 1 }
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
              <ArgonTypography variant="h6">Subjects table</ArgonTypography>
              <Autocomplete
                onChange={(event, newValue) => {
                  if (newValue) {
                    setSelectedSubject(newValue);
                  }
                }}
                disablePortal
                id="combo-box-demo"
                options={subjects}
                sx={{ width: 300 }}
                getOptionLabel={option => `${option.id} | ${option.name}`}
                renderInput={(params) => <TextField {...params} />}
              />
              <Button onClick={() => {
                setShowCreateSubjectDialog(true);
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
                  columns={subjectColumns}
                  rows={subjects}
                  onRowClick={handleSubjectClicked} {...subjects}
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
        // Create subject dialog
        showCreateSubjectDialog ? <Dialog
          fullWidth
          open={showCreateSubjectDialog}
          // TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseCreateSubjectPopup}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Create new subject"}</DialogTitle>
          <Box component="form" onSubmit={handleCreateSubject}>
            <Box mx={2}>
              <Button component="label" variant="contained" startIcon={<CloudUploadRounded />}>
                Upload file
                <VisuallyHiddenInput type="file" multiple onChange={(e) => { onFilesSelected(e) }} />
              </Button>
            </Box>
            <Box mx={2}>
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {Array.from(files).map((file) => {
                  const labelId = `checkbox-list-label-${file.name}`;
                  return (
                    <ListItem
                      key={file.name}
                      secondaryAction={
                        <IconButton edge="end" aria-label="deletes" onClick={() => handleRemoveFileFromCreateList(file)}>
                          <GridDeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText id={labelId} primary={`${file.name}`} />
                    </ListItem>
                  );
                })}
              </List>
            </Box>
            <Box mx={2} my={1}>
              <Typography>Subject name</Typography>
              <TextField id="name" name="name" fullWidth />
            </Box>
            <DialogActions>
              <Button onClick={handleCloseCreateSubjectPopup}>Cancel</Button>
              <Button type="submit">Create</Button>
            </DialogActions>
          </Box>
        </Dialog> : <></>
      }
      {
        // Update subject dialog
        selectedSubject ? <Dialog
          fullWidth
          open={selectedSubject}
          // TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseUpdateSubjectPopup}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Update subject information"}</DialogTitle>
          <Box component="form" onSubmit={handleUpdateSubject}>
            <Box mx={2}>
              <Button component="label" variant="contained" startIcon={<CloudUploadRounded />}>
                Upload file
                <VisuallyHiddenInput type="file" multiple onChange={(e) => { onFilesSelectedForUpdate(e) }} />
              </Button>
            </Box>
            <Box mx={2}>
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {Array.from(selectedSubject.documents).map((document) => {
                  const labelId = `checkbox-list-label-${document.name}`;
                  return (
                    <ListItem
                      key={document.id}
                      secondaryAction={
                        <Box>
                          {document.isLocal ? <></> : <IconButton edge="end" aria-label="opens" onClick={
                            () => window.open(document.url, "_blank")
                          }>
                            <InfoIcon />
                          </IconButton>}
                          <IconButton edge="end" aria-label="deletes" onClick={() => handleRemoveDocument(document)}>
                            <GridDeleteIcon />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemText id={labelId} primary={`${document.name}`} />
                    </ListItem>
                  );
                })}
              </List>
            </Box>
            <Box mx={2} my={1}>
              <Typography>Subject name</Typography>
              <TextField id="name" name="name" fullWidth defaultValue={selectedSubject.name} />
            </Box>
            <DialogActions>
              <Button onClick={handleDeleteSubject}>Delete</Button>
              <Button onClick={handleCloseUpdateSubjectPopup}>Cancel</Button>
              <Button type="submit">Update</Button>
            </DialogActions>
          </Box>
        </Dialog> : <></>
      }
      <Footer />
    </DashboardLayout>
  );
}

export default SubjectsTable;
