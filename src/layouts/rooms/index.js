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
import { Autocomplete, Box, Button, CardMedia, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, FormControlLabel, Grid, Input, InputLabel, List, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, TextField, Typography } from "@mui/material";
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
import { DataGrid } from "@mui/x-data-grid";
import ConfirmDeleteData from "utils/ConfirmDeleteData";

function RoomsTable() {
  const [error, setError] = React.useState();
  const [confirm, setConfirm] = React.useState();
  const [confirmDelete, setConfirmDelete] = React.useState();
  const [rooms, setRooms] = React.useState([]);
  const [showCreateRoomDialog, setShowCreateRoomDialog] = React.useState();
  const [selectedRoom, setSelectedRoom] = React.useState();

  const callGetRooms = async () => {
    try {
      const response = await apiHelper().get(`/rooms`);
      const rooms = response.data;
      setRooms(rooms);
    } catch (e) {
      setError(e.response.data.message);
    } finally {
      handleCloseCreateRoomPopup();
      handleCloseUpdateRoomPopup();
    }
  };

  const callCreateRoom = async (data) => {
    try {
      await apiHelper().post("/rooms/create", data);
      callGetRooms();
      setConfirm("Create room successfully!");
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  const callUpdateRoom = async (data) => {
    try {
      await apiHelper().put("/rooms/update", data);
      callGetRooms();
      setConfirm("Update room successfully!");
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  const callDeleteRoom = async (id) => {
    try {
      await apiHelper().delete(`/rooms/delete?roomId=${id}`);
      setSelectedRoom(null);
      callGetRooms();
      setConfirm("Delete room successfully!");
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  useEffect(() => {
    callGetRooms();
  }, []);

  const handleRoomClicked = (params) => {
    const roomSelected = params.row;
    setSelectedRoom(roomSelected);
  };

  const handleCloseCreateRoomPopup = () => {
    setShowCreateRoomDialog(false);
  };

  const handleCloseUpdateRoomPopup = () => {
    setSelectedRoom(null);
  };

  const handleCreateRoom = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const createRoomData = {
      name: data.get("name"),
      capacity: data.get("capacity")
    }
    console.log("DATA::");
    console.log(createRoomData);

    callCreateRoom(createRoomData);
  };

  const handleUpdateRoom = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const updateRoomData = {
      roomId: selectedRoom.id,
      name: data.get("name"),
      capacity: data.get("capacity"),
      canUse: data.get("canUse") === "on" ? true : false
    }
    console.log("DATA::");
    console.log(updateRoomData);

    callUpdateRoom(updateRoomData);
  };

  const handleDeleteRoom = (room) => {
    setConfirmDelete(new ConfirmDeleteData(
      ACTION_DELETE_ROOM,
      `Are you sure to delete this room with name ${room.name}?`,
      room
    ));
  }

  const handleCloseErrorDialog = () => {
    setError(null);
  };

  const handleCloseConfirmDialog = () => {
    setConfirm(null);
  };


  ///////////////// BEGIN DEMO TABLE
  const roomColumns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Room name", flex: 1 }
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
              <ArgonTypography variant="h6">Room list</ArgonTypography>
              <Autocomplete
                onChange={(event, newValue) => {
                  if (newValue) {
                    setSelectedRoom(newValue);
                  }
                }}
                disablePortal
                id="combo-box-demo"
                options={rooms}
                sx={{ width: 300 }}
                getOptionLabel={option => `${option.id} | ${option.name}`}
                renderInput={(params) => <TextField {...params} placeholder="Search room" />}
              />
              <Button onClick={() => {
                setShowCreateRoomDialog(true);
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
                  columns={roomColumns}
                  rows={rooms}
                  onRowClick={handleRoomClicked} {...rooms}
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
        // Create room dialog
        showCreateRoomDialog ? <Dialog
          fullWidth
          open={showCreateRoomDialog}
          // TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseCreateRoomPopup}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Create new room"}</DialogTitle>
          <Box component="form" onSubmit={handleCreateRoom}>
            <Box mx={2} my={1}>
              <Typography>Room name</Typography>
              <TextField id="name" name="name" fullWidth />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Capacity</Typography>
              <TextField id="capacity" name="capacity" fullWidth />
            </Box>
            <DialogActions>
              <Button type="submit">Create</Button>
              <Button onClick={handleCloseCreateRoomPopup}>Cancel</Button>

            </DialogActions>
          </Box>
        </Dialog> : <></>
      }
      {
        // Update room dialog
        selectedRoom ? <Dialog
          fullWidth
          open={selectedRoom}
          // TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseUpdateRoomPopup}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Update room information"}</DialogTitle>
          <Box component="form" onSubmit={handleUpdateRoom}>
            <Box mx={2} my={1}>
              <Typography>Room name</Typography>
              <TextField id="name" name="name" fullWidth defaultValue={selectedRoom.name} />
            </Box>
            <Box mx={2} my={1}>
              <Typography>Capacity</Typography>
              <TextField id="capacity" name="capacity" fullWidth defaultValue={selectedRoom.capacity} />
            </Box>
            <Box mx={3} my={1}>
              <FormControlLabel id="canUse" name="canUse" control={<Checkbox defaultChecked={selectedRoom.canUse} />} label="Can use" />
            </Box>
            <DialogActions>
              <Button type="submit">Update</Button>
              <Button onClick={() => {
                handleDeleteRoom(selectedRoom);
              }}>Delete</Button>
              <Button onClick={handleCloseUpdateRoomPopup}>Cancel</Button>

            </DialogActions>
          </Box>
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
              setConfirmDelete(null);
            }} autoFocus>
              Cancel
            </Button>
            <Button onClick={() => {
              callDeleteRoom(confirmDelete.data.id);
            }} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog> : <></>
      }
      <Footer />
    </DashboardLayout>
  );
}

export default RoomsTable;

const ACTION_DELETE_ROOM = "ACTION_DELETE_ROOM"