import {useState} from "react";
import {Box, Button} from '@mui/material';
import styles from './UserAccount.module.scss';
import FileUploadModal from "../FileUploadModal/FileUploadModal.tsx";


const UserAccount = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Box className={styles.pageContainer}>
            <Button
                variant='contained'
                color='primary'
                onClick={handleOpenModal}
                className={styles.button}
            >
                Создать заявку
            </Button>
            <FileUploadModal
                open={isModalOpen}
                onClose={handleCloseModal}
            />
        </Box>
    );
};

export default UserAccount;
