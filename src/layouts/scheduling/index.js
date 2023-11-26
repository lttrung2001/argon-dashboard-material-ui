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
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiHelper, { MESSAGE_INVALID_TOKEN, SERVICE_UNAVAILABLE } from "../../utils/Axios";
import { DialogContentText } from '@mui/material';
import { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';

const SchedulingScreen = () => {
    const [error, setError] = React.useState();
    const [confirm, setConfirm] = React.useState();
    const [selectedEvent, setSelectedEvent] = React.useState();
    const [classrooms, setClassrooms] = React.useState([]);
    const [openDialog, setOpenDialog] = React.useState();
    const [selectedList, setSelectedList] = React.useState([]);
    const navigator = useNavigate();

    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: 25,
        page: 0,
      });

      const classroomColumns = [
        { field: "id", headerName: "ID" },
        { field: "name", headerName: "Classroom name", flex: 1 }
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
                navigator("/authentication/sign-in");
                } else {
                setError(SERVICE_UNAVAILABLE);
                }
            })
        } catch (e) {
            setError(e.response.data.message);
        }
    }

    const callGenerateTimetable = (requestData) => {
        try {
            apiHelper().post("/timetables/generate", requestData).then((response) => {
                callGetNotArrangedClassrooms();
                setConfirm("Generate timetable successfully!");
            }, (e) => {
            if (e.message == MESSAGE_INVALID_TOKEN) {
                localStorage.clear();
                navigator("/authentication/sign-in");
                } else {
                setError(SERVICE_UNAVAILABLE);
                }
            })
        } catch (e) {
            setError(e.response.data.message);
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

    useEffect(() => {
        callGetNotArrangedClassrooms();
    }, []);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ArgonBox py={3}>
                <ArgonBox mb={3}>
                    <Card>
                        <ArgonBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                            <ArgonTypography variant="h6">Scheduling</ArgonTypography>
                            <Button onClick={() => {
                                if (classrooms.length === 0) {
                                    setError("There is no available classrooms to generate!");
                                    return;
                                }
                                setOpenDialog(true);
                            }}>Arrange timetable</Button>
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
                                events={[
                                    { title: 'khoa hoc lap trinh android 3', date: '2023-11-26', period: 0 },
                                    { title: 'khoa hoc lap trinh android 1', date: '2023-11-26', period: 0 },
                                    { title: 'khoa hoc lap trinh android 2', date: '2023-11-26', period: 1 }
                                  ]}
                                  eventOrder={"extendedProps.period"}
                                eventClick={(info) => {
                                    console.log(info.event._def);
                                    setSelectedEvent({
                                        title: info.event._def.title,
                                        date: dayjs(info.event._instance.range.start).format("DD/MM/YYYY"),
                                        period: info.event._def.extendedProps.period
                                    })
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
          <DialogTitle>{`Select classrooms to generate schedule for them`}</DialogTitle>
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
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={() => {
                handleGenerateTimetable();
            }}>Select classrooms</Button>
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
            {"Notification"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" mb={3}>
              <ArgonTypography variant="h5">Schedule details</ArgonTypography>
            </DialogContentText>
            <Box>
              <ArgonTypography variant="h6">Course info</ArgonTypography>
              <TextField fullWidth disabled defaultValue={`${selectedEvent.date} | ${selectedEvent.title}`} />
            </Box>
            <Box>
              <ArgonTypography variant="h6">Classroom info</ArgonTypography>
              <TextField fullWidth disabled defaultValue={`${selectedEvent.date} | ${selectedEvent.title}`} />
            </Box>
            <Box>
              <ArgonTypography variant="h6">Subject info</ArgonTypography>
              <TextField fullWidth disabled defaultValue={`${selectedEvent.date} | ${selectedEvent.title}`} />
            </Box>
            <Box>
              <ArgonTypography variant="h6">Room info</ArgonTypography>
              <TextField fullWidth disabled defaultValue={`${selectedEvent.date} | ${selectedEvent.title}`} />
            </Box>
            <Box>
              <ArgonTypography variant="h6">Period</ArgonTypography>
              <TextField fullWidth disabled defaultValue={`${selectedEvent.date} | ${selectedEvent.period}`} />
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
            <Footer />
        </DashboardLayout>
    );
};

export default SchedulingScreen;