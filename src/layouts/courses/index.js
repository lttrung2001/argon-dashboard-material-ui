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
import apiHelper, { MESSAGE_INVALID_TOKEN, SERVICE_UNAVAILABLE } from "../../utils/Axios";
import { Autocomplete, Box, Button, CardMedia, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, FormControlLabel, Grid, Input, InputLabel, List, ListItemButton, ListItemIcon, ListItemText, MenuItem, Paper, Radio, RadioGroup, Select, TextField, Typography, selectClasses } from "@mui/material";
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
import ConfirmDeleteData from "utils/ConfirmDeleteData";
import { useNavigate } from "react-router-dom";

export const handleTextFieldNumberChange = (event) => {
  const input = event.target;
  const value = input.value;
  const reg = new RegExp('^[0-9]+$');
  if (value === "") {
    input.value = "";
  } else if (!reg.test(value) || value < 0) {
    input.value = 0;
  } 
};

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
  const [confirm, setConfirm] = React.useState();
  const [confirmDelete, setConfirmDelete] = React.useState();

  const [originOpenCourses, setOriginOpenCourses] = React.useState([]);
  const [openCourses, setOpenCourses] = React.useState([]);
  const [originCourses, setOriginCourses] = React.useState([]);
  const [originClassrooms, setOriginClassrooms] = React.useState([]);
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

  const navigator = useNavigate();

  const callGetCourses = async () => {
    try {
      apiHelper().get("/courses").then((response) => {
        const courses = response.data;
        setOriginCourses(courses);
        setCourses(courses);
        handleCloseCreateNewCoursePopup();
        handleCloseEditCoursePopup();
        setConfirmDelete(null);
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

  const callGetOpenCourses = async () => {
    try {
      apiHelper().get("/courses/open").then((response) => {
        const courses = response.data;
        setOriginOpenCourses(courses);
        setOpenCourses(courses);
        handleCloseCreateNewCoursePopup();
        handleCloseEditCoursePopup();
        setConfirmDelete(null);
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

  const callGetClassrooms = async () => {
    try {
      apiHelper().get("/classrooms").then((response) => {
        const classrooms = response.data;
        setOriginClassrooms(classrooms);
        setClassrooms(classrooms);
        handleCloseCreateNewClassroomPopup();
        handleCloseUpdateClassroomPopup();
        setConfirmDelete(null);
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

  const callCreateCourse = async (createCourseData) => {
    try {
      apiHelper().post("/courses/create", createCourseData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then((response) => {
        callGetCourses();
        setConfirm("Create course successfully!");
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

  const callEditCourse = async (editCourseData) => {
    try {
      apiHelper().put("/courses/update", editCourseData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then((response) => {
        callGetCourses();
        setConfirm("Update course successfully!");
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

  const callDeleteCourse = async (courseId) => {
    try {
      apiHelper().delete(`/courses/delete?courseId=${courseId}`).then((response) => {
        callGetCourses();
        setConfirm("Delete course successfully!");
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

  const callGetSubjects = async () => {
    try {
      apiHelper().get(`/subjects`).then((response) => {
        const subjects = response.data;
        setSubjects(subjects);
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

  const callGetTeachers = async () => {
    try {
      await apiHelper().get(`/teachers`).then((response) => {
        const teachers = response.data;
        setTeachers(teachers);
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

  const callCreateClassroom = async (createClassroomData) => {
    try {
      apiHelper().post("/classrooms/create", createClassroomData).then((response) => {
        callGetClassrooms();
        setCreateClassroomCourseSelected(null);
        setCreateClassroomTeacherSelected(null);
        setCreateClassroomStartDateSelected(null);
        setConfirm("Create classroom successfully!");
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

  const callUpdateClassroom = async (updateClassroomData) => {
    try {
      apiHelper().put("/classrooms/update", updateClassroomData).then((response) => {
        callGetClassrooms();
        setConfirm("Update classroom successfully!");
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

  const callDeleteClassroom = async (classroomId) => {
    try {
      apiHelper().delete(`/classrooms/delete?classroomId=${classroomId}`).then((response) => {
        callGetClassrooms();
        setConfirm("Delete classroom successfully!");
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
    callGetCourses();
    callGetOpenCourses();
    callGetClassrooms();
    callGetSubjects();
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

  const onCourseSelected = (course) => {
    setLeft(filterObjectsNotInListByProperty(subjects, course.subjects.map((value) => {
      return value.id;
    })));
    setRight(course.subjects);
  };

  const handleCloseCreateNewCoursePopup = () => {
    setShowCreateCoursePopup(false);
    setCreateCourseImage(null);
    handleAllLeft();
  };

  const handleCloseCreateNewClassroomPopup = () => {
    setShowCreateClassroomPopup(false);
    setCreateClassroomCourseSelected(null);
    setCreateClassroomTeacherSelected(null);
    setCreateClassroomStartDateSelected(null);
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

    callCreateCourse(createCourseData);
  };

  const handleCreateNewClassroom = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const createClassroomData = {
      courseId: createClassroomCourseSelected?.id,
      name: data.get("classroomName"),
      maxStudent: data.get("maxStudent"),
      minStudent: data.get("minStudent"),
      startDate: createClassroomStartDateSelected,
      teacherId: createClassroomTeacherSelected?.id
    };
    console.log("DATA::");
    console.log(createClassroomData);

    callCreateClassroom(createClassroomData);
  };

  const handleEditCourse = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const editCourseData = {
      id: selectedCourse.id,
      name: data.get("courseName"),
      trainingTime: data.get("trainingTime"),
      status: data.get("status"),
      tuition: data.get("tuition"),
      desc: data.get("description"),
      image: updateCourseImage ? updateCourseImage : null,
      subjectIdList: right.map((subject) => {
        return subject.id;
      })
    };
    console.log("DATA::");
    console.log(editCourseData);

    callEditCourse(editCourseData);
  };

  const handleUpdateClassroom = (event) => {
    event.preventDefault();
    if (!updateClassroomCourseSelected) {
      setError("Please select a course!");
      return
    } else if (!updateClassroomTeacherSelected) {
      setError("Please select a teacher!");
      return
    } else if (!updateClassroomStartDateSelected) {
      setError("Please choose start date!");
      return
    }
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

    callUpdateClassroom(updateClassroomData);
  };

  const handleDeleteClassroom = (classroom) => {
    setConfirmDelete(new ConfirmDeleteData(
      ACTION_DELETE_CLASSROOM,
      `Are you sure to delete classroom with name ${classroom.name}?`,
      classroom
    ));
  }

  const handleDeleteCourse = (course) => {
    setConfirmDelete(new ConfirmDeleteData(
      ACTION_DELETE_COURSE,
      `Are you sure to delete course with name ${course.name}?`,
      course
    ));
  };

  const handleCloseErrorDialog = () => {
    setError(null);
  };

  const handleCloseConfirmDialog = () => {
    setConfirm(null);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <ArgonBox mb={3}>
          <Card>
            <ArgonBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <ArgonTypography variant="h6">Course list</ArgonTypography>
              <TextField
                style={{
                  width: 500
                }}
                placeholder="Search course"
                onChange={(event) => {
                  const value = event.target.value;
                  if (value.length == 0) {
                    setCourses(originCourses);
                  } else {
                    setCourses(Array.from(originCourses).filter((course) => {
                      return String(course.id).includes(value) || String(course.name).includes(value);
                    }));
                  }
                }}
              />
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
                  info: <Course image={course.thumbnail} name={course.name} email="" />,
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
                          onCourseSelected(course);
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
                          handleDeleteCourse(course);
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
              <ArgonTypography variant="h6">Classroom list</ArgonTypography>
              <Box mr={2}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={courses.filter((c) => {
                  return c.classrooms.length > 0;
                })}
                sx={{ width: 300 }}
                onChange={(event, value) => {
                  if (value == null) {
                    setClassrooms(originClassrooms);
                  } else {
                    setClassrooms(Array.from(originClassrooms).filter((classroom) => {
                      return classroom.course.id == value.id;
                    }));
                  }
                }}
                getOptionLabel={option => `${option.id} | ${option.name}`}
                renderInput={(params) => <TextField {...params} placeholder="Filter by course" />}
              />
              </Box>
              <TextField
                style={{
                  width: 300
                }}
                placeholder="Search classroom"
                onChange={(event) => {
                  const value = event.target.value;
                  if (value.length == 0) {
                    setClassrooms(originClassrooms);
                  } else {
                    setClassrooms(Array.from(originClassrooms).filter((classroom) => {
                      return String(classroom.id).includes(value) || String(classroom.name).includes(value);
                    }));
                  }
                }}
              />
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
                      {dayjs(classroom.startDate).format("DD/MM/YYYY")}
                    </ArgonTypography>
                  ),
                  // status: (
                  //   <ArgonTypography variant="caption" color="text" fontWeight="medium">
                  //     Opening
                  //   </ArgonTypography>
                  // ),
                  studentPercent: <Completion value={Number((classroom.registrationList.length / classroom.maxStudent) * 100).toFixed(2)} color="info" />,
                  action:
                    <Box>
                      <ArgonTypography
                        onClick={() => {
                          // Handle edit classroom
                          setSelectedClassroom(classroom);
                          setUpdateClassroomCourseSelected(classroom.course);
                          setUpdateClassroomTeacherSelected(classroom.teacher);
                          setUpdateClassroomStartDateSelected(dayjs(classroom.startDate).format("DD/MM/YYYY"));
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
                          handleDeleteClassroom(classroom);
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
                Upload image
                <VisuallyHiddenInput type="file" accept="image/*" inputProps={{ accept: 'image/*' }} onChange={(e) => { onFileSelected(e) }} />
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
              <TextField id="trainingTime" name="trainingTime" fullWidth inputProps={{
            min: 1,
            maxLength: 2,
            onChange: handleTextFieldNumberChange
          }} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Tuition (VND)</Typography>
              <TextField id="tuition" name="tuition" fullWidth inputProps={{
            min: 0,
            onChange: handleTextFieldNumberChange
          }} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Description</Typography>
              <TextField id="description" name="description" fullWidth />
            </Box>
            <Typography mx={2}>Subject list</Typography>
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
              <Button type="submit">Create</Button>
              <Button onClick={handleCloseCreateNewCoursePopup}>Cancel</Button>

            </DialogActions>
          </Box>
        </Dialog> : <></>
      }
      {
        // Update course dialog
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
                Upload image
                <VisuallyHiddenInput type="file" inputProps={{ accept: 'image/*' }} onChange={(e) => { onUpdateCourseFileSelected(e) }} />
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
              <Typography>Course name</Typography>
              <TextField id="courseName" name="courseName" fullWidth defaultValue={selectedCourse.name} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Training time (months)</Typography>
              <TextField id="trainingTime" name="trainingTime" fullWidth defaultValue={selectedCourse.trainingTime} inputProps={{
            min: 1,
          }} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Tuition (VND)</Typography>
              <TextField id="tuition" name="tuition" fullWidth defaultValue={selectedCourse.tuition} inputProps={{
            min: 0,
          }} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Description</Typography>
              <TextField id="description" name="description" fullWidth defaultValue={selectedCourse.desc} />
            </Box>
            <Box mx={2}>
              <Typography>Status</Typography>
            </Box>
            <Box mx={3.5} my={1}>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="status"
                defaultValue={selectedCourse.status}
              >
                <FormControlLabel value={true} control={<Radio />} label="Open" />
                <FormControlLabel value={false} control={<Radio />} label="Close" />
              </RadioGroup>
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
              <Button type="submit">Edit</Button>
              <Button onClick={() => {
                handleDeleteCourse(selectedCourse);
              }}>Delete</Button>
              <Button onClick={handleCloseEditCoursePopup}>Cancel</Button>

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
                options={openCourses}
                sx={{ width: 300 }}
                getOptionLabel={option => `${option.id} | ${option.name}`}
                renderInput={(params) => <TextField {...params} placeholder="Select course" />}
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
                getOptionLabel={option => `${option.id} | ${option.fullName}`}
                renderInput={(params) => <TextField {...params} placeholder="Select teacher" />}
              />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Classroom name</Typography>
              <TextField id="classroomName" name="classroomName" fullWidth />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Max student</Typography>
              <TextField id="maxStudent" name="maxStudent" fullWidth inputProps={{
            min: 0,
            maxLength: 3,
            onChange: handleTextFieldNumberChange
          }} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Min student</Typography>
              <TextField id="minStudent" name="minStudent" fullWidth inputProps={{
            min: 0,
            maxLength: 3,
            onChange: handleTextFieldNumberChange
          }} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Start date</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    disablePast
                    format="DD/MM/YYYY"
                    onAccept={(newDate) => {
                      setCreateClassroomStartDateSelected(dayjs(newDate).format("DD/MM/YYYY"));
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Box>
            <DialogActions>
              <Button type="submit">Create</Button>
              <Button onClick={handleCloseCreateNewClassroomPopup}>Cancel</Button>

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
          <DialogTitle>{"Update classroom"}</DialogTitle>
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
                options={openCourses}
                sx={{ width: 300 }}
                getOptionLabel={option => `${option.id} | ${option.name}`}
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
                getOptionLabel={option => `${option.id} | ${option.fullName}`}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Classroom name</Typography>
              <TextField id="classroomName" name="classroomName" fullWidth defaultValue={selectedClassroom.name} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Max student</Typography>
              <TextField id="maxStudent" name="maxStudent" fullWidth defaultValue={selectedClassroom.maxStudent} inputProps={{
            min: 0,
            maxLength: 3,
            handleTextFieldNumberChange
          }} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Min student</Typography>
              <TextField id="minStudent" name="minStudent" fullWidth defaultValue={selectedClassroom.minStudent} inputProps={{
            min: 0,
            maxLength: 3,
            onChange: handleTextFieldNumberChange
          }} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Start date</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                  disablePast
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
              <Button type="submit">Update</Button>
              <Button onClick={() => {
                handleDeleteClassroom(selectedClassroom);
              }}>Delete</Button>
              <Button onClick={handleCloseUpdateClassroomPopup}>Cancel</Button>

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
              if (confirmDelete.action == ACTION_DELETE_COURSE) {
                console.log(confirmDelete.data);
                callDeleteCourse(confirmDelete.data.id);
              } else if (confirmDelete.action == ACTION_DELETE_CLASSROOM) {
                callDeleteClassroom(confirmDelete.data.id)
              }
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

export default CoursesTable;

const ACTION_DELETE_COURSE = "ACTION_DELETE_COURSE";
const ACTION_DELETE_CLASSROOM = "ACTION_DELETE_CLASSROOM";