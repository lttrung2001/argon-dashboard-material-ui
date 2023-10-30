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
import coursesTableData from "layouts/tables/data/coursesTableData";
import classroomsTableData, { mapClassroomToView } from "layouts/tables/data/classroomsTableData";
import React, { useEffect, useState } from "react";
import apiHelper from "../../utils/Axios";
import { Box, Button, CardMedia, Dialog, DialogActions, Input, TextField, Typography } from "@mui/material";
import { DialogTitle } from '@mui/material';
import { CloudUploadRounded } from "@mui/icons-material";
import { VisuallyHiddenInput } from "components/UploadFileButton";
import { Course, Function } from "./data/coursesTableData";
import ArgonBadge from "components/ArgonBadge";
import { Completion } from "./data/classroomsTableData";

function Tables() {
  const { columns } = coursesTableData;
  const { columns: prCols } = classroomsTableData;
  const [courses, setCourses] = React.useState([]);
  const [classrooms, setClassrooms] = React.useState([]);
  const [createCourseImage, setCreateCourseImage] = React.useState();
  const [showCreateCoursePopup, setShowCreateCoursePopup] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState();

  const callGetCourses = async () => {
    const response = await apiHelper().get("/courses");
    const courses = response.data;
    setCourses(courses);
  };

  const callGetClassrooms = async () => {
    const response = await apiHelper().get("/classrooms");
    const classrooms = response.data;
    setClassrooms(classrooms);
  };

  const callCreateCourse = async (createCourseData) => {
    await apiHelper().post("/courses/create", createCourseData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    callGetCourses();
  };

  const callEditCourse = async (editCourseData) => {
    await apiHelper().put("/courses/update", editCourseData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    callGetCourses();
  }

  const callDeleteCourse = async (courseId) => {
    await apiHelper().delete(`/courses/delete?courseId=${courseId}`);
    callGetCourses();
  }

  useEffect(() => {
    callGetCourses();
  }, []);

  useEffect(() => {
    callGetClassrooms();
  }, []);

  const onCreateNewCourseClicked = () => {
    // Handle later
    setShowCreateCoursePopup(true);
  };

  const onCreateNewClassroomClicked = () => {
    // Handle later
  };

  const onFileSelected = (e) => {
    setCreateCourseImage(e.target.files[0]);
  }

  const handleCloseCreateNewCoursePopup = () => {
    setShowCreateCoursePopup(false);
    setCreateCourseImage(null);
  };

  const handleCloseEditCoursePopup = () => {
    setSelectedCourse(null);
    setCreateCourseImage(null);
  };

  const handleCreateNewCourse = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const createCourseData = {
      name: data.get("courseName"),
      trainingTime: data.get("trainingTime"),
      tuition: data.get("tuition"),
      desc: data.get("description"),
      image: createCourseImage
    }
    console.log("DATA::");
    console.log(createCourseData);

    handleCloseCreateNewCoursePopup();
    callCreateCourse(createCourseData);
  }

  const handleEditCourse = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const editCourseData = {
      id: data.get("courseId"),
      name: data.get("courseName"),
      trainingTime: data.get("trainingTime"),
      tuition: data.get("tuition"),
      desc: data.get("description"),
      image: null
    }
    console.log("DATA::");
    console.log(editCourseData);

    handleCloseEditCoursePopup();
    callEditCourse(editCourseData);
  }

  const handleDeleteCourse = (courseId) => {

  }

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
                <VisuallyHiddenInput type="file" onChange={(e) => { onFileSelected(e) }} />
              </Button>
            </Box>
            {
              selectedCourse ? <CardMedia
                component="img"
                alt="green iguana"
                height={200}
                image={selectedCourse.thumbnail}
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
            <DialogActions>
              <Button onClick={handleCloseEditCoursePopup}>Cancel</Button>
              <Button type="submit">Edit</Button>
            </DialogActions>
          </Box>
        </Dialog> : <></>
      }
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
