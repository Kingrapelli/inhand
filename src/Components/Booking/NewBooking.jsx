import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Bookings from '../Enums/BookingEnum';
import Locations from '../Enums/LocationEnum';
// import Bookings from '../Enums/Booking'

function NewBooking(){
    const navigate = useNavigate();
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
        const req =  await fetch('http://localhost:5000/transport',{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(booking)
        }).then(()=>{
            alert("New Booking got created");
            navigate('/bookings');
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
                    <label htmlFor="typeofbooking" key={'typeofbooking'} style={{float: 'left'}}>Type of Booking </label>
                    <select id='typeofbooking' name='type' onClick={handleChange}>
                        <option value={''} onClick={handleChange}></option>
                        {Bookings && Bookings.map(item=>{
                            return <option key={item.value} value={item.value} onClick={handleChange}>{item.name}</option>
                        })}
                    </select>
                    <label htmlFor="description" key={'description'} style={{float: 'left'}}>Description </label>
                    <input id='description'
                        type='text'
                        name='description'
                        placeholder='Description'
                        value={booking.description}
                        onChange={handleChange}
                        required>
                    </input>
                    <label htmlFor="location" key={'location'} style={{float: 'left'}}>Location </label>
                    <select id='locationnew' name='location' onClick={handleChange}>
                        <option value={''} onClick={handleChange}></option>
                        {Locations && Locations.map(item=>{
                            return <option key='item' value={item.value} onClick={handleChange}>{item.name}</option>
                        })}
                    </select>
                    <button id='signin' type="button" onClick={handleSubmit}>Create</button>
                </form>
            </div>
        </>
    )
}

export default NewBooking;