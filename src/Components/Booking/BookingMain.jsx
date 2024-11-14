import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Grid, IconButton, Box, List, ListItem, ListItemText, Drawer } from '@mui/material';
import Bookings from '../Enums/BookingEnum';
import Locations from '../Enums/LocationEnum';
import { DBJSON_URL } from '../../Services/auth';
import MenuIcon from '@mui/icons-material/Menu';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

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
    const [openBookingDrawer, setOpenBookingDrawer] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState();
    const [newBookingForm, setNewBookingForm] = useState({
        fromlocation : '',
        tolocation : '',
        noofseats : '',
        passangers : []
    })
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect( ()=>{
        handleRequest(null);
    },[fromLocation, toLocation])

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

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const toggleDrawer = (open) => () => {
        setOpenDrawer(open);
    };

    const toggleBookingDrawer = (open, item = null) => () => {
        setSelectedBooking(item);
        setNewBookingForm({})
        setOpenBookingDrawer(open);
    };

    const handleChange = async (e) => {
        let {name, value} = e.target;
        if(name.split(".")[0] == 'passangers'){
            let keysarr = name.split(".");
            let valuearr = (Array.isArray(newBookingForm.passangers) && newBookingForm.passangers.length) ? newBookingForm.passangers : [{}];
            if(Number(keysarr[2] + 1) > valuearr.length){
                Array.from({ length: ((Number(keysarr[2]) + 1) - valuearr.length) }, (_, index) => index).forEach(ele=>{
                    valuearr.push({})
                })
            }
            valuearr[Number(keysarr[2])][keysarr[1]] = value;
            name = keysarr[0];
            value = valuearr;
        }
        // need to remove the object if no of seats count got decreased
        setNewBookingForm((prev)=>({
            ... prev,
            [name]: value
        }))
    }

    const submitBooking = async () => {
        console.log(newBookingForm);
    }

    const drawer = (
        <Box
            sx={{ width: 250 }}
            role="presentation"
        >
            <List>
                {user && menuData && menuData.map((item, index) => (
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

    const bookingDrawer = (
        <Box
            sx={{ width: 300 , padding:'5px', paddingBottom:'60px'}}
            role="presentation"
        >
            <span style={{position:'static'}}>
                <span style={{float:'right', cursor:'pointer'}} onClick={toggleBookingDrawer(false)}><CloseOutlinedIcon/></span>
            </span>
            <span id='bookingmain'>
                {selectedBooking && 
                    <>
                        <h5>{selectedBooking.name}</h5>
                        <h6>
                            {getMasterDataById(selectedBooking.fromlocation,'location')} 
                            &nbsp;-&nbsp;{getMasterDataById(selectedBooking.tolocation,'location')}
                        </h6>
                        <form action="" onSubmit={e=> { e.preventDefault(); submitBooking();}}>
                            {selectedBooking.via ? 
                                <>
                                    
                                </> : 
                                <>
                                    <label className='' htmlFor="fromlocation" key='fromlocation' style={{float: 'left'}}>From: </label>
                                    <select className='' name='fromlocation' id='fromlocation' value={newBookingForm.fromlocation} onChange={handleChange}>
                                        <option value="" >Select a location</option>
                                        <option 
                                            key={selectedBooking.fromlocation} 
                                            value={selectedBooking.fromlocation}
                                            onChange={handleChange}
                                        >
                                            {getMasterDataById(selectedBooking.fromlocation,'location')}
                                        </option>
                                    </select>
                                    <label className='' htmlFor="tolocation" key='tolocation' style={{float: 'left'}}>To :</label>
                                    <select className='' name='tolocation' id='tolocation' value={newBookingForm.tolocation} onChange={handleChange}>
                                        <option value="" >Select a location</option>
                                        <option 
                                            key={selectedBooking.tolocation} 
                                            value={selectedBooking.tolocation} 
                                            onChange={handleChange}
                                        >
                                            {getMasterDataById(selectedBooking.tolocation,'location')}
                                        </option>
                                    </select>
                                </>
                            }
                            <span>
                                <label className='' htmlFor="noofseats" key='noofseats' style={{float: 'left'}}>No of seats :</label>
                                <input type="number" name="noofseats" id="noofseats" min="0" onChange={handleChange}/>
                            </span>
                            {newBookingForm.noofseats > 1 ? 
                                <>
                                    {Array.from({ length: newBookingForm.noofseats }, (_, index) => index).map((item, index)=>{
                                        return <>
                                            Passeger {index + 1}
                                            <input type="text" name={`passangers.name.${index}`} id="" placeholder='Enter name' onChange={handleChange}/>
                                            <input type="text" name={`passangers.age.${index}`} id="" placeholder='Enter age' onChange={handleChange}/>
                                            
                                        </>
                                    })}
                                </> : 
                                <>
                                    {newBookingForm.noofseats == 1 && 
                                        <>
                                            <input type="text" name="" id="" placeholder='Enter name'/>
                                        </>
                                    }
                                </>
                            }
                            <input type="phone" name={`mobile`} id="" placeholder='Enter Mobile no' onChange={handleChange}/>
                            <input type="mail" name={`mail`} id="" placeholder='Enter email' onChange={handleChange}/>
                            <button type="submit">Book</button>
                        </form>
                    </>
                }
            </span>
        </Box>
    );

    return (
        < > 
            { user && 
                <>
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
                                                    <Button size="small" 
                                                        onClick={
                                                            // e.preventDefault();
                                                            toggleBookingDrawer(true, item)
                                                            }>Book
                                                    </Button>
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
                    <Drawer anchor="right" open={openBookingDrawer} onClose={toggleBookingDrawer(false)}>
                        {bookingDrawer}
                    </Drawer>
                </>
            }
        </>
    )
}

export default BookingMain;