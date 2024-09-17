import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar () {
    return (
        <>
            <ul>
                <li>Home</li>
                <li>Shopping</li>
                <li>Food</li>
                <li>Booking</li>
                <li>Contact us</li>
                <li>About us</li>
                <li>My Profile</li>
                <li>Logout</li>
            </ul>
        </>
    )
}

export default Navbar;