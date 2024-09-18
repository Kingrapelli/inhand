import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../App.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

const pages = ['Home','Bookings','Shopping','Food'];
const settings = ['Profile', 'Dashboard','Settings', 'Logout'];

function Header(){
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    let user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    useEffect(()=>{
    })

    function handleLogout(){
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login')
    }

    return (
        <>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component={Link}
                            to={'/'}
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            INHAND
                        </Typography>
                        {
                        user && 
                            <>
                                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                    {pages.map((page) => (
                                        <Button
                                            key={page}
                                            component={Link}
                                            to={`/${page.toLowerCase()}`}
                                            sx={{ my: 2, color: 'white', display: 'block' }}
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                </Box>
                                <Box sx={{ flexGrow: 0 }} >
                                    <Tooltip title="Open settings">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar alt="Remy Sharp" src={user.image} /> 
                                            {/* /static/images/avatar/2.jpg */}
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        <MenuItem key={user.name} >
                                            <Typography sx={{ textAlign: 'center' }}>{user.name}</Typography>
                                        </MenuItem>
                                        {settings.map((setting) => (
                                            <MenuItem key={setting} 
                                                to={
                                                    (`/${setting.toLowerCase()}` != '/logout') &&  `/${setting.toLowerCase()}`
                                                }
                                                onClick = {()=>{
                                                    if(`/${setting.toLowerCase()}` == '/logout')
                                                        handleLogout()
                                                }}
                                                component={Link}
                                            >
                                            <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Box>
                            </>
                        }
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    )
}

export default Header;