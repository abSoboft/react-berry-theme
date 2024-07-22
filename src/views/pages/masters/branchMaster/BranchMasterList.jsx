import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import api from '../../../../api/axios';

const BranchMasterList = () => {
    
    const [branchList, setBranchList] = useState([]);

    useEffect(() => {
        
        api.get('/BranchMaster/GetBranchList', {
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

     }, [])

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'branchCode',
            headerName: 'Branch Code',
            width: 200,
            editable: true,
        },
        {
            field: 'branchName',
            headerName: 'Branch Name',
            width: 250,
            editable: true,
        },
    ];


    return (
        <div>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={branchList}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </Box>
        </div>
    )
}

export default BranchMasterList
