import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Grid } from '@mui/material';
import Bookings from '../Enums/BookingEnum';
import Locations from '../Enums/LocationEnum';

function BookingMain(){
    const navigate = useNavigate();
    const [location, setLocation] = useState(4001);
    const [transports , setTransports] = useState();
    const [bookingtype , setBookingType] = useState(1001);

    useEffect( ()=>{
        handleRequest(null);
    },[location])

    const handleRequest = async (e) => {
        
        const req = await fetch(`http://localhost:5000/transport`,{
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

    return (
        < >
            <div className='container leftboardermenu' >
                <ul>
                    {Bookings && Bookings.map((item,index)=>{
                        return <li key={item.value} onClick={handleRequest} value={item.value}>{item.name}</li>
                    })}
                </ul>
            </div>
            <div style={{ 'marginLeft': '160px',overflowY:'auto' }}>
                <div style={{ border: '0px solid', borderRadius: '10px', width: 'auto !important',
                     height: '100%', margin: "20px", padding: '20px',overflowY:'auto' }}>
                    
                    <h5 style={{float:'left'}}>- Bookings / {getMasterDataById(bookingtype,'bookingtype')}</h5>
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
        </>
    )
}

export default BookingMain;