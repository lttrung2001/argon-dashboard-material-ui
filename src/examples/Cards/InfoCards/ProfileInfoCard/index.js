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

// react-routers components
import { Link } from "react-router-dom";

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Argon Dashboard 2 MUI base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";

import React, { useEffect, useState } from "react";
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

function ProfileInfoCard({ title, description, info, social, action }) {
  const [profile, setProfile] = useState();
  const [error, setError] = useState();

  const callGetProfile = async () => {
    try {
      const response = await apiHelper().get("/teachers/profile");
      const teacher = response.data;
      setProfile(teacher);
    } catch (e) {
      setError(e.response.data.message);
    }
  }

  useEffect(() => {
    callGetProfile();
  }, []);

  const labels = [];
  const values = [];
  const { socialMediaColors } = colors;
  const { size } = typography;

  // Render the card social media icons
  const renderSocial = social.map(({ link, icon, color }) => (
    <ArgonBox
      key={color}
      component="a"
      href={link}
      target="_blank"
      rel="noreferrer"
      fontSize={size.lg}
      color={socialMediaColors[color].main}
      pr={1}
      pl={0.5}
      lineHeight={1}
    >
      {icon}
    </ArgonBox>
  ));

  return (
    <Card sx={{ height: "100%" }}>
      <ArgonBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <ArgonTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </ArgonTypography>
        <ArgonTypography component={Link} to={action.route} variant="body2" color="secondary">
          <Tooltip title={action.tooltip} placement="top">
            <Icon>edit</Icon>
          </Tooltip>
        </ArgonTypography>
      </ArgonBox>
      <ArgonBox p={2}>
        <ArgonBox mb={2} lineHeight={1}>
          <ArgonTypography variant="button" color="text" fontWeight="regular">
            {description}
          </ArgonTypography>
        </ArgonBox>
        <ArgonBox opacity={0.3}>
          <Divider />
        </ArgonBox>
        <ArgonBox>
          <ArgonBox key={"fullName"} display="flex" py={1} pr={2}>
            <ArgonTypography variant="button" fontWeight="bold" textTransform="capitalize">
              {"Full name"}: &nbsp;
            </ArgonTypography>
            <ArgonTypography variant="button" fontWeight="regular" color="text">
              &nbsp;{profile ? profile.fullName : ""}
            </ArgonTypography>
          </ArgonBox>
          <ArgonBox key={"dob"} display="flex" py={1} pr={2}>
            <ArgonTypography variant="button" fontWeight="bold" textTransform="capitalize">
              {"Day of birth"}: &nbsp;
            </ArgonTypography>
            <ArgonTypography variant="button" fontWeight="regular" color="text">
              &nbsp;{profile ? dayjs(profile.dob).format("DD/MM/YYYY") : ""}
            </ArgonTypography>
          </ArgonBox>
          <ArgonBox key={"phoneNumber"} display="flex" py={1} pr={2}>
            <ArgonTypography variant="button" fontWeight="bold" textTransform="capitalize">
              {"Phone number"}: &nbsp;
            </ArgonTypography>
            <ArgonTypography variant="button" fontWeight="regular" color="text">
              &nbsp;{profile ? profile.phoneNumber : ""}
            </ArgonTypography>
          </ArgonBox>
          <ArgonBox key={"address"} display="flex" py={1} pr={2}>
            <ArgonTypography variant="button" fontWeight="bold" textTransform="capitalize">
              {"Address"}: &nbsp;
            </ArgonTypography>
            <ArgonTypography variant="button" fontWeight="regular" color="text">
              &nbsp;{profile ? profile.address : ""}
            </ArgonTypography>
          </ArgonBox>
          <ArgonBox display="flex" py={1} pr={2}>
            <ArgonTypography variant="button" fontWeight="bold" textTransform="capitalize">
              social: &nbsp;
            </ArgonTypography>
            {renderSocial}
          </ArgonBox>
        </ArgonBox>
      </ArgonBox>
    </Card>
  );
}

// Typechecking props for the ProfileInfoCard
ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  info: PropTypes.objectOf(PropTypes.string).isRequired,
  social: PropTypes.arrayOf(PropTypes.object).isRequired,
  action: PropTypes.shape({
    route: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProfileInfoCard;
