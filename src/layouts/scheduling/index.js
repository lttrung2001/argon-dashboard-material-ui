import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!

// @mui material components
import Card from "@mui/material/Card";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Argon Dashboard 2 MUI examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiHelper, { MESSAGE_INVALID_TOKEN, ROLE, SERVICE_UNAVAILABLE } from "../../utils/Axios";
import { DialogContentText } from '@mui/material';
import { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { MANAGER_ROLE } from './../../utils/Axios';
import { useMovieData } from '@mui/x-data-grid-generator';

// Sử dụng styled-components để tạo một component tùy chỉnh
const CustomCalendar = styled(FullCalendar)`
  /* Đặt kích thước chữ cho tháng và năm */
  .fc-toolbar-title {
    font-size: 18px; /* Điều chỉnh kích thước chữ theo ý muốn */
  }

  /* Đặt kích thước chữ cho giá trị ngày tháng trong header */
  .fc-col-header-cell-cushion,
  .fc-col-header-cell {
    font-size: 14px; /* Điều chỉnh kích thước chữ theo ý muốn */
  }
`;

const SchedulingScreen = () => {
    const [error, setError] = React.useState();
    const [confirm, setConfirm] = React.useState();
    const [selectedEvent, setSelectedEvent] = React.useState();
    const [classrooms, setClassrooms] = React.useState([]);
    const [openDialog, setOpenDialog] = React.useState();
    const [tempData, setTempData] = React.useState();
    const [selectedList, setSelectedList] = React.useState([]);
    const [schedules, setSchedules] = React.useState([]);
    const navigator = useNavigate();
    const movieData = useMovieData();
    console.log(movieData)

    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: 25,
        page: 0,
      });

      const classroomColumns = [
        { field: "id", headerName: "ID" },
        { field: "name", headerName: "Classroom name", flex: 1 },
        { field: "trainingTime", headerName: "Training time", flex: 1, valueGetter: (params) => `${params.row.course.trainingTime} months`},
        { field: "startDate", headerName: "Start date", flex: 1, valueGetter: (params) => dayjs(params.row.startDate).format("DD/MM/YYYY") },
        { field: "endDate", headerName: "End date", flex: 1, valueGetter: (params) => dayjs(params.row.endDate).format("DD/MM/YYYY") },
      ]

      const previewColumns = [
        { field: "id", headerName: "ID", valueGetter: (params) => params.row?.classroom.id },
        { field: "classroomName", headerName: "Classroom name", valueGetter: (params) => params.row?.classroom.name },
        { field: "startDate", headerName: "Start date", flex: 1, valueGetter: (params) => dayjs(params.row.startDate).format("DD/MM/YYYY") },
        { field: "endDate", headerName: "End date", flex: 1, valueGetter: (params) => dayjs(params.row.endDate).format("DD/MM/YYYY") },
      ]

    const callGetNotArrangedClassrooms = () => {
        try {
            apiHelper().get("/timetables/classrooms").then((response) => {
                setClassrooms(response.data);
                setSelectedList([]);
                setOpenDialog(false);
            }, (e) => {
            if (e.message == MESSAGE_INVALID_TOKEN) {
                localStorage.clear();
                navigator(0);
                } else {
                setError(e.response.data.message);
                }
            })
        } catch (e) {
            setError(e.response.data.message);
        }
    }

    const callGenerateTimetable = (requestData) => {
        try {
            apiHelper().post("/timetables/generate", requestData).then((response) => {
                setTempData(response.data);
                // callGetNotArrangedClassrooms();
                // callGetAllSchedule();
                // setConfirm("Generate timetable successfully!");
            }, (e) => {
            if (e.message == MESSAGE_INVALID_TOKEN) {
                localStorage.clear();
                navigator(0);
                } else {
                setError(e.response.data.message);
                }
            })
        } catch (e) {
            setError(e.response.data.message);
        }
    }

    const callGetAllSchedule = () => {
      try {
          apiHelper().get("/timetables").then((response) => {
            const mappedData = Array.from(response.data.schedules).map((item) => {
              const tmpItem = {
                title: item.subject.name,
                date: dayjs(item.date).format("YYYY-MM-DD"),
                period: item.period,
                data: item
              };
              return tmpItem;
            });
            setSchedules(mappedData);
          }, (e) => {
          if (e.message == MESSAGE_INVALID_TOKEN) {
              localStorage.clear();
              navigator(0);
              } else {
              setError(e.response.data.message);
              }
          })
      } catch (e) {
          setError(e.response.data.message);
      }
  }

  const getPeriodName = (period) => {
    if (period === 0) {
      return "Morning";
    } else {
      return "Afternoon";
    }
  }

    const handleGenerateTimetable = () => {
        if (selectedList.length === 0) {
            setError("Please choose at least one classroom to generate timetable!");
            return;
        }
        const requestData = {
            ids: selectedList
        };
        callGenerateTimetable(requestData);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const handleCloseErrorDialog = () => {
        setError(null);
    }

    const handleCloseConfirmDialog = () => {
        setConfirm(null);
    }

    const handleClosePreviewDialog = () => {
      setTempData(null);
  }

    useEffect(() => {
        if (localStorage.getItem(ROLE) === MANAGER_ROLE) {
          callGetNotArrangedClassrooms();
        }
        callGetAllSchedule();
    }, []);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={3}>
                    <Card>
                        <ArgonBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                            <ArgonTypography variant="h6">Scheduling</ArgonTypography>
                            {
                              localStorage.getItem(ROLE) === MANAGER_ROLE ?
                                <Button onClick={() => {
                                  if (classrooms.length === 0) {
                                      setError("There is no available classrooms to generate!");
                                      return;
                                  }
                                  setOpenDialog(true);
                              }}>Arrange timetable</Button> : <></>
                            }
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
                            <FullCalendar
                                plugins={[dayGridPlugin]}
                                initialView="dayGridMonth"
                                events={schedules}
                                  eventOrder={"extendedProps.period"}
                                eventClick={(info) => {
                                    console.log(info.event._def);
                                    setSelectedEvent({
                                        title: info.event._def.title,
                                        date: dayjs(info.event._instance.range.start).format("DD/MM/YYYY"),
                                        data: info.event._def.extendedProps.data
                                    })
                                }}
                                eventChange={(event) => {
                                  console.log(event);
                                }}
                            />
                        </ArgonBox>

                    </Card>
                </ArgonBox>
            </ArgonBox>
            {
        openDialog ? <Dialog
          open={openDialog}
          fullScreen
          // TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDialog}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{`Arrange schedule`}</DialogTitle>
          <Box mx={3} my={1}>
          <DataGrid
          getRowId={(row) => row.id}
          checkboxSelection disableRowSelectionOnClick
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  columns={classroomColumns}
                  rows={classrooms}
                  onRowSelectionModelChange={(selectedRows) => {
                    setSelectedList(selectedRows);
                  }}
                />
          </Box>
          <DialogActions>
          <Button onClick={() => {
                handleGenerateTimetable();
            }}>Arrange</Button>
            <Button onClick={handleCloseDialog}>Cancel</Button>
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
        selectedEvent ? <Dialog
        fullWidth
          open={selectedEvent}
          onClose={() => {
            setSelectedEvent(null);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Schedule details"}
          </DialogTitle>
          <DialogContent>
            <Box>
              <ArgonTypography variant="h6">Course info</ArgonTypography>
              <TextField fullWidth disabled defaultValue={`${selectedEvent.data.classroom.course.id} | ${selectedEvent.data.classroom.course.name}`} />
            </Box>
            <Box>
              <ArgonTypography variant="h6">Classroom info</ArgonTypography>
              <TextField fullWidth disabled defaultValue={`${selectedEvent.data.classroom.id} | ${selectedEvent.data.classroom.name}`} />
            </Box>
            <Box>
              <ArgonTypography variant="h6">Subject info</ArgonTypography>
              <TextField fullWidth disabled defaultValue={`${selectedEvent.data.subject.id} | ${selectedEvent.data.subject.name}`} />
            </Box>
            <Box>
              <ArgonTypography variant="h6">Room info</ArgonTypography>
              <TextField fullWidth disabled defaultValue={`${selectedEvent.data.room.id} | ${selectedEvent.data.room.name}`} />
            </Box>
            <Box>
              <ArgonTypography variant="h6">Period</ArgonTypography>
              <TextField fullWidth disabled defaultValue={getPeriodName(selectedEvent.data.period)} />
            </Box>
          </DialogContent>
          <DialogActions>
          <Button onClick={() => {
            setSelectedEvent(null);
          }} autoFocus>
              Close
            </Button>
          </DialogActions>
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
        tempData ? <Dialog
          open={tempData}
          fullScreen
          // TransitionComponent={Transition}
          keepMounted
          onClose={handleClosePreviewDialog}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{`Arrange schedule`}</DialogTitle>
          <Box mx={3} my={1}>
          <DataGrid
          getRowId={(row) => `${row.classroom.id}|${row.subject.id}`}
          // checkboxSelection disableRowSelectionOnClick
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  columns={previewColumns}
                  rows={tempData}
                  groupBy={['classroom.name']}
                  // onRowSelectionModelChange={(selectedRows) => {
                    // setSelectedList(selectedRows);
                  // }}
                />
          </Box>
          <DialogActions>
          <Button onClick={() => {
                
            }}>Confirm</Button>
            <Button onClick={handleClosePreviewDialog}>Cancel</Button>
          </DialogActions>
        </Dialog> : <></>
      }
            <Footer />
        </DashboardLayout>
    );
};

export default SchedulingScreen;