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
import apiHelper, { MESSAGE_INVALID_TOKEN, SERVICE_UNAVAILABLE } from "../../utils/Axios";
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
import { useNavigate } from "react-router-dom";

function ScoreRateConfiguration() {
  const [error, setError] = React.useState();
  const [openEdit, setOpenEdit] = React.useState();
  const [confirm, setConfirm] = React.useState();
  const [confirmSuccess, setConfirmSuccess] = React.useState();
  const [scoreRate, setScoreRate] = React.useState({
    rate1: 0,
    rate2: 0,
    rate3: 0
  });
  const navigator = useNavigate();

  const callGetScoreRate = async () => {
    try {
      apiHelper().get(`/rate`).then((response) => {
        setScoreRate(response.data);
        setValue1(response.data.rate1);
        setValue2(response.data.rate2);
        setValue3(response.data.rate3);
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
    } finally {
    }
  };

  const callUpdateScoreRate = async (requestData) => {
    try {
      apiHelper().put(`/rate/update`, requestData).then((response) => {
        callGetScoreRate();
        setOpenEdit(false);
        setConfirmSuccess("Update score rate successfully!");
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
    } finally {
    }
  };

  const handleUpdateScoreRate = () => {
    if (getTotal() !== 100) {
      setError("Sum of score rate must be equals 100!");
      return
    }
    callUpdateScoreRate({
                rate1: value1,
                rate2: value2,
                rate3: value3
              })
  }

  useEffect(() => {
    callGetScoreRate();
  }, []);

  const handleCloseErrorDialog = () => {
    setError(null);
  };

  const handleCloseOpenEditDialog = () => {
    setOpenEdit(false);
  };

  const handleCloseConfirmDialog = () => {
    setConfirm(null);
  };

  const handleCloseConfirmSuccessDialog = () => {
    setConfirmSuccess(null);
  };  

  const [value1, setValue1] = useState(scoreRate.rate1);
  const [value2, setValue2] = useState(scoreRate.rate2);
  const [value3, setValue3] = useState(scoreRate.rate3);
  const [maxValue1, setMaxValue1] = useState(100);
  const [maxValue2, setMaxValue2] = useState(100);
  const [maxValue3, setMaxValue3] = useState(100);

  useEffect(() => {
    // Cập nhật giá trị max cho mỗi TextField
    setMaxValue1(100 - value2 - value3);
    setMaxValue2(100 - value1 - value3);
    setMaxValue3(100 - value1 - value2);
  }, [value1, value2, value3]);

  const handleInputChange = (event, setValue, setMaxValue, maxValue) => {
    const inputValue = parseInt(event.target.value, 10);
    const clampedValue = isNaN(inputValue) ? 0 : Math.max(0, Math.min(maxValue, inputValue));

    setValue(clampedValue);
    setMaxValue(100 - value1 - value2);
  };

  const getTotal = () => {
    return value1 + value2 + value3;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <ArgonBox mb={3}>
          <Card>
            <ArgonBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <ArgonTypography variant="h6">Score rate configuration</ArgonTypography>
              <Button onClick={() => {
                setConfirm(true);
              }}>Edit</Button>
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
              <Box width={400} mx={3} my={2}>
              <Typography>Rate 1</Typography>
              <TextField fullWidth disabled value={scoreRate.rate1}/>
              </Box>
              <Box width={400} mx={3} my={2}>
              <Typography>Rate 2</Typography>
              <TextField fullWidth disabled value={scoreRate.rate2}/>
              </Box>
              <Box width={400} mx={3} my={2}>
              <Typography>Rate 3</Typography>
              <TextField fullWidth disabled value={scoreRate.rate3}/>
              </Box>
            </ArgonBox>

          </Card>
        </ArgonBox>
      </ArgonBox>
      {
        openEdit ? <Dialog
          open={openEdit}
          fullWidth
          onClose={handleCloseOpenEditDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Notification"}
          </DialogTitle>
          <DialogContent>
          {/* <Box width={400} mx={3} my={2}>
              <Typography>Rate 1</Typography>
              <TextField fullWidth defaultValue={scoreRate.rate1}/>
              </Box>
              <Box width={400} mx={3} my={2}>
              <Typography>Rate 2</Typography>
              <TextField fullWidth defaultValue={scoreRate.rate2}/>
              </Box>
              <Box width={400} mx={3} my={2}>
              <Typography>Rate 3</Typography>
              <TextField fullWidth defaultValue={scoreRate.rate3}/>
              </Box> */}

<Box>
<Typography>Rate 1</Typography>
        <TextField
        fullWidth
          type="number"
          value={value1}
          defaultValue={scoreRate.rate1}
          onChange={(event) => handleInputChange(event, setValue1, setMaxValue1, maxValue1)}
          inputProps={{
            min: 0,
            max: maxValue1,
          }}
        />
      </Box>
      <Box>
      <Typography>Rate 2</Typography>
        <TextField
        fullWidth
          type="number"
          defaultValue={scoreRate.rate2}
          value={value2}
          onChange={(event) => handleInputChange(event, setValue2, setMaxValue2, maxValue2)}
          inputProps={{
            min: 0,
            max: maxValue2,
          }}
        />
      </Box>
      <Box>
      <Typography>Rate 3</Typography>
        <TextField
        fullWidth
          type="number"
          defaultValue={scoreRate.rate3}
          value={value3}
          onChange={(event) => handleInputChange(event, setValue3, setMaxValue3, maxValue3)}
          inputProps={{
            min: 0,
            max: maxValue3,
          }}
        />
      </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              handleUpdateScoreRate();
            }} autoFocus>
              Agree
            </Button>
            <Button onClick={handleCloseOpenEditDialog} autoFocus>
              Cancel
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
            Editing the score rate will affect newly added classes later. Are you sure to continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setConfirm(null);
              setOpenEdit(true);
            }} autoFocus>
              Agree
            </Button>
            <Button onClick={handleCloseConfirmDialog} autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog> : <></>
      }
      {
        confirmSuccess ? <Dialog
          open={confirmSuccess}
          onClose={handleCloseConfirmSuccessDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Notification"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            {confirmSuccess}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setConfirmSuccess(null);
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

export default ScoreRateConfiguration;