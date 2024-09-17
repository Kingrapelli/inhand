import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../App.css';

function Dashboard(){
    const navigate = useNavigate();

    useEffect(()=>{
        if(!localStorage.getItem('token'))
            navigate('/login')
    })

    function logOut(){
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    }
    function NavigateToBooking(){
        navigate('/booking')
    }

    return (
        <>
            <div id="div_top_hypers">
                <ul id="ul_top_hypers">
                    <li className={styles.navbarleftmenu}>Home</li>
                    <li className={styles.navbarleftmenu}>Shopping</li>
                    <li className={styles.navbarleftmenu}>Food</li>
                    <li className={styles.navbarleftmenu} onClick={NavigateToBooking}>Booking</li>
                    <li className={styles.navbarleftmenu}>Contact us</li>
                    <li className={styles.navbarleftmenu}>About us</li>
                    <li className={styles.navbarrightmenu}>My Profile</li>
                    <li className={styles.navbarrightmenu} onClick={logOut}>Logout</li>
                </ul>
            </div>
        </>
    )
}

export default Dashboard;