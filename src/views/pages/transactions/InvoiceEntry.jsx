import React, { useEffect, useLayoutEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import MainCard from 'ui-component/cards/MainCard';
import { height } from '@mui/system';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Autocomplete, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PartyHeader from './PartyHeader';
import api from '../../../api/axios';
import './HeaderCss.scss'
import { Form, useFieldArray, useForm } from 'react-hook-form';

const InvoiceEntry = () => {

    const [number, setNumber] = useState();
    
    const numberOnly = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setNumber(value);
    };

    const [partyList, setPartyList] = useState([]);

    useEffect(() => {
        api.get('/InvoiceEntry/GetPartyList', {
            //params: data
        }).then(function (response) {
            setPartyList(response.data.lstParty);
        })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    }, []);

    const { register, handleSubmit, watch, setValue, control,getValues, formState: { errors } } = useForm();

    const { fields, append, prepend, remove, swap, move, insert, update } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormProvider)
        name: 'itemMaster' // unique name for your Field Array1
    });

    const { fields: fields1, append: append1, prepend: prepend1, remove: remove1, swap:swap1, move1, insert1, update1 } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormProvider)
        name: 'itemMaster2' // unique name for your Field Array1
    });

    const calculateAmount = (index) => {
        // const item = fields[index]
        const item = getValues(`itemMaster.${index}`)
        console.log('item: ', item);
        const qty = parseFloat(item.qty) || 0;
        const rate = parseFloat(item.rate) || 0;
        const amount = qty * rate;
        console.log('amount: ', amount);
        setValue(`itemMaster.${index}.amount`, amount.toFixed(2));
    };

    const handleQtyChange = (index, value) => {
        console.log('index: ', index);
        // setValue(`itemMaster.${index}.qty`, value);
        // setValue(`itemMaster.${index}.amount`, 100);
        // console.log('{...field[0], amount: 100}: ', {...fields[0], amount: 100});
        // update(0, {...fields[0],qty:value, amount: 100});
        calculateAmount(index);
    };

    const handleRateChange = (index, value) => {
        // setValue(`itemMaster.${index}.rate`, value);
        // setValue(`itemMaster.${index}.amount`, 100);
        // update(0, {...fields[0],rate:value, amount: 100});

        calculateAmount(index);
    };

    const saveInvoice = (data) => {
        console.log(data)
    };

    const addItem = () => {
        append({ itemCode: '', itemName: '', qty: 0, rate: 0.00, amount: 0.00 });
    };

    const removeForm = (index) => {
        remove(index);
    };

    const addItem1 = () => {
        append1({ itemCode: '', itemName: '', qty: 0, rate: 0.00, amount: 0.00 });
    };

    const removeForm1 = (index) => {
        remove1(index);
    };

    return (
        <>
            <MainCard style={{ height: '95vh' }}>
                <form onSubmit={handleSubmit(saveInvoice)} >
                    <Grid item xs={12}>

                        <Box sx={{ alignItems: 'center', }}>



                            <FormControl style={{ width: 200 }} variant="outlined">
                                <TextField id="txtBillNo" label="Bill No" variant="outlined" {...register('billNo')} />
                            </FormControl>

                            <FormControl style={{ width: 200, marginLeft: 20 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}  >
                                    <DatePicker label="Bill Date" format='DD/MM/YYYY' {...register('billDate')} />
                                </LocalizationProvider>
                            </FormControl>

                            <FormControl style={{ width: 300, marginLeft: 20 }}>
                                <Autocomplete
                                    disablePortal
                                    id="cmbParty"
                                    options={partyList}
                                    sx={{ width: 1000 }}
                                    groupBy={(option) => option.groupId}
                                    getOptionLabel={(option) => option.name.trim()}
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
                                                    <span >{option?.name}</span>
                                                    <span >{option?.gSTIN}</span>
                                                    <span className="text-wrap" >{option?.areaName}</span>
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
                        </Box>
                    </Grid>

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
                                                <Button onClick={() => removeForm(index)}>Remove</Button>
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
                                                    label="Test"
                                                    variant="standard"
                                                    key={item.id} // important to include key with field's id
                                                    //onChange={e => calculateAmount(item.id, 'qty', parseFloat(e.target.value) || 0)}
                                                    // onChange={e => handleQtyChange(index, e.target.value)}
                                                   
                                                    {...register(`itemMaster.${index}.qty`, { 
                                                        onChange: (e) => {handleQtyChange(index, e.target.value)},
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
                                                        onChange: (e) => {handleRateChange(index, e.target.value)},
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

                    <Grid>

<TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
            <TableRow>
                <TableCell>
                    <Button onClick={addItem1}>Add</Button>
                </TableCell>
                <TableCell>Item Code</TableCell>
                <TableCell>Item Name</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Amount</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {fields1.map((item, index) => (

                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>

                    <TableCell>
                        <Button onClick={() => removeForm1(index)}>Remove</Button>
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
                            label="Test"
                            variant="standard"
                            key={item.id} // important to include key with field's id
                            //onChange={e => calculateAmount(item.id, 'qty', parseFloat(e.target.value) || 0)}
                            // onChange={e => handleQtyChange(index, e.target.value)}
                           
                            {...register(`itemMaster.${index}.qty`, { 
                                onChange: (e) => {handleQtyChange(index, e.target.value)},
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
                                onChange: (e) => {handleRateChange(index, e.target.value)},
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

                    <Grid item xs={12}>
                        <Box sx={{ mt: 2 }}>
                            <Button type="submit" size="large" variant="contained" color="secondary">
                                Save
                            </Button>
                        </Box>
                    </Grid>
                </form>

            </MainCard>
        </>
    )
}

export default InvoiceEntry