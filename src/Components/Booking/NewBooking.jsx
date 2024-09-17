import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Bookings from '../Enums/Booking'

function NewBooking(){
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [booking, setBooking] = new useState({
        name : '',
        type : '',
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
        const req =  await fetch('http://localhost:5000/transport',{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(booking)
        }).then(()=>{
            alert("New Booking got created")
        }).catch((error)=>{
            alert("Error while saving New Booking entry")
        })
    }

    return (
        <>
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
                    <label htmlFor="typeofbooking" style={{float: 'left'}}>Type of Booking </label>
                    <select id='typeofbooking' name='type' onClick={handleChange}>
                        <option value={''} onClick={handleChange}></option>
                        <option value={1001} onClick={handleChange}>Bus</option>
                        <option value={1002} onClick={handleChange}>Train</option>
                        <option value={1003} onClick={handleChange}>Flight</option>
                        <option value={1004} onClick={handleChange}>Cab</option>
                    </select>
                    <label htmlFor="location" style={{float: 'left'}}>Location </label>
                    <select id='location' name='location' onClick={handleChange}>
                        <option value={''} onClick={handleChange}></option>
                        <option value={4001} onClick={handleChange}>Hyderabad</option>
                        <option value={4002} onClick={handleChange}>Vizag</option>
                        <option value={4003} onClick={handleChange}>Bangalore</option>
                        <option value={4004} onClick={handleChange}>Chennai</option>
                    </select>
                    <button id='signin' type="button" onClick={handleSubmit}>Create</button>
                </form>
            </div>
        </>
    )
}

export default NewBooking;