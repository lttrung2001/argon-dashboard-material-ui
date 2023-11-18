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

import { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonAvatar from "components/ArgonAvatar";

// Argon Dashboard 2 MUI example components
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Argon Dashboard 2 MUI base styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import burceMars from "assets/images/bruce-mars.jpg";

import React from "react";
import apiHelper from "../../../../utils/Axios";
import { Autocomplete, Box, Button, CardMedia, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, Input, InputLabel, List, ListItemButton, ListItemIcon, ListItemText, MenuItem, Paper, Select, TextField, Typography, selectClasses } from "@mui/material";
import { DialogTitle } from '@mui/material';
import { CloudUploadRounded } from "@mui/icons-material";
import { VisuallyHiddenInput } from "components/UploadFileButton";
import ArgonBadge from "components/ArgonBadge";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
  

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const [profile, setProfile] = useState();
  const [error, setError] = useState();
  const navigator = useNavigate();

  const callGetProfile = async () => {
    try {
      const response = await apiHelper().get("/teachers/profile");
      const teacher = response.data;
      setProfile(teacher);
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  const callChangePassword = async (requestData) => {
    try {
      await apiHelper().post("/auth/change-password", requestData);
      setOpenChangePasswordDialog(false);
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  useEffect(() => {
    callGetProfile();
  }, []);

  const handleChangePassword = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requestData = {
      oldPassword: data.get("oldPassword"),
      newPassword: data.get("newPassword")
    };
    console.log("DATA::");
    console.log(requestData);

    callChangePassword(requestData);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigator("/authentication/sign-in");
    navigator(0);
  };

  const handleCloseChangePasswordDialog = () => {
    setOpenChangePasswordDialog(false);
  };

  const handleCloseErrorDialog = () => {
    setError(null);
  };

  return (
    <ArgonBox position="relative">
      <DashboardNavbar absolute light />
      <ArgonBox height="220px" />
      <Card
        sx={{
          py: 2,
          px: 2,
          boxShadow: ({ boxShadows: { md } }) => md,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <ArgonAvatar
              src={burceMars}
              alt="profile-image"
              variant="rounded"
              size="xl"
              shadow="sm"
            />
          </Grid>
          <Grid item>
            <ArgonBox height="100%" mt={0.5} lineHeight={1}>
              <ArgonTypography variant="h5" fontWeight="medium">
                {`${profile ? profile.fullName : ""}`}
              </ArgonTypography>
              <ArgonTypography variant="button" color="text" fontWeight="medium">
                Teacher
              </ArgonTypography>
            </ArgonBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Box>
                <Button onClick={() => setOpenChangePasswordDialog(true)}>Change password</Button>
                <Button onClick={handleLogout}>Log out</Button>
              </Box>
            </AppBar>
          </Grid>
        </Grid>
      </Card>
      {
        // Create room dialog
        openChangePasswordDialog ? <Dialog
          fullWidth
          open={openChangePasswordDialog}
          // TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseChangePasswordDialog}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Change your password"}</DialogTitle>
          <Box component="form" onSubmit={handleChangePassword}>
            <Box mx={2} my={1}>
              <Typography>Current password</Typography>
              <TextField id="oldPassword" name="oldPassword" fullWidth />
            </Box>
            <Box mx={2} my={1}>
              <Typography>New password</Typography>
              <TextField id="newPassword" name="newPassword" fullWidth />
            </Box>
            <DialogActions>
              <Button onClick={handleCloseChangePasswordDialog}>Cancel</Button>
              <Button type="submit">Submit</Button>
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
    </ArgonBox>
  );
}

export default Header;
