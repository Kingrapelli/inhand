import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BookingMain(){
    const navigate = useNavigate();

    useEffect(()=>{

    })
    
    function NavigateToCreateBooking(){
        navigate('/booking/new');
    }

    return (
        <>
            <button style={{float:'right'}} onClick={NavigateToCreateBooking}>Create</button>
        </>
    )
}

export default BookingMain;