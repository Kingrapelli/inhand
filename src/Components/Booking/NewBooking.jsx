import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Bookings from '../Enums/BookingEnum';
import Locations from '../Enums/LocationEnum';
import { DBJSON_URL } from '../../Services/auth';
// import Bookings from '../Enums/Booking'

function NewBooking(){
    const newBookingNavigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [booking, setBooking] = new useState({
        name : '',
        type : '',
        description : '',
        location : '',
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

    return (
        <>
            <Link to="/bookings"><button type="button" className='backButton' >Back</button></Link>
            <div id='logindiv'>
                Create New Booking
                <form>
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
                    <label htmlFor="location" key='location' style={{float: 'left'}}>Location </label>
                    <select id='locationnew' name='location' onClick={handleChange}>
                        <option value={''} onClick={handleChange}></option>
                        {Locations && Locations.map(location=>{
                            return <option key={location.value} value={location.value} onClick={handleChange}>{location.name}</option>
                        })}
                    </select>
                    <button id='signin' type="button" onClick={handleSubmit}>Create</button>
                </form>
            </div>
        </>
    )
}

export default NewBooking;