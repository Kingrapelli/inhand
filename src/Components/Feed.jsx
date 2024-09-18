import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Grid } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';

function Feed(){

    const [feed, setFeed] = useState('');
    const user = localStorage.getItem('user');
    useEffect(()=>{
        getFeed()
    },[])

    const getFeed = async () => {
        const req = await fetch(`http://localhost:5000/feed`,{
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        const res = await req.json('');
        console.log(res);
        if(res.length > 0){
            let _res = res.sort((a,b)=>a.id > b.id)
            setFeed(_res);
        }else{
            alert("No feed available")
        }
    }

    return (
        <>
            <div className='container'>
                <div className='feedbox'>
                <Grid container spacing={1} style={{overflowY:'auto', textAlign:'center', justifyContent:'center',margin: '10px'}}>
                    {feed && feed.map((item) => (
                        <Card sx={{ minWidth: '150px !important' ,minWidth: '300px !important',width: '400px' , margin:'5px' }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={item.imagepath}
                                alt="Placeholder image"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {item.postTitle}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                {item.likes.find(i=> i == user.id) 
                                    ? <ThumbUpIcon style={{cursor:'pointer'}} /> 
                                    : <ThumbUpOutlinedIcon style={{cursor:'pointer'}} /> }{item.likes.length}
                                {item.dislikes.find(i=> i == user.id) 
                                    ? <ThumbDownAltIcon style={{cursor:'pointer'}} /> 
                                    : <ThumbDownAltOutlinedIcon style={{cursor:'pointer'}} /> }{item.dislikes.length}
                                <Button style={{fontSize:'10px'}} size="small">Share</Button>
                                <Button style={{fontSize:'10px'}} size="small">Learn More</Button>
                                <small style={{fontSize:'10px'}}>Posted on : {item.postedon}</small>
                            </CardActions>
                        </Card>
                    ))}
                    </Grid>
                </div>
            </div>
        </>
    )
}

export default Feed;