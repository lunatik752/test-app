import React, {ChangeEvent, MouseEvent, useEffect, useState} from 'react';
import {
    Box,
    Button,
    Collapse,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Typography
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {CheckCircle, ExpandLess, ExpandMore, HourglassEmpty} from '@mui/icons-material';
import {format, isValid, parse} from 'date-fns';
import axios from 'axios';
import FileUploadModal from '../FileUploadModal/FileUploadModal.tsx';
import styles from '../UserAccount/UserAccount.module.scss';
import {RequestJournalRow} from '../../types/types.ts';

const StyledTableHead = styled(TableHead)({
    backgroundColor: '#f0f0f0',
});

const RequestJournal: React.FC = () => {
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<keyof RequestJournalRow>('request_date');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(30);
    const [rows, setRows] = useState<RequestJournalRow[]>([]);
    const [selectedRow, setSelectedRow] = useState<RequestJournalRow | null>(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterFromDate, setFilterFromDate] = useState('');
    const [filterToDate, setFilterToDate] = useState('');
    const [filterStatus, setFilterStatus] = useState<string | boolean>('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage, filterFromDate, filterToDate, filterStatus]);

    const fetchData = async () => {
        try {
            const response = await axios.post('src/data/request-journal-data.json', {
                first_request_date: filterFromDate,
                last_request_date: filterToDate,
                record_status: filterStatus,
                first_record: page * rowsPerPage,
                count: rowsPerPage
            });
            console.log('Fetched data:', response.data); // Проверка данных
            setRows(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleRequestSort = (property: keyof RequestJournalRow) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (_event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRowClick = (row: RequestJournalRow) => {
        setSelectedRow(row);
        setIsModalOpen(true);
    };

    const handleFilterToggle = () => {
        setFilterOpen(!filterOpen);
    };

    const filteredRows = rows.filter(row => {
        const rowDate = new Date(row.request_date).getTime();
        const fromDate = filterFromDate ? parse(filterFromDate, 'yyyy-MM-dd', new Date()).getTime() : -Infinity;
        const toDate = filterToDate ? parse(filterToDate, 'yyyy-MM-dd', new Date()).getTime() : Infinity;
        const statusMatch = filterStatus !== '' ? row.request_processed === filterStatus : true;
        return rowDate >= fromDate && rowDate <= toDate && statusMatch;
    });

    const sortedRows = filteredRows.sort((a, b) => {
        if (orderBy === 'request_date') {
            return order === 'asc' ? new Date(a.request_date).getTime() - new Date(b.request_date).getTime() : new Date(b.request_date).getTime() - new Date(a.request_date).getTime();
        }
        return 0;
    });

    const handleOpenModal = () => {
        setSelectedRow(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Box margin={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant='h4' component='h4'>Журнал заявок</Typography>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={handleOpenModal}
                    className={styles.button}
                >
                    Создать заявку
                </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <Button onClick={handleFilterToggle} endIcon={filterOpen ? <ExpandLess /> : <ExpandMore />}>
                    Фильтр
                </Button>
            </Box>
            <Collapse in={filterOpen}>
                <Box sx={{ p: 2 }}>
                    <Box>
                        <Typography component='h6'>Период</Typography>
                        <TextField
                            label='С'
                            type='date'
                            value={filterFromDate}
                            onChange={(e) => setFilterFromDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ mr: 2 }}
                        />
                        <TextField
                            label='До'
                            type='date'
                            value={filterToDate}
                            onChange={(e) => setFilterToDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel id='status-filter-label'>Статус</InputLabel>
                            <Select
                                labelId='status-filter-label'
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value === '' ? '' : e.target.value === 'true')}
                                label='Статус'
                            >
                                <MenuItem value=''><em>Все</em></MenuItem>
                                <MenuItem value='true'>Обработано</MenuItem>
                                <MenuItem value='false'>Не обработано</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </Collapse>
            <Paper>
                <TableContainer>
                    <Table>
                        <StyledTableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'request_date'}
                                        direction={orderBy === 'request_date' ? order : 'asc'}
                                        onClick={() => handleRequestSort('request_date')}
                                    >
                                        Дата
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Комментарий</TableCell>
                                <TableCell>Обработано</TableCell>
                            </TableRow>
                        </StyledTableHead>
                        <TableBody>
                            {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                <TableRow key={index} onClick={() => handleRowClick(row)} style={{ cursor: 'pointer' }}>
                                    <TableCell>
                                        {isValid(new Date(row.request_date)) ? format(new Date(row.request_date), 'dd.MM.yyyy') : 'Invalid date'}
                                    </TableCell>
                                    <TableCell>{row.request_comment}</TableCell>
                                    <TableCell>
                                        {row.request_processed ? <CheckCircle color='success' /> : <HourglassEmpty color='warning' />}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 30, 50]}
                    component='div'
                    count={sortedRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FileUploadModal
                open={isModalOpen}
                onClose={handleCloseModal}
                selectedRow={selectedRow}
            />
        </Box>
    );
};

export default RequestJournal;