
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from './NotFoundPage.module.scss';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Box className={styles.container}>
            <Typography variant='h1' component='h1' className={styles.title}>
                404
            </Typography>
            <Typography variant='h6' component='h6' className={styles.subtitle} gutterBottom>
                Страница не найдена
            </Typography>
            <Typography variant='body1' component='p' className={styles.description} gutterBottom>
                К сожалению, страница, которую вы ищете, не существует.
            </Typography>
            <Button variant='contained' color='primary' onClick={handleGoHome} className={styles.button}>
                Вернуться на главную
            </Button>
        </Box>
    );
};

export default NotFoundPage;