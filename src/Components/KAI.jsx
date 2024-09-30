import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Grid, IconButton } from '@mui/material';
import Chatbot from './Chatbot';


const KAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const popupRef = useRef(null);

    useEffect(()=>{
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    },[]);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (e) => {
        if (popupRef.current && !popupRef.current.contains(e.target)) {
          setIsOpen(false);
        }
    };

    return (
        <>
            <div>
                {/* Floating Button */}
                <div className="floating-icon" onClick={togglePopup}>
                    💬
                </div>

                {/* Popup */}
                {isOpen && (
                    <div className="popup">
                        <div className="popup-content">
                            <span className="close" onClick={togglePopup}>&times;</span>
                            {/* <h3>Assistant</h3>
                            <p>How can I assist you today?</p> */}
                            {/* < KAI/> */}
                            <div className="App" id='kai'>
                                <h6>KingRapelli's AI (KAI)</h6>
                                <Chatbot />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
        </>
    )
}

export default KAI;