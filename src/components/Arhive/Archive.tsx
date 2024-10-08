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
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Typography,
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {Cancel, CheckCircle, ExpandLess, ExpandMore, HourglassEmpty} from '@mui/icons-material';
import {format, isValid} from 'date-fns';
import axios from 'axios';
import ArchiveModal from "../Modal/ArchiveModal.tsx";
import {ArchiveRowData} from "../../types/types.ts";

type Filter = {
    documentType: string;
    organizationName: string;
    taxPeriod: string;
    recordStatus: string;
};

const StyledTableHead = styled(TableHead)({
    backgroundColor: '#f0f0f0',
});

const Archive: React.FC = () => {
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<keyof ArchiveRowData>('document_date');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(30);
    const [data, setData] = useState<ArchiveRowData[]>([]);
    const [filteredData, setFilteredData] = useState<ArchiveRowData[]>([]);
    const [selectedRow, setSelectedRow] = useState<ArchiveRowData | null>(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [filter, setFilter] = useState<Filter>({
        documentType: '',
        organizationName: '',
        taxPeriod: '',
        recordStatus: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage, filter]);

    const fetchData = async () => {
        try {
            const response = await axios.post<ArchiveRowData[]>('src/data/archive-data.json', {
                documentType: filter.documentType,
                organizationName: filter.organizationName,
                taxPeriod: filter.taxPeriod,
                recordStatus: filter.recordStatus,
                page,
                rowsPerPage
            });
            setData(response.data);
            setFilteredData(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    };

    const handleRequestSort = (property: keyof ArchiveRowData) => {
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

    const handleRowClick = (row: ArchiveRowData) => {
        setSelectedRow(row);
        setIsModalOpen(true);
    };

    const handleFilterToggle = () => {
        setFilterOpen(!filterOpen);
    };

    const handleFilterChange = (event: SelectChangeEvent<string>) => {
        const {name, value} = event.target;
        setFilter((prevFilter) => ({
            ...prevFilter,
            [name as string]: value as string
        }));
    };

    useEffect(() => {
        const applyFilter = () => {
            let filtered = data;

            if (filter.documentType) {
                filtered = filtered.filter(item => item.document_type === filter.documentType);
            }
            if (filter.organizationName) {
                filtered = filtered.filter(item => item.organization_name.includes(filter.organizationName));
            }
            if (filter.taxPeriod) {
                filtered = filtered.filter(item => item.tax_period === filter.taxPeriod);
            }
            if (filter.recordStatus) {
                filtered = filtered.filter(item => item.record_status === filter.recordStatus);
            }

            setFilteredData(filtered);
        };

        applyFilter();
    }, [filter, data]);

    const sortedRows = filteredData.sort((a, b) => {
        if (orderBy === 'document_date') {
            return order === 'asc' ? new Date(a.document_date).getTime() - new Date(b.document_date).getTime() : new Date(b.document_date).getTime() - new Date(a.document_date).getTime();
        }
        return 0;
    });

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'IN_PROCESS':
                return <HourglassEmpty color="action"/>;
            case 'FINISHED':
                return <CheckCircle color="success"/>;
            case 'REJECTED':
                return <Cancel color="error"/>;
            default:
                return null;
        }
    };

    return (
        <Box margin={2}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Typography variant='h4' component='h4'>Архив</Typography>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', p: 2}}>
                <Button onClick={handleFilterToggle} endIcon={filterOpen ? <ExpandLess/> : <ExpandMore/>}>
                    Фильтр
                </Button>
            </Box>
            <Collapse in={filterOpen}>
                <Box sx={{p: 2}}>
                    <Box>
                        <Typography component='h6'>Период</Typography>
                        <TextField
                            label='С'
                            type='date'
                            value={filter.documentType}
                            onChange={(e) => setFilter({...filter, documentType: e.target.value})}
                            InputLabelProps={{shrink: true}}
                            sx={{mr: 2}}
                        />
                        <TextField
                            label='До'
                            type='date'
                            value={filter.organizationName}
                            onChange={(e) => setFilter({...filter, organizationName: e.target.value})}
                            InputLabelProps={{shrink: true}}
                        />
                    </Box>
                    <Box sx={{mt: 2}}>
                        <FormControl fullWidth>
                            <InputLabel id='document-type-filter-label'>Тип документа</InputLabel>
                            <Select
                                labelId='document-type-filter-label'
                                name='documentType'
                                value={filter.documentType}
                                onChange={handleFilterChange}
                                label='Тип документа'
                            >
                                <MenuItem value=''><em>Все</em></MenuItem>
                                <MenuItem value='IN'>Входящий</MenuItem>
                                <MenuItem value='OUT'>Исходящий</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{mt: 2}}>
                        <FormControl fullWidth>
                            <InputLabel id='tax-period-filter-label'>Налоговый период</InputLabel>
                            <Select
                                labelId='tax-period-filter-label'
                                name='taxPeriod'
                                value={filter.taxPeriod}
                                onChange={handleFilterChange}
                                label='Налоговый период'
                            >
                                <MenuItem value=''><em>Все</em></MenuItem>
                                <MenuItem value='PERIOD_MONTH'>Месяц</MenuItem>
                                <MenuItem value='PERIOD_Q1'>1 квартал</MenuItem>
                                <MenuItem value='PERIOD_Q2'>2 квартал</MenuItem>
                                <MenuItem value='PERIOD_Q3'>3 квартал</MenuItem>
                                <MenuItem value='PERIOD_Q4'>4 квартал</MenuItem>
                                <MenuItem value='PERIOD_YEAR'>Год</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{mt: 2}}>
                        <FormControl fullWidth>
                            <InputLabel id='status-filter-label'>Статус</InputLabel>
                            <Select
                                labelId='status-filter-label'
                                name='recordStatus'
                                value={filter.recordStatus}
                                onChange={handleFilterChange}
                                label='Статус'
                            >
                                <MenuItem value=''><em>Все</em></MenuItem>
                                <MenuItem value='IN_PROCESS'>В обработке</MenuItem>
                                <MenuItem value='FINISHED'>Завершена</MenuItem>
                                <MenuItem value='REJECTED'>Отвергнута</MenuItem>
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
                                        active={orderBy === 'document_date'}
                                        direction={orderBy === 'document_date' ? order : 'asc'}
                                        onClick={() => handleRequestSort('document_date')}
                                    >
                                        Дата
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Номер исходного документа</TableCell>
                                <TableCell>Тип исходного документа</TableCell>
                                <TableCell>Имя организации</TableCell>
                                <TableCell>Налоговый период</TableCell>
                                <TableCell>Статус заявки</TableCell>
                            </TableRow>
                        </StyledTableHead>
                        <TableBody>
                            {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                <TableRow key={index} onClick={() => handleRowClick(row)} style={{cursor: 'pointer'}}>
                                    <TableCell>
                                        {isValid(new Date(row.document_date)) ? format(new Date(row.document_date), 'dd.MM.yyyy') : 'Invalid date'}
                                    </TableCell>
                                    <TableCell>{row.document_number}</TableCell>
                                    <TableCell>{row.document_type === 'IN' ? 'Входящий' : 'Исходящий'}</TableCell>
                                    <TableCell>{row.organization_name}</TableCell>
                                    <TableCell>{row.tax_period}</TableCell>
                                    <TableCell>{getStatusIcon(row.record_status)}</TableCell>
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
            {
                selectedRow && (
                <ArchiveModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    selectedRow={selectedRow}
                />
            )}
        </Box>
    );
};

export default Archive;