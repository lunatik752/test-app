import React, { useEffect, useState } from 'react';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Modal,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon, } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import styles from './FileUploadModal.module.scss';
import { format } from 'date-fns';
import {FileType, RequestJournalRow} from "../../types/types.ts";

const base64ToFiles = (base64Files: FileType[]) => {
    return base64Files.map(({ file_data, file_name }) => {
        const byteString = atob(file_data);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const intArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            intArray[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([intArray], { type: 'application/octet-stream' });
        return new File([blob], file_name, { type: 'application/octet-stream' });
    });
}

const getFileExtension = (fileName: string) => {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
};

const getFilePreview = (file: File) => {
    const extension = getFileExtension(file.name).toLowerCase();
    switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'bmp':
            return <Avatar src={URL.createObjectURL(file)} alt={file.name} variant='square' />;
        case 'pdf':
            return <Avatar src={'src/assets/icons/pdf.png'} alt={file.name} variant='square' />;
        case 'doc':
        case 'docx':
            return <Avatar src={'src/assets/icons/doc.png'} alt={file.name} variant='square' />;
        case 'xls':
        case 'xlsx':
            return <Avatar src={'src/assets/icons/xls.png'} alt={file.name} variant='square' />;
        case 'rtf':
            return <Avatar src={'src/assets/icons/rtf.png'} alt={file.name} variant='square' />;
        default:
            return <Avatar variant='square'>{file.name[0]}</Avatar>;
    }
};


const FileUploadModal: React.FC<{ open: boolean; onClose: () => void; selectedRow?: RequestJournalRow | null }> = ({
                                                                                                         open,
                                                                                                         onClose,
                                                                                                         selectedRow,
                                                                                                     }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [comment, setComment] = useState<string>('');
    const [errors, setErrors] = useState<{ files: boolean; comment: boolean }>({ files: false, comment: false });
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error'
    }>({ open: false, message: '', severity: 'success' });
    const [deleteRequest, setDeleteRequest] = useState<boolean>(false);

    useEffect(() => {
        if (selectedRow) {
            setComment(selectedRow.request_comment)
            setFiles(base64ToFiles(selectedRow.files))
        }
    }, [selectedRow])

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/bmp': ['.bmp'],
            'image/tiff': ['.tiff'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/rtf': ['.rtf'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
        },
        maxSize: 3 * 1024 * 1024,
        onDrop: acceptedFiles => {
            setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
            setErrors(prevErrors => ({ ...prevErrors, files: false }));
        }
    });

    const handleDelete = (fileToDelete: File) => {
        setFiles(prevFiles => prevFiles.filter(file => file !== fileToDelete));
    };

    const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
        if (event.target.value.trim() !== '') {
            setErrors(prevErrors => ({ ...prevErrors, notes: false }));
        }
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDeleteRequest(event.target.checked);
    };

    const convertFilesToBase64 = (files: File[]): Promise<{ file_name: string, file_data: string }[]> => {
        return Promise.all(files.map(file => {
            return new Promise<{ file_name: string, file_data: string }>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    resolve({
                        file_name: file.name,
                        file_data: reader.result as string
                    });
                };
                reader.onerror = error => reject(error);
            });
        }));
    };

    const handleSubmit = async () => {
        const hasErrors = {
            files: files.length === 0,
            comment: comment.trim() === ''
        };

        setErrors(hasErrors);

        if (!hasErrors.files && !hasErrors.comment) {
            try {
                const base64Files = await convertFilesToBase64(files);

                const data: any = {
                    files: base64Files,
                    request_comment: comment
                };

                if (selectedRow && !selectedRow.request_processed) {
                    data.delete_request = deleteRequest;
                    data.request_guid = selectedRow.request_guid;
                }

                await axios.post('src/data/request-data.json', data);
//В зависимости от запроса (создание новой заявки, изменение существующей или удаление) адрес запроса может изменяться

                setSnackbar({ open: true, message: 'Заявка успешно отправлена', severity: 'success' });
                setFiles([]);
                setComment('');
                setDeleteRequest(false);
                onClose();
            } catch (error) {
                setSnackbar({ open: true, message: `Ошибка при отправке заявки. ${error}`, severity: 'error' });
            }
        }
    };

    const handleOnClose = () => {
        setFiles([]);
        setComment('');
        setDeleteRequest(false);
        onClose();
    }

    return (
        <>
            <Modal open={open} onClose={handleOnClose}>
                <Box className={styles.modal}>
                    <Box className={styles.header}>
                        <Typography variant='h5' component='h2'>
                            Заявка
                        </Typography>
                        <IconButton size={'medium'} onClick={handleOnClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Typography variant='body2' sx={{ mb: 2 }}>
                        Дата создания заявки: {selectedRow ? format(new Date(selectedRow.request_date), 'dd.MM.yyyy') : new Date().toLocaleDateString('ru-RU')}
                    </Typography>
                    {
                        selectedRow
                            ? <Typography variant='body2' sx={{ mb: 2 }}>
                                {selectedRow.request_processed ? 'Заявка обработана' : 'Заявка не обработана'}
                            </Typography>
                            : <Typography variant='body2' sx={{ mb: 2 }}>
                                Новая заявка
                            </Typography>
                    }
                    {
                        !(selectedRow && selectedRow.request_processed) &&
                        <>
                            <Box {...getRootProps()} className={styles.dropzone}>
                                <input {...getInputProps()} />
                                <Typography>Перетащите файлы сюда или нажмите для выбора</Typography>
                            </Box>
                            {errors.files &&
                                <Typography color='error'>Пожалуйста, добавьте хотя бы один файл.</Typography>}
                        </>
                    }
                    <List className={styles.fileList}>
                        {
                            files.map((file, index) => (
                                <ListItem key={index} className={styles.fileItem}>
                                    <ListItemAvatar>
                                        {getFilePreview(file)}
                                    </ListItemAvatar>
                                    <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`}
                                                  className={styles.fileName} />
                                    {
                                        !(selectedRow && selectedRow.request_processed) &&
                                            <IconButton edge='end' aria-label='delete' onClick={() => handleDelete(file)}
                                                        className={styles.deleteButton}>
                                                <DeleteIcon />
                                            </IconButton>
                                    }
                                </ListItem>
                            ))
                        }
                    </List>
                    <TextField
                        label='Примечания'
                        multiline
                        rows={4}
                        fullWidth
                        value={comment}
                        onChange={handleNotesChange}
                        sx={{ mb: 2 }}
                        error={errors.comment}
                        helperText={errors.comment ? 'Поле комментарий обязательно для заполнения.' : ''}
                        disabled={!!selectedRow && selectedRow.request_processed}
                    />
                    {
                        selectedRow && !selectedRow.request_processed &&
                        <FormControlLabel
                            control={<Checkbox checked={deleteRequest} onChange={handleCheckboxChange} />}
                            label='Удалить заявку'
                        />
                    }
                    <Box className={styles.actions}>
                        {
                            !(selectedRow && selectedRow.request_processed) &&
                            <Button variant='contained' color='primary' onClick={handleSubmit} sx={{ mr: 1 }}>
                                Отправить
                            </Button>
                        }
                        <Button variant='outlined' onClick={handleOnClose}>
                            Закрыть
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Snackbar open={snackbar.open} autoHideDuration={6000}
                      onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}
                       sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default FileUploadModal;
