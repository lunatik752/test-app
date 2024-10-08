import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Modal,
    Typography
} from '@mui/material';
import { Close as CloseIcon, Download as DownloadIcon, CheckCircle, Cancel, HourglassEmpty } from '@mui/icons-material';
import { format } from 'date-fns';
import {ArchiveRowData, File} from "../../types/types.ts";


const getFileExtension = (fileName: string) => {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
};

const getFilePreview = (file: File) => {
    const extension = getFileExtension(file.file_name).toLowerCase();
    switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'bmp':
            return <Avatar src={file.file_presentation} alt={file.file_name} variant='square' />;
        case 'pdf':
            return <Avatar src={'src/assets/icons/pdf.png'} alt={file.file_name} variant='square' />;
        case 'doc':
        case 'docx':
            return <Avatar src={'src/assets/icons/doc.png'} alt={file.file_name} variant='square' />;
        case 'xls':
        case 'xlsx':
            return <Avatar src={'src/assets/icons/xls.png'} alt={file.file_name} variant='square' />;
        case 'rtf':
            return <Avatar src={'src/assets/icons/rtf.png'} alt={file.file_name} variant='square' />;
        default:
            return <Avatar variant='square'>{file.file_name[0]}</Avatar>;
    }
};

const downloadFile = (file: File) => {
    const url = file.file_presentation;
    const a = document.createElement('a');
    a.href = url;
    a.download = file.file_name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

const ArchiveModal: React.FC<{ open: boolean; onClose: () => void; selectedRow: ArchiveRowData  }> = ({
                                                                                                           open,
                                                                                                           onClose,
                                                                                                           selectedRow
                                                                                                       }) => {
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        if (selectedRow) {
            setFiles(selectedRow.files);
        }
    }, [selectedRow]);

    const handleOnClose = () => {
        setFiles([]);
        onClose();
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'IN_PROCESS':
                return <HourglassEmpty color='warning' />;
            case 'FINISHED':
                return <CheckCircle color='success' />;
            case 'REJECTED':
                return <Cancel color='error' />;
            default:
                return null;
        }
    };

    const getDocumentType = (type: string) => {
        return type === 'IN' ? 'Входящий' : 'Исходящий';
    };

    return (
        <Modal open={open} onClose={handleOnClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant='h5' component='h2'>
                        Заявка
                    </Typography>
                    <IconButton size='medium' onClick={handleOnClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                {selectedRow && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant='body2'>Дата документа: {format(new Date(selectedRow.document_date), 'dd.MM.yyyy')}</Typography>
                            <Typography variant='body2'>Номер документа: {selectedRow.document_number}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant='body2'>Тип документа: {getDocumentType(selectedRow.document_type)}</Typography>
                            <Typography variant='body2'>Дата записи: {format(new Date(selectedRow.record_date), 'dd.MM.yyyy')}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant='body2'>Статус записи: {getStatusIcon(selectedRow.record_status)}</Typography>
                            <Typography variant='body2'>Комментарий к статусу: {selectedRow.record_status_comment}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant='body2'>Комментарий к записи: {selectedRow.record_comment}</Typography>
                            <Typography variant='body2'>Организация: {selectedRow.organization_name}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant='body2'>Налоговый период: {selectedRow.tax_period}</Typography>
                            <Typography variant='body2'>Конец налогового периода: {format(new Date(selectedRow.tax_period_end_date), 'dd.MM.yyyy')}</Typography>
                        </Box>
                    </Box>
                )}
                <List>
                    {files.map((file, index) => (
                        <ListItem key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <ListItemAvatar>
                                {getFilePreview(file)}
                            </ListItemAvatar>
                            <ListItemText primary={file.file_name} />
                            <IconButton edge='end' aria-label='download' onClick={() => downloadFile(file)}>
                                <DownloadIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant='outlined' onClick={handleOnClose}>
                        Закрыть
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ArchiveModal;