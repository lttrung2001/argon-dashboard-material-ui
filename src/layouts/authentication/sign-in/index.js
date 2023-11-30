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

import { useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Switch from "@mui/material/Switch";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
import apiHelper, { ACCESS_TOKEN, MESSAGE_INVALID_TOKEN, ROLE, SERVICE_UNAVAILABLE, apiHelperPublic } from "../../../utils/Axios";

// Authentication layout components
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";
import { DialogActions } from '@mui/material';
import { Button } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogContentText } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { Dialog } from '@mui/material';
import { jwtDecode } from "jwt-decode";

// Image
const bgImage =
  "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg";

function Illustration() {
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const navigator = useNavigate();

  const callLogin = async (loginData) => {
    try {
    apiHelperPublic().post("/auth/login", loginData).then((response) => {
      const token = response.data.token;
      const role = jwtDecode(token).role;
      localStorage.setItem(ROLE, role);
      localStorage.setItem(ACCESS_TOKEN, token);
      navigator(0);
    }, (e) => {
      if (e.message == MESSAGE_INVALID_TOKEN) {
        navigator(0);
      } else {
        setError(SERVICE_UNAVAILABLE);
      }
    });
    } catch(e) {
      setError(e.response.data.message);
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loginData = {
      username: data.get("username"),
      password: data.get("password"),
      isTeacher: true
    };
    console.log("DATA::");
    console.log(loginData);

    callLogin(loginData);
  };

  const handleCloseErrorDialog = () => {
    setError(null);
  };

  return (
    <IllustrationLayout
      title="Sign In"
      description="Enter your email and password to sign in"
      illustration={{
        image: bgImage,
        title: '"Attention is the new currency"',
        description:
          "The more effortless the writing looks, the more effort the writer actually put into the process.",
      }}
    >
      <ArgonBox component="form" role="form" onSubmit={handleLogin}>
        <ArgonBox mb={2}>
          <ArgonInput name="username" placeholder="Username" size="large" />
        </ArgonBox>
        <ArgonBox mb={2}>
          <ArgonInput name="password" type="password" placeholder="Password" size="large" />
        </ArgonBox>
        <ArgonBox display="flex" alignItems="center">
          <Switch checked={rememberMe} onChange={handleSetRememberMe} />
          <ArgonTypography
            variant="button"
            fontWeight="regular"
            onClick={handleSetRememberMe}
            sx={{ cursor: "pointer", userSelect: "none" }}
          >
            &nbsp;&nbsp;Remember me
          </ArgonTypography>
        </ArgonBox>
        <ArgonBox mt={4} mb={1}>
          <ArgonButton color="info" size="large" fullWidth type="submit">
            Sign In
          </ArgonButton>
        </ArgonBox>
        <ArgonBox mt={3} textAlign="center">
          <ArgonTypography variant="button" color="text" fontWeight="regular">
            Don&apos;t have an account?{" "}
            <ArgonTypography
              component={Link}
              to="/authentication/sign-up"
              variant="button"
              color="info"
              fontWeight="medium"
            >
              Sign up
            </ArgonTypography>
          </ArgonTypography>
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
    </IllustrationLayout>
  );
}

export default Illustration;
