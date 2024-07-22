import React, { useEffect, useLayoutEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import MainCard from 'ui-component/cards/MainCard';
import { height } from '@mui/system';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Autocomplete,
  Button,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PartyHeader from './PartyHeader';
import api from '../../api/axios';
import { Form, useFieldArray, useForm } from 'react-hook-form';
import './HeaderCss.scss';
import { IconSearch } from '@tabler/icons-react';
import SelectTable from './SelectTable';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const PurchaseOrder = () => {
  const [number, setNumber] = useState();

  const numberOnly = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setNumber(value);
  };

  const [partyList, setPartyList] = useState([]);
  const [openObj, setOpenObj] = React.useState({
    isOpen: false,
    item: null
  });
  const handleOpen = (item) =>
    setOpenObj({
      isOpen: true,
      item
    });
  const handleClose = () =>
    setOpenObj({
      isOpen: false,
      item: null
    });

  useEffect(() => {
    setTimeout(() => {
      setPartyList([
        {
          groupId: '1',
          partyId: '1',
          partyCode: 'PT01',
          partyName: 'Microsoft'
        },
        {
          groupId: '1',
          partyId: '2',
          partyCode: 'PT02',
          partyName: 'Google'
        },
        {
          groupId: '1',
          partyId: '3',
          partyCode: 'PT03',
          partyName: 'Facebook'
        },
        {
          groupId: '1',
          partyId: '4',
          partyCode: 'PT04',
          partyName: 'TCS'
        },
        {
          groupId: '1',
          partyId: '5',
          partyCode: 'PT05',
          partyName: 'Infosys'
        }
      ]);
    }, 2000);
    // api
    //   .get('/InvoiceEntry/GetPartyList', {
    //     //params: data
    //   })
    //   .then(function (response) {
    //   setPartyList(response.data.lstParty);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   })
    //   .finally(function () {
    //     // always executed
    //   });
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {
      poNumber: '',
      invoiceDate: '',
      cmbParty: '',
      gstNumber: '',
      contactNumber: ''
    }
  });

  const { fields, append, prepend, remove, swap, move, insert, update } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'itemMaster' // unique name for your Field Array1
  });

  const calculateAmount = (index) => {
    // const item = fields[index]
    const item = getValues(`itemMaster.${index}`);
    console.log('item: ', item);
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    const amount = qty * rate;
    console.log('amount: ', amount);
    setValue(`itemMaster.${index}.total`, amount.toFixed(2));
  };

  const handleQtyChange = (index, value) => {
    console.log('index: ', index);
    calculateAmount(index);
  };

  const handleRateChange = (index, value) => {
    calculateAmount(index);
  };

  const saveInvoice = (data) => {
    console.log(data);
  };

  const addItem = () => {
    append({ itemCode: '', itemName: '', qty: 0, rate: 0.0, total: 0.0 });
  };

  const removeForm = (index) => {
    remove(index);
  };

  

  return (
    <MainCard>
      <form onSubmit={handleSubmit(saveInvoice)}>
        <Grid item xs={12} gap={'10px'}>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <FormControl style={{ width: '50%' }} variant="outlined">
              <TextField id="poNumber" label="PO No" variant="outlined" {...register('poNumber')} />
            </FormControl>

            <FormControl style={{ width: '50%' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="Invoice Date" format="DD/MM/YYYY" {...register('invoiceDate')} />
              </LocalizationProvider>
            </FormControl>
          </Box>

          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
            <FormControl style={{ width: '50%' }}>
              <Autocomplete
                disablePortal
                id="cmbParty"
                options={partyList}
                groupBy={(option) => option.groupId}
                getOptionLabel={(option) => option?.partyName?.trim()}
                renderInput={(params) => (
                  <>
                    <TextField {...params} label="Party" />
                  </>
                )}
                filterOptions={(options, state) => options}
                freeSolo={false}
                renderOption={(props, option, t) => {
                  const { key, ...optionProps } = props;
                  return (
                    <Box key={option?.id} component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...optionProps}>
                      <div className={`container options`}>
                        <span>{option?.partyId}</span>
                        <span>{option?.partyName}</span>
                        <span className="text-wrap">{option?.partyCode}</span>
                      </div>
                    </Box>
                  );
                }}
                renderGroup={(params) => (
                  <li key={params.key}>
                    <PartyHeader />
                    {params.children}
                  </li>
                )}
              />
            </FormControl>

            <FormControl style={{ width: '50%' }} variant="outlined">
              <TextField disabled={true} id="gstNumber" label="GST No" variant="outlined" {...register('gstNumber')} />
            </FormControl>
          </Box>

          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
            <FormControl style={{ width: 'calc(50% - 10px)' }} variant="outlined">
              <TextField id="contactNumber" label="Contact No" variant="outlined" disabled={true} {...register('contactNumber')} />
            </FormControl>
          </Box>
        </Grid>

        <Grid>
          <TableContainer component={Paper}>
            <Table className="customTable" sx={{ minWidth: 650, minHeight: 400 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Button onClick={addItem}>Add</Button>
                  </TableCell>
                  <TableCell>Item Code</TableCell>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Item Group</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Rate</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>GST</TableCell>
                  <TableCell>GST Amount</TableCell>
                  <TableCell>Net Total</TableCell>
                  <TableCell>Delivery date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((item, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Button onClick={() => removeForm(index)}>Remove</Button>
                    </TableCell>

                    <TableCell component="th" scope="row">
                      {' '}
                      <Button disableRipple onClick={() => handleOpen(item)}>
                        ITM001{' '}
                        <IconButton color="inherit" size="small" disableRipple>
                          <IconSearch size={16} />
                        </IconButton>
                      </Button>
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
                      <FormControl style={{ width: '100%', minWidth: 150 }}>
                        <Autocomplete
                          disablePortal
                          id="cmbParty"
                          options={partyList}
                          // groupBy={(option) => option.groupId}
                          getOptionLabel={(option) => option?.partyName?.trim()}
                          renderInput={(params) => (
                            <>
                              <TextField {...params} label="" />
                            </>
                          )}
                          filterOptions={(options, state) => options}
                          freeSolo={false}
                          // renderOption={(props, option, t) => {
                          //   const { key, ...optionProps } = props;
                          //   return (
                          //     <Box key={option?.id} component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...optionProps}>
                          //       <div className={`container options`}>
                          //         <span>{option?.partyId}</span>
                          //         <span>{option?.partyName}</span>
                          //         <span className="text-wrap">{option?.partyCode}</span>
                          //       </div>
                          //     </Box>
                          //   );
                          // }}
                          // renderGroup={(params) => (
                          //   <li key={params.key}>
                          //     <PartyHeader />
                          //     {params.children}
                          //   </li>
                          // )}
                        />
                      </FormControl>
                    </TableCell>

                    <TableCell component="th" scope="row">
                      <TextField
                        id="standard-basic"
                        label=""
                        variant="standard"
                        key={item.id} // important to include key with field's id
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
                        disabled={true}
                        {...register(`itemMaster.${index}.total`)}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <TextField
                        id="standard-basic"
                        label=""
                        variant="standard"
                        key={item.id} // important to include key with field's id
                        {...register(`itemMaster.${index}.gst`)}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <TextField
                        id="standard-basic"
                        label=""
                        variant="standard"
                        disabled={true}
                        key={item.id} // important to include key with field's id
                        {...register(`itemMaster.${index}.gstAmount`)}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <TextField
                        id="standard-basic"
                        label=""
                        variant="standard"
                        disabled={true}
                        key={item.id} // important to include key with field's id
                        {...register(`itemMaster.${index}.netAmount`)}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label=""
                          format="DD/MM/YYYY"
                          slotProps={{
                            textField: {
                              variant: 'standard'
                            }
                          }}
                          {...register(`itemMaster.${index}.deliveryDate`)}
                        />
                      </LocalizationProvider>
                    </TableCell>
                  </TableRow>
                ))}
                {!fields?.length && (
                  <TableRow>
                    <TableCell style={{ textAlign: 'center' }} colSpan={12}>
                      No Records Found
                    </TableCell>{' '}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ mt: 2 }}>
            <Button type="submit" size="large" variant="contained" color="secondary">
              Save
            </Button>
          </Box>
        </Grid>
      </form>
      <Modal open={openObj?.isOpen} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <SelectTable />
        </Box>
      </Modal>
    </MainCard>
  );
};

export default PurchaseOrder;
