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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Invoice_React = () => {
  const [invoiceList, setInvoiceList] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const navigate = useNavigate();

  const getInvoices = (pageTemp = page, rowsPerPageTemp = rowsPerPage) => {
    api
      .get(`/Invoice_React/GetInvoiceList?page=${pageTemp}&rowsPerPage=${rowsPerPageTemp}`, {
        //params: data
      })
      .then(function (response) {
        setInvoiceList(response.data.lstInvoice);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  };

  useEffect(() => {
    getInvoices();
  }, []);

  const addInvoiceReact = () => {
    console.log('addInvoiceReact');
    navigate('/Transaction/Invoice_React_Entry');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    getInvoices(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    getInvoices(0, event.target.value);
  };

  const visibleInvoices = React.useMemo(
    () => invoiceList?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [invoiceList, page, rowsPerPage]
  );

  return (
    <>
      <MainCard>
        <Grid item xs={12}>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 340 }}>
              <Table stickyHeader aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Button onClick={() => addInvoiceReact()}>Add</Button>
                    </TableCell>
                    <TableCell>Invoice Id</TableCell>
                    <TableCell>Invoice No</TableCell>
                    <TableCell>Invoice Date</TableCell>
                    <TableCell>Party Name</TableCell>
                    <TableCell>Grand Total</TableCell>
                    <TableCell>Discount Amount</TableCell>
                    <TableCell>GST Amount</TableCell>
                    <TableCell>Net Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleInvoices.map((invLine, index) => (
                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
                        <Button onClick={() => removeForm(index)}>Remove</Button>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {invLine.invoiceId}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {invLine.invoiceNo}
                      </TableCell>

                      <TableCell component="th" scope="row">
                        {invLine.invoiceDate}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {invLine.partyName}
                      </TableCell>

                      <TableCell component="th" scope="row">
                        {invLine.grandTotal}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {invLine.discountAmount}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {invLine.gstAmount}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {invLine.netAmount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            count={invoiceList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          ></TablePagination>
        </Grid>
      </MainCard>
    </>
  );
};

export default Invoice_React;
