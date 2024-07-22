import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from "react-router-dom";
// third party

import { useForm } from "react-hook-form";


// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import api from '../../../../api/axios';
import { ToastContainer, toast } from 'react-toastify';
  


// ============================|| FIREBASE - LOGIN ||============================ //
const AuthLogin = ({ ...others }) => {

  // const theme = useTheme();
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedYear, setSelectedYear] = useState([]);

  const [companyList, setCompanyList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [yearList, setYearList] = useState([]);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const navigate = useNavigate();

  const onSubmit = (data) => {
    data.companyId = selectedCompany.companyId;
    data.branchId = selectedBranch.branchId;
    data.yearId = selectedYear.yearId;

    //console.log(data);

    api.get('/Login/ValidateUser', {
       params: data
    })
      .then(function (response) {
        if(response.data.responseCode == "S") {
          navigate("/dashboard");
        }
        else        
        {
          toast.error(response.data.response); 
        }
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    api.get('/Login/GetCompanyList', {
      // params: data
    })
      .then(function (response) {
        setCompanyList(response.data.lstCompany);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        // always executed
      });


    api.get('/Login/GetBranchList', {
      // params: data
    })
      .then(function (response) {
        setBranchList(response.data.lstBranch);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        // always executed
      });

    api.get('/Login/GetYearList', {
      // params: data
    })
      .then(function (response) {
        setYearList(response.data.lstYear);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        // always executed
      });

  }, [])

  const companyChange = (e, value) => {
    console.log('val : ' + value);
  }

  return (
    <>
    <ToastContainer
    position="top-center"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="colored"
    transition: Bounce/>

      <Grid container direction="column" justifyContent="center" spacing={2}>
      </Grid>

      <form onSubmit={handleSubmit(onSubmit)}>

        <FormControl sx={{ mt: 2, minWidth: 380 }} variant="outlined">
          <TextField id="txtUsername" label="Username" variant="outlined" {...register("userName", { required: true, maxLength: 5 })} />
          {errors?.userName?.type === "required" && <span style={{ color: '#bf1650' }} >Username is required</span>}
          {errors?.userName?.type === "maxLength" && <span style={{ color: '#bf1650' }} >Username has max 5 char</span>}
        </FormControl>

        <FormControl sx={{ mt: 2, minWidth: 380 }} variant="outlined">
          <InputLabel htmlFor="txtPassword">Password</InputLabel>
          <OutlinedInput
            id="txtPassword"
            type={showPassword ? 'text' : 'password'}
            {...register("password", { required: true, maxLength: 50 })}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          {errors?.password?.type === "required" && <span style={{ color: '#bf1650' }} >Password is required</span>}
        </FormControl>

        <FormControl variant="standard" sx={{ mt: 2, minWidth: 380 }}>
          <InputLabel id="demo-simple-select-standard-label">Company</InputLabel>

          <Autocomplete
            disablePortal
            id="cmbCompany"
            options={companyList}
            getOptionKey={(option) => option.companyId}
            getOptionLabel={(option) => option.companyName}
            //sx={{ width: 300 }}
            onChange={(event, value) => setSelectedCompany(value)}
            renderInput={(params) => <TextField {...params} label="Company" />}

          />
        </FormControl>

        <FormControl variant="standard" sx={{ mt: 2, minWidth: 380 }}>
          <InputLabel id="demo-simple-select-standard-label">Branch</InputLabel>

          <Autocomplete
            disablePortal
            id="cmbbranch"
            options={branchList}
            getOptionKey={(option) => option.branchId}
            getOptionLabel={(option) => option.branchName}
            onChange={(event, value) => setSelectedBranch(value)}
            renderInput={(params) => <TextField {...params} label="Branch" />}
          />
        </FormControl>

        <FormControl variant="standard" sx={{ mt: 2, minWidth: 380 }}>
          <InputLabel id="demo-simple-select-standard-label">Year</InputLabel>

          <Autocomplete
            disablePortal
            id="cmbyear"
            options={yearList}
            getOptionKey={(option) => option.yearId}
            getOptionLabel={(option) => option.yearName}
            onChange={(event, value) => setSelectedYear(value)}
            renderInput={(params) => <TextField {...params} label="Year" />}
          />
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <AnimateButton>

            <Button type="submit" fullWidth size="large" variant="contained" color="secondary">
              Sign in
            </Button>
          </AnimateButton>
        </Box>
      </form>
    </>
  );
};

export default AuthLogin;
