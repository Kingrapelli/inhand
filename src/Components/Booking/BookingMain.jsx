import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Grid, IconButton, Box, List, ListItem, ListItemText, Drawer } from '@mui/material';
import Bookings from '../Enums/BookingEnum';
import Locations from '../Enums/LocationEnum';
import { DBJSON_URL } from '../../Services/auth';
import MenuIcon from '@mui/icons-material/Menu';

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

function BookingMain(){
    const navigate = useNavigate();
    const [location, setLocation] = useState(4001);
    const [transports , setTransports] = useState();
    const [bookingtype , setBookingType] = useState(1001);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openIndex, setOpenIndex] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect( ()=>{
        handleRequest(null);
    },[location])

    const handleRequest = async (e) => {
        
        const req = await fetch(`${DBJSON_URL}/transport`,{
            method: 'GET',
            headers: {
                "Content-Type" : 'application/json'
            }
        });
        const res = await req.json();
        if(res.length > 0){
            let _res;
            if(e == null){
                _res = await res.filter(item=> {
                    return Number(item.type) == '1001' && item.location == location;
                });
                setTransports(_res);
            }
            else if(e && e.target && e.target.value){
                setBookingType(e.target.value);
                _res = await res.filter(item=> {
                    return Number(item.type) == e.target.value && item.location == location;
                });
                setTransports(_res);
            }
            if(_res && _res.length == 0){
                setTransports([]);
            }
        }else{
            setTransports([]);
        }
    }

    function getMasterDataById (id,type){
        let _type = (type == 'location') ? Locations : (type == 'bookingtype' ? Bookings : []);
        for(let item of _type){
            if(item.value == id){
                return item.name;
            }
        }
    }

    const handleChange = (event) => {
        setLocation(event.target.value); // Update state when dropdown changes
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

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const toggleDrawer = (open) => () => {
        setOpenDrawer(open);
    };

    return (
        < >
            <IconButton 
                style={{position:'absolute', left:'10px'}} 
                edge="start" color="inherit" aria-label="menu" 
                onClick={toggleDrawer(true)}>
                <MenuIcon />
            </IconButton>
            <div className='container' style={{ display: 'flex', overflowY:'auto'}}>
                <div style={{height: '100% !important', width:'1072px !important'}}> 
                    <h5 style={{float:'left'}}>- Bookings / {getMasterDataById(bookingtype,'bookingtype')}</h5>
                    <div style={{ border: '0px solid', margin: "20px"}}>
                        
                        <Link to="/bookings/new">
                            <button type="button" key='create' className='createButton'>Create</button>
                        </Link>
                        <select id='location' value={location} onChange={handleChange}>
                            <option value="" disabled>Select a location</option>
                            {Locations.map((location) => (
                                <option key={location.value} value={location.value}>{location.name}</option>
                            ))}
                        </select>

                        <Grid container spacing={3} style={{overflowY:'auto'}}>
                            {transports && transports.map((item) => (
                                <Card sx={{ maxWidth: 450 , width:350, minWidth:100, margin:'10px'}}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image="https://via.placeholder.com/150"
                                        alt="Placeholder image"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {item.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {/* This is a Material UI card that has an image, content, and action buttons. */}
                                            {getMasterDataById(item.location,'location')} - {item.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small">Share</Button>
                                        <Button size="small">Learn More</Button>
                                    </CardActions>
                                </Card>
                            ))}
                        </Grid>
                    </div>
                </div>
            </div>
            <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer(false)}>
                {drawer}
            </Drawer>
        </>
    )
}

export default BookingMain;