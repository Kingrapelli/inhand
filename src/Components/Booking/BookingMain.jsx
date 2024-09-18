import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Grid } from '@mui/material';
import Bookings from '../Enums/BookingEnum';
import Locations from '../Enums/LocationEnum';

function BookingMain(){
    const navigate = useNavigate();
    const [location, setLocation] = useState({
        name: 'Hyderabad',
        value : 4001
    });
    const [transports , setTransports] = useState([
        {id:1,name:""}
    ]);
    let transportType;
    // const [locationName , setLocationName] = useState('');
    let locationName;

    useEffect( ()=>{
        handleRequest(transportType)
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
                    return Number(item.type) == '1001' && item.location == location.value;
                });
                setTransports(_res);
            }
            else if(e && e.target && e.target.value){
                transportType = e.target.value;
                _res = await res.filter(item=> {
                    return Number(item.type) == e.target.value && item.location == location.value;
                });
                setTransports(_res);
            }
            if(_res.length == 0){
                setTransports([]);
                // alert("No Transport available")
            }
        }else{
            setTransports([]);
            alert("no Transport available" )
        }
    }

    function getMasterDataById (id){
        for(let item of Locations){
            if(item.value == id){
                // setLocationName(item.name);
                locationName = item.name;
                return item.name;
            }
        }
    }

    function handleChange (e){
        const {name,value} = e.target;
        setLocation((prevlocation)=>({
            ...prevlocation,
            [name] : value
        }));
    }

    return (
        < >
            <div className='leftboardermenu' >
                <ul>
                    {Bookings && Bookings.map((item,index)=>{
                        return <li key={item.value} onClick={handleRequest} value={item.value}>{item.name}</li>
                    })}
                </ul>
            </div>
            <div style={{ 'marginLeft': '160px',overflowY:'auto' }}>
                <div style={{ border: '0px solid', borderRadius: '10px', width: 'auto !important',
                     height: '100%', margin: "20px", padding: '20px',overflowY:'auto' }}>
                    <Link to="/bookings/new">
                        <button type="button" key='create' className='createButton'>Create</button>
                    </Link>
                    <form action="">
                        <select id='location' name='value' value={location.value} onChange={handleChange}>
                            {Locations && Locations.map(item=>{
                                return <option key={item.value} value={item.value} onClick={handleChange}>{item.name}</option>
                            })}
                        </select>
                    </form>
                    {location.value}
                    {locationName}

                    <Grid container spacing={3} style={{overflowY:'auto'}}>
                    {transports && transports.map((item) => (
                        <Card sx={{ maxWidth: 345 , margin:'5px'}}>
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
                                    {getMasterDataById(item.location)} - {item.description}
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