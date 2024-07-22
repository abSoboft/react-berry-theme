import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import MainCard from 'ui-component/cards/MainCard';
import api from '../../../api/axios';
import {
  Autocomplete,
  Button,
  Paper,
  Popper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import InvPartyHeader from './InvPartyHeader';

const Invoice_React_Entry = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors }
  } = useForm();

  let todayDate = new Date();
  let dateMDY = `${('0' + todayDate.getDate()).slice(-2)}/${('0' + (todayDate.getMonth() + 1)).slice(-2)}/${todayDate.getFullYear()}`;
  const [partyList, setPartyList] = useState([]);

  useEffect(() => {
    setValue('billNo', 'INV001', { shouldValidate: true });

    api
      .get('/Invoice_React/GetPartyList', {
        //params: data
      })
      .then(function (response) {
        setPartyList(response.data.lstParty);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }, []);

  const { fields, append, prepend, remove, swap, move, insert, update } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'itemMaster' // unique name for your Field Array1
  });

  const addItem = () => {
    append({ itemCode: '', itemName: '', qty: 0, rate: 0.0, amount: 0.0 });
  };
  const removeItem = (index) => {
    remove(index);
  };

  return (
    <>
      <MainCard style={{ height: '95vh' }}>
        <Grid item xs={12}></Grid>
        <form>
          <FormControl style={{ width: 200 }} variant="outlined">
            <TextField id="txtBillNo" label="Bill No" InputLabelProps={{ shrink: true }} variant="outlined" {...register('billNo')} />
          </FormControl>

          <FormControl style={{ width: 200, marginLeft: 20 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Bill Date" defaultValue={dayjs(todayDate)} format="DD/MM/YYYY" {...register('billDate')} />
            </LocalizationProvider>
          </FormControl>
          <FormControl style={{ width: 300, marginLeft: 20 }}>
            <Autocomplete
              disablePortal
              id="cmbParty"
              options={partyList}
              sx={{ width: 1000 }}
              groupBy={(option) => option.groupId}
              getOptionLabel={(option) => option.partyName.trim()}
              renderInput={(params) => (
                <>
                  <TextField {...params} label="Party" />
                </>
              )}
              // onChange={handleChange}
              //onInputChange={debounce(handleInputChange, 700)}
              filterOptions={(options, state) => options}
              freeSolo={false}
              //onOpen={() => onDropdownOpen()}
              renderOption={(props, option, t) => {
                const { key, ...optionProps } = props;
                return (
                  <Box
                    key={option?.id}
                    component="li"
                    sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                    {...optionProps}
                    //ref={option?.index === limit - 1 ? lastRowRef : null}
                  >
                    <div className={`container options`}>
                      <span>{option?.partyCode}</span>
                      <span>{option?.partyName}</span>
                    </div>
                  </Box>
                );
              }}
              renderGroup={(params) => (
                <li key={params.key}>
                  <InvPartyHeader />
                  {params.children}
                </li>
              )}
            />
          </FormControl>
        </form>
        <Grid>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Button onClick={addItem}>Add</Button>
                  </TableCell>
                  <TableCell>Item Code</TableCell>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Rate</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((item, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Button onClick={() => removeItem(index)}>Remove</Button>
                    </TableCell>

                    <TableCell component="th" scope="row">
                      <TextField
                        id="standard-basic"
                        label=""
                        variant="standard"
                        key={item.id} // important to include key with field's id
                        {...register(`itemMaster.${index}.itemCode`)}
                      />
                    </TableCell>

                    <TableCell component="th" scope="row">
                      <TextField
                        id="standard-basic"
                        label=""
                        variant="standard"
                        key={item.id} // important to include key with field's id
                        {...register(`itemMaster.${index}.itemName`)}
                      />
                    </TableCell>

                    <TableCell component="th" scope="row">
                      <TextField
                        id="standard-basic"
                        label=""
                        variant="standard"
                        key={item.id} // important to include key with field's id
                        //onChange={e => calculateAmount(item.id, 'qty', parseFloat(e.target.value) || 0)}
                        // onChange={e => handleQtyChange(index, e.target.value)}

                        {...register(`itemMaster.${index}.qty`, {
                          onChange: (e) => {
                            handleQtyChange(index, e.target.value);
                          }
                        })}
                      />
                    </TableCell>

                    <TableCell component="th" scope="row">
                      <TextField
                        id="standard-basic"
                        label=""
                        variant="standard"
                        key={item.id} // important to include key with field's id
                        {...register(`itemMaster.${index}.rate`, {
                          onChange: (e) => {
                            handleRateChange(index, e.target.value);
                          }
                        })}
                      />
                    </TableCell>

                    <TableCell component="th" scope="row">
                      <TextField
                        id="standard-basic"
                        label=""
                        variant="standard"
                        key={item.id} // important to include key with field's id
                        {...register(`itemMaster.${index}.amount`)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </MainCard>
    </>
  );
};

export default Invoice_React_Entry;
