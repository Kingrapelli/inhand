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
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { styled, alpha } from '@mui/material/styles';

const pages = ['Home','Bookings','Shopping','Food'];
const settings = ['Profile', 'Dashboard','Settings', 'Logout'];


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
}));
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
  
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
}));

function Header(){
    let user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(()=>{
    })

    function handleLogout(){
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login')
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const isNotificationOpen = Boolean(notificationAnchorEl);


    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
        setNotificationAnchorEl();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleNotificationOpen = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <>{
            user && <>
                <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    id={menuId}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
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
            </>
        }
        </>
    );

    const notificationId = 'primary-notification-menu';
    const renderNotification = (
        <>{
            user && <>
                <Menu
                    anchorEl={notificationAnchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    id={notificationId}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={isNotificationOpen}
                    onClose={handleMenuClose}
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
            </>
        }
        </>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <>
            {
                user && <>
                <Menu
                    anchorEl={mobileMoreAnchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    id={mobileMenuId}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={isMobileMenuOpen}
                    onClose={handleMobileMenuClose}
                    >
                    <MenuItem>
                        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                        <Badge badgeContent={4} color="error">
                            <MailIcon />
                        </Badge>
                        </IconButton>
                        <p>Messages</p>
                    </MenuItem>
                    <MenuItem onClick={handleNotificationOpen}>
                        <IconButton
                        size="large"
                        aria-label="show 17 new notifications"
                        aria-controls="primary-notification-menu"
                        aria-haspopup="true"
                        color="inherit"
                        >
                        <Badge badgeContent={0} color="error">
                            <NotificationsIcon />
                        </Badge>
                        </IconButton>
                        <p>Notifications</p>
                    </MenuItem>
                    <MenuItem onClick={handleProfileMenuOpen}>
                        <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="primary-search-account-menu"
                        aria-haspopup="true"
                        color="inherit"
                        >
                        {/* <AccountCircle /> */}
                        <Avatar alt="Remy Sharp" src={user.image} />
                        </IconButton>
                        <p>Profile</p>
                    </MenuItem>
                </Menu>
                </>
            }
        </>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
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
                user && <>
                    <Search>
                        <SearchIconWrapper>
                        <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                        <Badge badgeContent={4} color="error">
                            <MailIcon />
                        </Badge>
                        </IconButton>
                        <IconButton onClick={handleNotificationOpen}
                        size="large"
                        aria-label="show 17 new notifications"
                        color="inherit"
                        >
                        <Badge badgeContent={17} color="error">
                            <NotificationsIcon />
                        </Badge>
                        </IconButton>
                        <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }} style={{marginLeft:'10px'}}>
                            <Avatar alt="Remy Sharp" src={user.image} />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                        size="large"
                        aria-label="show more"
                        aria-controls={mobileMenuId}
                        aria-haspopup="true"
                        onClick={handleMobileMenuOpen}
                        color="inherit"
                        >
                        <MoreIcon />
                        </IconButton>
                    </Box>
                </>
            }
            </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
        {renderNotification}
        </Box>
    );
}

export default Header;