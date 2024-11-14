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
        title: 'Travel',
        subItems: [ ... Bookings]
    },{
        title: 'Party',
        subItems: [
            { title: 'Movies' },
        ]
    },
    {
        title: 'Settings',
        subItems: [
            { title: 'Profile' },
            { title: 'Account' },
            { title: 'Privacy' }
        ]
    }
];

function BookingMain(){
    const navigate = useNavigate();
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [transports , setTransports] = useState();
    const [bookingtype , setBookingType] = useState(1001);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openIndex, setOpenIndex] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect( ()=>{
        handleRequest(null);
    },[fromLocation])

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
                    return Number(item.type) == 1001 && 
                    item.fromlocation == fromLocation && 
                    (item.tolocation == toLocation);
                });
                setTransports(_res);
            }
            else if(e && e.value){
                setBookingType(e.value);
                _res = await res.filter(item=> {
                    return Number(item.type) == e.value && 
                    item.fromlocation == fromLocation && 
                    (item.tolocation == toLocation);
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

    const handleFromLocation = (event) => {
        setFromLocation(event.target.value);
    };

    const handleToLocation = (event) => {
        setToLocation(event.target.value);
    };

    const drawer = (
        <Box
            sx={{ width: 250 }}
            role="presentation"
        >
            <List>
                {menuData.map((item, index) => (
                    <ListItem button key={index} >
                        <ListItemText primary={item.title} onClick={() => handleToggle(index)}/>
                        {item.subItems.length > 0 && (
                            <span 
                                className={`dropdown-icon ${openIndex === index ? 'open' : ''}`}
                                onClick={() => handleToggle(index)}
                            >
                                {openIndex === index ? '▲' : '▼'}
                            </span>
                        )}
                        {item.subItems.length > 0 && openIndex === index && (
                            <List component="div" disablePadding>
                                {item.subItems.map((subItem, subIndex) => (
                                    <ListItem button key={subIndex} sx={{ pl: 4 }}>
                                        <ListItemText primary={subItem.title} onClick={() => handleRequest(subItem)}/>
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
            <div className='container' style={{ width : '100% !important'}}>
                <div style={{ width : '100%'}}>
                    <h5 style={{float:'left'}}>- Bookings / {getMasterDataById(bookingtype,'bookingtype')}</h5>
                    <div style={{ border: '0px solid', margin: "20px"}}>
                        <div id='bookingmain'>
                            <Link to="/bookings/new">
                                <button type="button" key='create' className='btn btn-light' style={{float: 'right'}}>Create</button>
                            </Link>
                            <form className='row' action="" onSubmit={(e)=>{e.preventDefault(); handleRequest()}}>
                                <label className='col-1' htmlFor="fromlocation" key='fromlocation' style={{float: 'left'}}>From: </label>
                                <select className='col-3' id='fromlocation' value={fromLocation} onChange={handleFromLocation}>
                                    <option value="" disabled>Select a location</option>
                                    {Locations.map((location) => (
                                        <option key={location.value} value={location.value}>{location.name}</option>
                                    ))}
                                </select>
                                <label className='col-1' htmlFor="tolocation" key='tolocation' style={{float: 'left'}}>To :</label>
                                <select className='col-3' id='tolocation' value={toLocation} onChange={handleToLocation}>
                                    <option value="" disabled>Select a location</option>
                                    {Locations.map((location) => (
                                        <option key={location.value} value={location.value}>{location.name}</option>
                                    ))}
                                </select>
                                <button type="submit" style={{height:''}} className='btn btn-success col-2'>Search</button>
                            </form>
                        </div>
                        <div>
                            <Grid container spacing={3} style={{width:'100% !important', overflowY:'auto', justifyContent:'center', marginTop:'0px'}}>
                            {/* <Grid container spacing={3} style={{overflowY:'auto'}}> */}
                                {transports && transports.map((item) => (
                                    <Card sx={{ maxWidth: 550 , width:400, minWidth:100, margin:'10px'}}>
                                        {/* <CardMedia
                                            component="img"
                                            height="140"
                                            image="https://via.placeholder.com/150"
                                            alt="Placeholder image"
                                        /> */}
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {item.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {/* This is a Material UI card that has an image, content, and action buttons. */}
                                                {getMasterDataById(item.fromlocation,'location')} - {getMasterDataById(item.tolocation,'location')}
                                                {item.via && <>{getMasterDataById(item.via,'location')}</>}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" >Book</Button>
                                            <Button size="small">Check availability</Button>
                                        </CardActions>
                                    </Card>
                                ))}
                            </Grid>
                        </ div>
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