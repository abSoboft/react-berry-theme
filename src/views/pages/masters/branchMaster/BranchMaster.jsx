import React from 'react'
import MainCard from 'ui-component/cards/MainCard';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import { useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Button from '@mui/material/Button';
import { useForm } from "react-hook-form";

const BranchMaster = () => {
  const theme = useTheme();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    
    api.get('/BranchMaster/SaveData', {
      params: data
     }).then(function (response) {
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

  return (

    <MainCard>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12}>
          <Box sx={{ alignItems: 'center', display: 'flex', }}>

            <FormControl style={{ width: 200 }} variant="outlined">
              <TextField id="txtBranchCode" label="Branch Code" variant="outlined" {...register("branchCode", { required: true })} />
            </FormControl>

            <FormControl style={{ width: 400, marginLeft: 20 }}>
              <TextField id="txtBranchName" label="Branch Name" variant="outlined" {...register("branchName", { required: true })}/>
            </FormControl>

          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ mt: 2 }}>
            <Button type="submit" size="large" variant="contained" color="secondary">
              Save
            </Button>
          </Box>
        </Grid>
      </form>

    </MainCard>


  )
}

export default BranchMaster