import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import MainCard from 'ui-component/cards/MainCard';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Autocomplete,
  Button,
  FormControlLabel,
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
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import './HeaderCss.scss';
import { IconSearch } from '@tabler/icons-react';
import SelectTable from './SelectTable';
import { ITEM_CODES, PARTY_LIST, PURCHASE_ORDER_DETAILS } from 'api/model';
import dayjs from 'dayjs';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const PurchaseOrder = () => {
  const [partyList, setPartyList] = useState([]);
  const [openObj, setOpenObj] = React.useState({
    isOpen: false,
    item: null,
    index: null
  });
  const handleOpen = (item, index) =>
    setOpenObj({
      isOpen: true,
      item,
      index
    });
  const handleClose = () =>
    setOpenObj({
      isOpen: false,
      item: null,
      index: null
    });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      poNumber: '',
      invoiceDate: null,
      cmbParty: null,
      gstNumber: '',
      contactNumber: ''
    }
  });

  useEffect(() => {
    setTimeout(() => {
      const partList = PARTY_LIST;
      setPartyList(partList);

      let data = PURCHASE_ORDER_DETAILS;

      data.invoiceDate = data.invoiceDate ? dayjs(data.invoiceDate) : null;

      data.itemMaster =
        data.itemMaster?.map((item) => ({
          ...item,
          deliveryDate: item.deliveryDate ? dayjs(item.deliveryDate) : null,
          itemCodes: item.itemCodes?.map((code) => ITEM_CODES.find((item) => item.id === code)) || [],
          itemGroup: partList.find((f) => f.partyId === item.itemGroup) || null
        })) || [];

      data.cmbParty = partList.find((e) => e.partyId === data.cmbParty) || null;
      reset(data);
    }, 2000);
  }, []);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'itemMaster'
  });

  const saveInvoice = (data) => {
    console.log(data);
  };

  const addItem = () => {
    append({
      itemCodes: [],
      itemName: '',
      itemGroup: null,
      qty: 0,
      rate: 0,
      total: 0,
      gst: 0,
      gstAmount: 0,
      netAmount: 0,
      deliveryDate: null,
      netTotal: 0
    });
  };

  const removeForm = (index) => {
    remove(index);
  };

  const handleSave = (selecTedItem) => {
    setValue(`itemMaster.${openObj?.index}.itemCodes`, selecTedItem);
    handleClose();
  };

  const value = useWatch({
    name: 'itemMaster',
    control
  });

  
  const cmbParty = useWatch({
    name: 'cmbParty',
    control
  });

  useEffect(() => {
    setValue('contactNumber', cmbParty?.contactNumber || '');
    setValue('gstNumber', cmbParty?.gstNo || '');
  }, [cmbParty]);
  
  useEffect(() => {
    console.log('value: ', value);
    let taxable = 0;
    let gstTotal = 0;
    let grand = 0;

    // loop 1
    
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const qty = item.qty || 0;
        const rate = item.rate || 0;
        const gst = item.gst || 0;

        const total = qty * rate;
        const gstAmount = (total * gst) / 100;
        const netTotal = total + gstAmount;

        setValue(`itemMaster.${index}.total`, total);
        setValue(`itemMaster.${index}.gstAmount`, gstAmount);
        setValue(`itemMaster.${index}.netAmount`, netTotal);

        taxable += total;
        gstTotal += gstAmount;
        grand += netTotal;
      });
    }

    // loop 2

    setValue(`taxableAmt`, taxable);
    setValue(`gstAmt`, gstTotal);
    setValue(`grandTotal`, grand);
    setValue(`netAmt`, grand - (grand * getValues('discount')) / 100);
  }, [value]);

  return (
    <MainCard>
      <form onSubmit={handleSubmit(saveInvoice)}>
        <Grid item xs={12} gap={'10px'}>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <FormControl style={{ width: '50%' }} variant="outlined">
              <Controller
                control={control}
                name="poNumber"
                render={({ field }) => {
                  const { onChange, onBlur, value } = field;
                  return (
                    <TextField
                      id="poNumber"
                      label="PO No."
                      variant="outlined"
                      disabled={true}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      defaultValue={''}
                    />
                  );
                }}
              />
            </FormControl>

            <FormControl style={{ width: '50%' }}>
              <Controller
                control={control}
                name="invoiceDate"
                render={({ field }) => {
                  const { onChange, onBlur, value } = field;
                  return (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker label="Invoice Date" format="DD/MM/YYYY" onChange={onChange} onBlur={onBlur} value={value || null} />
                    </LocalizationProvider>
                  );
                }}
              />
            </FormControl>
          </Box>

          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
            <FormControl style={{ width: '50%' }}>
              <Controller
                control={control}
                name="cmbParty"
                render={({ field }) => {
                  const { onChange, onBlur, value } = field;
                  return (
                    <Autocomplete
                      disablePortal
                      id="cmbParty"
                      options={partyList}
                      groupBy={(option) => option.groupId}
                      getOptionLabel={(option) => option?.partyName?.trim()}
                      isOptionEqualToValue={(option, value) => option?.partyId === value?.partyId}
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
                      onChange={(event, selectedOptions) => {
                        onChange(selectedOptions);
                      }}
                      onBlur={onBlur}
                      value={value}
                    />
                  );
                }}
              />
            </FormControl>

            <FormControl style={{ width: '50%' }} variant="outlined">
              <Controller
                control={control}
                name="gstNumber"
                render={({ field }) => {
                  const { onChange, onBlur, value } = field;
                  return (
                    <TextField
                      id="contactNumber"
                      label="GST No"
                      variant="outlined"
                      disabled={true}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      defaultValue={''}
                    />
                  );
                }}
              />
            </FormControl>
          </Box>

          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
            <FormControl style={{ width: 'calc(50% - 10px)' }} variant="outlined">
              <Controller
                control={control}
                name="contactNumber"
                render={({ field }) => {
                  const { onChange, onBlur, value } = field;
                  return (
                    <TextField
                      id="contactNumber"
                      label="Contact No"
                      disabled={true}
                      variant="outlined"
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      defaultValue={''}
                    />
                  );
                }}
              />
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
                      <Button disableRipple onClick={() => handleOpen(item, index)}>
                        {getValues(`itemMaster.${index}.itemCodes`)?.length
                          ? getValues(`itemMaster.${index}.itemCodes`)
                              ?.map((e) => e?.name)
                              .join(', ')
                          : ''}{' '}
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
                        <Controller
                          control={control}
                          name={`itemMaster.${index}.itemGroup`}
                          render={({ field }) => {
                            const { onChange, onBlur, value } = field;
                            return (
                              <Autocomplete
                                disablePortal
                                id="itemGroup"
                                options={partyList}
                                getOptionLabel={(option) => option?.partyName?.trim()}
                                renderInput={(params) => (
                                  <>
                                    <TextField {...params} label="" variant="standard" />
                                  </>
                                )}
                                filterOptions={(options, state) => options}
                                freeSolo={false}
                                isOptionEqualToValue={(option, value) => option?.partyId === value?.partyId}
                                onChange={(event, selectedOptions) => {
                                  onChange(selectedOptions);
                                }}
                                onBlur={onBlur}
                                value={value}
                              />
                            );
                          }}
                        />
                      </FormControl>
                    </TableCell>

                    <TableCell component="th" scope="row">
                      <TextField
                        id="standard-basic"
                        label=""
                        variant="standard"
                        type="number"
                        key={item.id} // important to include key with field's id
                        {...register(`itemMaster.${index}.qty`, {
                          // onChange: (e) => {
                          //   handleQtyChange(index, e.target.value);
                          // }
                        })}
                      />
                    </TableCell>

                    <TableCell component="th" scope="row">
                      <TextField
                        id="standard-basic"
                        label=""
                        variant="standard"
                        type="number"
                        key={item.id} // important to include key with field's id
                        {...register(`itemMaster.${index}.rate`, {})}
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
                        type="number"
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
                      <Controller
                        control={control}
                        name={`itemMaster.${index}.deliveryDate`}
                        render={({ field }) => {
                          const { onChange, onBlur, value } = field;
                          return (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label="Delivery Date"
                                sx={{ width: '110px' }}
                                slotProps={{
                                  textField: {
                                    variant: 'standard'
                                  }
                                }}
                                format="DD/MM/YYYY"
                                onChange={onChange}
                                onBlur={onBlur}
                                value={value || null}
                              />
                            </LocalizationProvider>
                          );
                        }}
                      />
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

        <Grid container direction="row" justifyContent="flex-end" gap="50px">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <FormControlLabel
              control={<TextField size="small" id="taxableAmt" label="" disabled={true} variant="outlined" {...register('taxableAmt')} />}
              labelPlacement="start"
              label={'Taxable Amount'}
              variant="outlined"
              style={{
                gap: '10px'
              }}
            ></FormControlLabel>
            <FormControlLabel
              control={<TextField size="small" id="gstAmt" label="" disabled={true} variant="outlined" {...register('gstAmt')} />}
              labelPlacement="start"
              label={'GST Amount'}
              variant="outlined"
              style={{
                gap: '10px'
              }}
            ></FormControlLabel>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <FormControlLabel
              control={<TextField size="small" id="grandTotal" label="" disabled={true} variant="outlined" {...register('grandTotal')} />}
              labelPlacement="start"
              label={'Grand Total'}
              variant="outlined"
              style={{
                gap: '10px'
              }}
            ></FormControlLabel>
            <FormControlLabel
              control={<TextField size="small" type="number" id="discount" label="" variant="outlined" {...register('discount')} />}
              labelPlacement="start"
              label={'Discount'}
              variant="outlined"
              type="number"
              style={{
                gap: '10px'
              }}
            ></FormControlLabel>
            <FormControlLabel
              control={<TextField size="small" id="netAmt" label="" disabled={true} variant="outlined" {...register('netAmt')} />}
              labelPlacement="start"
              label={'Net Amount'}
              variant="outlined"
              style={{
                gap: '10px'
              }}
            ></FormControlLabel>
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
      <Modal open={openObj?.isOpen} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          {openObj?.isOpen && (
            <SelectTable
              selectedValues={
                getValues(`itemMaster.${openObj?.index}.itemCodes`) ? getValues(`itemMaster.${openObj?.index}.itemCodes`) : null
              }
              onSave={handleSave}
            />
          )}
        </Box>
      </Modal>
    </MainCard>
  );
};

export default PurchaseOrder;
