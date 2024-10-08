import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {AppBar, Toolbar, Typography, Avatar, Box, Button} from '@mui/material';
import styles from './Header.module.scss';
import classnames from 'classnames';

const Header: React.FC = () => {

    const [activeLink, setActiveLink] = useState(location.pathname);

    const handleLinkClick = (path: string) => {
        setActiveLink(path);
    };

    return (
        <AppBar position='static'>
            <Toolbar className={styles.toolbar}>
                <Box display={'flex'} justifyContent={'space-between'} gap={'16px'} className={styles.navBar}>
                    <Button
                        color='inherit'
                        component={Link}
                        to='/'
                        className={classnames(styles.navLink, activeLink === '/' && styles.selected)}
                        onClick={() => handleLinkClick('/')}
                    >
                        Личный кабинет
                    </Button>
                    <Button
                        color='inherit'
                        component={Link}
                        to='/requestJournal'
                        className={classnames(styles.navLink, activeLink === '/requestJournal' && styles.selected)}
                        onClick={() => handleLinkClick('/requestJournal')}
                    >
                        Журнал заявок
                    </Button>
                    <Button
                        color='inherit'
                        component={Link}
                        to='/archive'
                        className={classnames(styles.navLink, activeLink === '/archive' && styles.selected)}
                        onClick={() => handleLinkClick('/archive')}
                    >
                        Архив заявок
                    </Button>
                </Box>
                <Box gap={'8px'} className={styles.userInfo}>
                    <Avatar src={''} alt={``}/>
                    <Box display={'flex'} flexDirection={'column'} gap={'4'}>
                        <Typography variant='body1' className={styles.userName}>
                            Имя Фамилия
                        </Typography>
                        <Typography variant='body2' className={styles.userEmail}>
                            email@test.com
                        </Typography>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
