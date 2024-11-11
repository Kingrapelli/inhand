// src/SideMenu.js
import React, { useState } from 'react';
import { Box, IconButton, Drawer, List, ListItem, ListItemText, AppBar, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './SideMenu.css';

const menuData = [
    {
        title: 'Dashboard',
        subItems: []
    },
    {
        title: 'Settings',
        subItems: [
            { title: 'Profile' },
            { title: 'Account' },
            { title: 'Privacy' }
        ]
    },
    {
        title: 'Reports',
        subItems: [
            { title: 'Daily Report' },
            { title: 'Monthly Report' }
        ]
    },
    {
        title: 'Help',
        subItems: [
            { title: 'FAQ' },
            { title: 'Contact Support' }
        ]
    }
];

const SideMenu = () => {
    const [openDrawer, setOpenDrawer] = useState(true);
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const toggleDrawer = (open) => () => {
        setOpenDrawer(open);
    };

    const drawer = (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            // onClick={toggleDrawer(false)}
            // onKeyDown={toggleDrawer(false)}
        >
            <List>
                {menuData.map((item, index) => (
                    <ListItem button key={index} onClick={() => handleToggle(index)}>
                        <ListItemText primary={item.title} />
                        {item.subItems.length > 0 && (
                            <span className={`dropdown-icon ${openIndex === index ? 'open' : ''}`}>
                                {openIndex === index ? '▲' : '▼'}
                            </span>
                        )}
                        {item.subItems.length > 0 && openIndex === index && (
                            <List component="div" disablePadding>
                                {item.subItems.map((subItem, subIndex) => (
                                    <ListItem button key={subIndex} sx={{ pl: 4 }}>
                                        <ListItemText primary={subItem.title} />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                    <h6 style={{ flexGrow: 1 }}>My Application</h6>
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer(false)}>
                {drawer}
            </Drawer>
        </Box>
    );
};

export default SideMenu;
