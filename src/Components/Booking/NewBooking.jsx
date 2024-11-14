import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Bookings from '../Enums/BookingEnum';
import Locations from '../Enums/LocationEnum';
import { DBJSON_URL } from '../../Services/auth';
// import Bookings from '../Enums/Booking'
import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox';

function NewBooking(){
    const newBookingNavigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [togglechecked, setToggleChecked] = React.useState(false);
    const [checked, setChecked] = React.useState(false);

    const [booking, setBooking] = new useState({
        name : '',
        type : '',
        description : '',
        fromlocation : '',
        tolocation : '',
        createdBy : user.id
    });

    useEffect(()=>{
    })

    const handleChange = async (e) => {
        const {name,value} = e.target;
        setBooking((prevbooking)=>({
            ...prevbooking,
            [name] : value
        }))
    }

    const handleSubmit = async () => {
        const req =  await fetch(`${DBJSON_URL}/transport`,{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(booking)
        }).then(()=>{
            alert("New Booking got created");
            newBookingNavigate('/bookings');
        }).catch((error)=>{
            alert("Error while saving New Booking entry")
        })
    }

    const handleToggle = (event) => {
        setToggleChecked(event.target.checked);
    };

    const handleCheckbox = (event) => {
        setChecked(event.target.checked);
      };

    return (
        <>
            <Link to="/bookings"><button type="button" className='backButton' >Back</button></Link>
            <div id='logindiv'>
                Create New Booking
                <form onSubmit={(e)=>{e.preventDefault();handleSubmit() }}>
                    <input 
                        type='text'
                        name='name'
                        placeholder='Travels name'
                        value={booking.name}
                        onChange={handleChange}
                        required>
                    </input>
                    <label htmlFor="typeofbooking" key='typeofbooking' style={{float: 'left'}}>Type of Booking </label>
                    <select id='typeofbooking' name='bookingtype' onClick={handleChange}>
                        <option value={''} onClick={handleChange}></option>
                        {Bookings && Bookings.map(booking=>{
                            return <option key={booking.value} value={booking.value} onClick={handleChange}>{booking.name}</option>
                        })}
                    </select>
                    <label htmlFor="description" key='description' style={{float: 'left'}}>Description </label>
                    <input id='description'
                        type='text'
                        name='description'
                        placeholder='Description'
                        value={booking.description}
                        onChange={handleChange}
                        required>
                    </input>
                    <label htmlFor="fromlocation" key='fromlocation' style={{float: 'left'}}>From Location </label>
                    <select id='locationnew' name='fromlocation' onClick={handleChange}>
                        <option value={''} onClick={handleChange}></option>
                        {Locations && Locations.map(fromlocation=>{
                            return <option key={fromlocation.value} value={fromlocation.value} onClick={handleChange}>{fromlocation.name}</option>
                        })}
                    </select>
                    <label htmlFor="tolocation" key='tolocation' style={{float: 'left'}}>To Location </label>
                    <select id='locationnew' name='tolocation' onClick={handleChange}>
                        <option value={''} onClick={handleChange}></option>
                        {Locations && Locations.map(tolocation=>{
                            return <option key={tolocation.value} value={tolocation.value} onClick={handleChange}>{tolocation.name}</option>
                        })}
                    </select>
                    {/* <label htmlFor="toggleswitch" key='toggleswitch' style={{float: 'left'}}>Stops : </label> */}
                    {/* <Switch
                        id='toggleswitch'
                        checked={togglechecked}
                        onChange={handleToggle}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    {togglechecked && 
                        <>
                            
                        </>
                    } */}
                    {/* <Checkbox
                        checked={checked}
                        onChange={handleCheckbox}
                        inputProps={{ 'aria-label': 'controlled' }}
                    /> */}
                    <button id='signin' type="submit">Create</button>
                </form>
            </div>
        </>
    )
}

export default NewBooking;