import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Grid, IconButton } from '@mui/material';
import Chatbot from './Chatbot';


const KAI = () => {
    return (
        <>
            <div className="App" id='kai'>
                <h6>KingRapelli's AI (KAI)</h6>
                <Chatbot />
            </div>
        </>
    )
}

export default KAI;