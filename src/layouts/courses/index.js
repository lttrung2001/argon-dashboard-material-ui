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
import Table from "examples/Tables/Table";

// Data
import coursesTableData from "layouts/courses/data/coursesTableData";
import classroomsTableData from "layouts/courses/data/classroomsTableData";
import React, { useEffect, useState } from "react";
import apiHelper from "../../utils/Axios";
import { Autocomplete, Box, Button, CardMedia, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, Grid, Input, InputLabel, List, ListItemButton, ListItemIcon, ListItemText, MenuItem, Paper, Select, TextField, Typography, selectClasses } from "@mui/material";
import { DialogTitle } from '@mui/material';
import { CloudUploadRounded } from "@mui/icons-material";
import { VisuallyHiddenInput } from "components/UploadFileButton";
import { Course, Function } from "./data/coursesTableData";
import ArgonBadge from "components/ArgonBadge";
import { Completion } from "./data/classroomsTableData";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

function CoursesTable() {
  //////////////////////////////////////// BEGIN TRANSFER LIST ////////////////////////////////////////
  function filterObjectsNotInListByProperty(arrOfObjects, listOfIds) {
    return arrOfObjects.filter(obj => !listOfIds.includes(obj.id));
  }

  function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
  }

  function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
  }

  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  const customList = (subjects) => (
    <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
      <List dense component="div" role="list">
        {subjects.map((value) => {
          const labelId = `transfer-list-item-${value.id}-label`;

          return (
            <ListItemButton
              key={value.id}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.name} />
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );
  //////////////////////////////////////// END TRANSFER LIST ////////////////////////////////////////

  //////////////////////////////////////// BEGIN COMBOBOX SELECT COURSE TO CREATE NEW CLASSROOM ////////////////////////////////////////
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  //////////////////////////////////////// END COMBOBOX SELECT COURSE TO CREATE NEW CLASSROOM ////////////////////////////////////////

  const { columns } = coursesTableData;
  const { columns: prCols } = classroomsTableData;

  const [error, setError] = React.useState();

  const [courses, setCourses] = React.useState([]);
  const [classrooms, setClassrooms] = React.useState([]);
  const [subjects, setSubjects] = React.useState([]);
  const [teachers, setTeachers] = React.useState([]);

  const [createCourseImage, setCreateCourseImage] = React.useState();
  const [updateCourseImage, setUpdateCourseImage] = React.useState();

  const [showCreateCoursePopup, setShowCreateCoursePopup] = React.useState(false);
  const [showCreateClassroomPopup, setShowCreateClassroomPopup] = React.useState(false);

  const [selectedCourse, setSelectedCourse] = React.useState();
  const [selectedClassroom, setSelectedClassroom] = React.useState();

  const [createClassroomCourseSelected, setCreateClassroomCourseSelected] = React.useState();
  const [createClassroomTeacherSelected, setCreateClassroomTeacherSelected] = React.useState();
  const [createClassroomStartDateSelected, setCreateClassroomStartDateSelected] = React.useState();

  const [updateClassroomCourseSelected, setUpdateClassroomCourseSelected] = React.useState();
  const [updateClassroomTeacherSelected, setUpdateClassroomTeacherSelected] = React.useState();
  const [updateClassroomStartDateSelected, setUpdateClassroomStartDateSelected] = React.useState();

  const callGetCourses = async () => {
    try {
      const response = await apiHelper().get("/courses");
      const courses = response.data;
      setCourses(courses);
    } catch (e) {
      setError(e);
    }
  };

  const callGetClassrooms = async () => {
    try {
      const response = await apiHelper().get("/classrooms");
      const classrooms = response.data;
      setClassrooms(classrooms);
    } catch (e) {
      setError(e);
    }
  };

  const callCreateCourse = async (createCourseData) => {
    try {
      await apiHelper().post("/courses/create", createCourseData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      callGetCourses();
    } catch (e) {
      setError(e);
    }
  };

  const callEditCourse = async (editCourseData) => {
    try {
      await apiHelper().put("/courses/update", editCourseData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      callGetCourses();
    } catch (e) {
      setError(e);
    }
  };

  const callDeleteCourse = async (courseId) => {
    try {
      await apiHelper().delete(`/courses/delete?courseId=${courseId}`);
      callGetCourses();
    } catch (e) {

    }
  };

  const callGetSubjects = async () => {
    try {
      const response = await apiHelper().get(`/subjects`);
      const subjects = response.data;
      setSubjects(subjects);
    } catch (e) {
      setError(e);
    }
  };

  const callGetTeachers = async () => {
    try {
      const response = await apiHelper().get(`/teachers`);
      const teachers = response.data;
      setTeachers(teachers);
    } catch (e) {
      setError(e);
    }
  };

  const callCreateClassroom = async (createClassroomData) => {
    try {
      await apiHelper().post("/classrooms/create", createClassroomData);
      callGetClassrooms();
    } catch (e) {
      setError(e);
    }
  };

  const callUpdateClassroom = async (updateClassroomData) => {
    try {
      await apiHelper().put("/classrooms/update", updateClassroomData);
      callGetClassrooms();
    } catch (e) {
      setError(e);
    }
  };

  const callDeleteClassroom = async (classroomId) => {
    try {
      await apiHelper().delete(`/classrooms/delete?classroomId=${classroomId}`);
      callGetClassrooms();
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    callGetCourses();
  }, []);

  useEffect(() => {
    callGetClassrooms();
  }, []);

  useEffect(() => {
    callGetSubjects();
  }, []);

  useEffect(() => {
    callGetTeachers();
  }, []);

  const onCreateNewCourseClicked = () => {
    setShowCreateCoursePopup(true);
    setLeft(subjects);
    setRight([]);
  };

  const onCreateNewClassroomClicked = () => {
    setShowCreateClassroomPopup(true);
  };

  const onFileSelected = (e) => {
    setCreateCourseImage(e.target.files[0]);
  };

  const onUpdateCourseFileSelected = (e) => {
    setUpdateCourseImage(e.target.files[0]);
  };

  const handleCloseCreateNewCoursePopup = () => {
    setShowCreateCoursePopup(false);
    setCreateCourseImage(null);
    handleAllLeft();
  };

  const handleCloseCreateNewClassroomPopup = () => {
    setShowCreateClassroomPopup(false);
  };

  const handleCloseEditCoursePopup = () => {
    setSelectedCourse(null);
    setUpdateCourseImage(null);
  };

  const handleCloseUpdateClassroomPopup = () => {
    setSelectedClassroom(null);
  };

  const handleCreateNewCourse = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const createCourseData = {
      name: data.get("courseName"),
      trainingTime: data.get("trainingTime"),
      tuition: data.get("tuition"),
      desc: data.get("description"),
      image: createCourseImage,
      subjectIdList: right.map((subject) => {
        return subject.id;
      })
    };
    console.log("DATA::");
    console.log(createCourseData);

    handleCloseCreateNewCoursePopup();
    callCreateCourse(createCourseData);
  };

  const handleCreateNewClassroom = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const createClassroomData = {
      courseId: createClassroomCourseSelected.id,
      name: data.get("classroomName"),
      maxStudent: data.get("maxStudent"),
      minStudent: data.get("minStudent"),
      startDate: createClassroomStartDateSelected,
      teacherId: createClassroomTeacherSelected.id
    };
    console.log("DATA::");
    console.log(createClassroomData);

    handleCloseCreateNewClassroomPopup();
    callCreateClassroom(createClassroomData);
  };

  const handleEditCourse = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const editCourseData = {
      id: data.get("courseId"),
      name: data.get("courseName"),
      trainingTime: data.get("trainingTime"),
      tuition: data.get("tuition"),
      desc: data.get("description"),
      image: updateCourseImage ? updateCourseImage : null,
      subjectIdList: right.map((subject) => {
        return subject.id;
      })
    };
    console.log("DATA::");
    console.log(editCourseData);

    handleCloseEditCoursePopup();
    callEditCourse(editCourseData);
  };

  const handleUpdateClassroom = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const updateClassroomData = {
      classroomId: selectedClassroom.id,
      classroomName: data.get("classroomName"),
      maxStudent: data.get("maxStudent"),
      minStudent: data.get("minStudent"),
      startDate: updateClassroomStartDateSelected,
      courseId: updateClassroomCourseSelected.id,
      teacherId: updateClassroomTeacherSelected.id
    };
    console.log("DATA::");
    console.log(updateClassroomData);

    handleCloseUpdateClassroomPopup();
    callUpdateClassroom(updateClassroomData);
  };

  const handleCloseErrorDialog = () => {
    setError(null);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <ArgonBox mb={3}>
          <Card>
            <ArgonBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <ArgonTypography variant="h6">Courses table</ArgonTypography>
              <Button onClick={onCreateNewCourseClicked}>Create</Button>
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
              <Table columns={columns} rows={courses.map((course) => {
                return {
                  info: <Course image={course.thumbnail} name={course.name} email="john@creative-tim.com" />,
                  tuition: <Function job={course.tuition + " VND"} org="For student" />,
                  status: (
                    <ArgonBadge variant="gradient" badgeContent={course.status ? "Opening" : "Closed"} color={course.status ? "success" : "error"} size="xs" container />
                  ),
                  trainingTime: (
                    <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                      {course.trainingTime} months
                    </ArgonTypography>
                  ),
                  action: (
                    <Box>
                      <ArgonTypography
                        onClick={() => {
                          // Handle edit course
                          setSelectedCourse(course);
                          setLeft(filterObjectsNotInListByProperty(subjects, course.subjects.map((value) => {
                            return value.id;
                          })));
                          setRight(course.subjects);
                        }}
                        marginRight={1}
                        component="a"
                        href="#"
                        variant="caption"
                        color="secondary"
                        fontWeight="medium"
                      >
                        Edit
                      </ArgonTypography>
                      <ArgonTypography
                        onClick={() => {
                          // Handle delete course
                          callDeleteCourse(course.id);
                        }}
                        component="a"
                        href="#"
                        variant="caption"
                        color="secondary"
                        fontWeight="medium"
                      >
                        Delete
                      </ArgonTypography>
                    </Box>
                  ),
                };
              })} />
            </ArgonBox>
          </Card>
        </ArgonBox>
        <ArgonBox mb={3}>
          <Card>
            <ArgonBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <ArgonTypography variant="h6">Classrooms table</ArgonTypography>
              <Button onClick={onCreateNewClassroomClicked}>Create</Button>
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
              <Table columns={prCols} rows={classrooms.map((classroom) => {
                return {
                  name: [classroom.course.thumbnail, classroom.name],
                  startDate: (
                    <ArgonTypography variant="button" color="text" fontWeight="medium">
                      {classroom.startDate}
                    </ArgonTypography>
                  ),
                  status: (
                    <ArgonTypography variant="caption" color="text" fontWeight="medium">
                      Opening
                    </ArgonTypography>
                  ),
                  studentPercent: <Completion value={(classroom.registrationList.length / classroom.maxStudent) * 100} color="info" />,
                  action:
                    <Box>
                      <ArgonTypography
                        onClick={() => {
                          // Handle edit classroom
                          setSelectedClassroom(classroom);
                          setUpdateClassroomCourseSelected(classroom.course);
                          setUpdateClassroomTeacherSelected(classroom.teacher);
                          setUpdateClassroomStartDateSelected(classroom.startDate);
                        }}
                        marginRight={1}
                        component="a"
                        href="#"
                        variant="caption"
                        color="secondary"
                        fontWeight="medium"
                      >
                        Edit
                      </ArgonTypography>
                      <ArgonTypography
                        onClick={() => {
                          // Handle delete classroom
                          callDeleteClassroom(classroom.id);
                        }}
                        component="a"
                        href="#"
                        variant="caption"
                        color="secondary"
                        fontWeight="medium"
                      >
                        Delete
                      </ArgonTypography>
                    </Box>
                }
              })} />
            </ArgonBox>
          </Card>
        </ArgonBox>
      </ArgonBox>
      {
        // Create new course dialog
        showCreateCoursePopup ? <Dialog
          fullWidth
          open={showCreateCoursePopup}
          // TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseCreateNewCoursePopup}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Create new course"}</DialogTitle>
          <Box component="form" onSubmit={handleCreateNewCourse}>
            <Box mx={2}>
              <Button component="label" variant="contained" startIcon={<CloudUploadRounded />}>
                Upload file
                <VisuallyHiddenInput type="file" onChange={(e) => { onFileSelected(e) }} />
              </Button>
            </Box>
            {
              createCourseImage ? <CardMedia
                component="img"
                alt="green iguana"
                height={200}
                image={URL.createObjectURL(createCourseImage)}
              /> : <></>
            }
            <Box mx={2} my={1}>
              <Typography>Course name</Typography>
              <TextField id="courseName" name="courseName" fullWidth />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Training time (months)</Typography>
              <TextField id="trainingTime" name="trainingTime" fullWidth />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Tuition (VND)</Typography>
              <TextField id="tuition" name="tuition" fullWidth />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Description</Typography>
              <TextField id="description" name="description" fullWidth />
            </Box>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item>{customList(left)}</Grid>
              <Grid item>
                <Grid container direction="column" alignItems="center">
                  <Button
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={handleAllRight}
                    disabled={left.length === 0}
                    aria-label="move all right"
                  >
                    ≫
                  </Button>
                  <Button
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={handleCheckedRight}
                    disabled={leftChecked.length === 0}
                    aria-label="move selected right"
                  >
                    &gt;
                  </Button>
                  <Button
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={handleCheckedLeft}
                    disabled={rightChecked.length === 0}
                    aria-label="move selected left"
                  >
                    &lt;
                  </Button>
                  <Button
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={handleAllLeft}
                    disabled={right.length === 0}
                    aria-label="move all left"
                  >
                    ≪
                  </Button>
                </Grid>
              </Grid>
              <Grid item>{customList(right)}</Grid>
            </Grid>
            <DialogActions>
              <Button onClick={handleCloseCreateNewCoursePopup}>Cancel</Button>
              <Button type="submit">Create</Button>
            </DialogActions>
          </Box>
        </Dialog> : <></>
      }
      {
        // Create new course dialog
        selectedCourse ? <Dialog
          fullWidth
          open={selectedCourse}
          // TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseEditCoursePopup}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Edit course"}</DialogTitle>
          <Box component="form" onSubmit={handleEditCourse}>
            <Box mx={2}>
              <Button component="label" variant="contained" startIcon={<CloudUploadRounded />}>
                Upload file
                <VisuallyHiddenInput type="file" onChange={(e) => { onUpdateCourseFileSelected(e) }} />
              </Button>
            </Box>
            {
              selectedCourse ? <CardMedia
                component="img"
                alt="green iguana"
                height={200}
                image={updateCourseImage ? URL.createObjectURL(updateCourseImage) : selectedCourse.thumbnail}
              /> : <></>
            }
            <Box mx={2} my={1}>
              <Typography>Id</Typography>
              <TextField id="courseId" name="courseId" fullWidth defaultValue={selectedCourse.id} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Course name</Typography>
              <TextField id="courseName" name="courseName" fullWidth defaultValue={selectedCourse.name} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Training time (months)</Typography>
              <TextField id="trainingTime" name="trainingTime" fullWidth defaultValue={selectedCourse.trainingTime} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Tuition (VND)</Typography>
              <TextField id="tuition" name="tuition" fullWidth defaultValue={selectedCourse.tuition} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Description</Typography>
              <TextField id="description" name="description" fullWidth defaultValue={selectedCourse.desc} />
            </Box>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item>{customList(left)}</Grid>
              <Grid item>
                <Grid container direction="column" alignItems="center">
                  <Button
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={handleAllRight}
                    disabled={left.length === 0}
                    aria-label="move all right"
                  >
                    ≫
                  </Button>
                  <Button
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={handleCheckedRight}
                    disabled={leftChecked.length === 0}
                    aria-label="move selected right"
                  >
                    &gt;
                  </Button>
                  <Button
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={handleCheckedLeft}
                    disabled={rightChecked.length === 0}
                    aria-label="move selected left"
                  >
                    &lt;
                  </Button>
                  <Button
                    sx={{ my: 0.5 }}
                    variant="outlined"
                    size="small"
                    onClick={handleAllLeft}
                    disabled={right.length === 0}
                    aria-label="move all left"
                  >
                    ≪
                  </Button>
                </Grid>
              </Grid>
              <Grid item>{customList(right)}</Grid>
            </Grid>
            <DialogActions>
              <Button onClick={handleCloseEditCoursePopup}>Cancel</Button>
              <Button type="submit">Edit</Button>
            </DialogActions>
          </Box>
        </Dialog> : <></>
      }

      {
        // Create new classroom dialog
        showCreateClassroomPopup ? <Dialog
          fullWidth
          open={showCreateClassroomPopup}
          // TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseCreateNewClassroomPopup}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Create new clasroom"}</DialogTitle>
          <Box component="form" onSubmit={handleCreateNewClassroom}>
            <Box mx={2} my={1}>
              <Typography>Course</Typography>
              <Autocomplete
                onChange={(event, newValue) => {
                  setCreateClassroomCourseSelected(newValue);
                }}
                disablePortal
                id="combo-box-demo"
                options={courses}
                sx={{ width: 300 }}
                getOptionLabel={option => option.name}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Teacher</Typography>
              <Autocomplete
                onChange={(event, newValue) => {
                  setCreateClassroomTeacherSelected(newValue);
                }}
                disablePortal
                id="combo-box-demo"
                options={teachers}
                sx={{ width: 300 }}
                getOptionLabel={option => option.fullName}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Classroom name</Typography>
              <TextField id="classroomName" name="classroomName" fullWidth />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Max student</Typography>
              <TextField id="maxStudent" name="maxStudent" fullWidth />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Min student</Typography>
              <TextField id="minStudent" name="minStudent" fullWidth />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Start date</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    format="DD/MM/YYYY"
                    onAccept={(newDate) => {
                      setCreateClassroomStartDateSelected(dayjs(newDate).format("DD/MM/YYYY"));
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Box>
            <DialogActions>
              <Button onClick={handleCloseCreateNewClassroomPopup}>Cancel</Button>
              <Button type="submit">Create</Button>
            </DialogActions>
          </Box>
        </Dialog> : <></>
      }
      {
        // Update classroom dialog
        selectedClassroom ? <Dialog
          fullWidth
          open={selectedClassroom}
          // TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseUpdateClassroomPopup}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Update clasroom"}</DialogTitle>
          <Box component="form" onSubmit={handleUpdateClassroom}>
            <Box mx={2} my={1}>
              <Typography>Course</Typography>
              <Autocomplete
                onChange={(event, newValue) => {
                  setUpdateClassroomCourseSelected(newValue);
                }}
                defaultValue={selectedClassroom.course}
                disablePortal
                id="combo-box-demo"
                options={courses}
                sx={{ width: 300 }}
                getOptionLabel={option => option.name}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Teacher</Typography>
              <Autocomplete
                onChange={(event, newValue) => {
                  setUpdateClassroomTeacherSelected(newValue);
                }}
                defaultValue={selectedClassroom.teacher}
                disablePortal
                id="combo-box-demo"
                options={teachers}
                sx={{ width: 300 }}
                getOptionLabel={option => option.fullName}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Classroom name</Typography>
              <TextField id="classroomName" name="classroomName" fullWidth defaultValue={selectedClassroom.name} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Max student</Typography>
              <TextField id="maxStudent" name="maxStudent" fullWidth defaultValue={selectedClassroom.maxStudent} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Min student</Typography>
              <TextField id="minStudent" name="minStudent" fullWidth defaultValue={selectedClassroom.minStudent} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Start date</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    format="DD/MM/YYYY"
                    onAccept={(newDate) => {
                      setUpdateClassroomStartDateSelected(dayjs(newDate).format("DD/MM/YYYY"));
                    }}
                    defaultValue={dayjs(selectedClassroom.startDate)}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Box>
            <DialogActions>
              <Button onClick={handleCloseUpdateClassroomPopup}>Cancel</Button>
              <Button type="submit">Update</Button>
            </DialogActions>
          </Box>
        </Dialog> : <></>
      }

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

      <Footer />
    </DashboardLayout>
  );
}

export default CoursesTable;
