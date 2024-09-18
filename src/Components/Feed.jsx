import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Grid, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import axios from 'axios';

function Feed(){
    const [allUsers, setAllUsers] = useState();
    const [feed, setFeed] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(()=>{
        getAllUsers();
        getFeed();
    },[])

    const getFeed = async () => {
        const req = await fetch(`http://localhost:5000/feed`,{
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        const res = await req.json('');
        if(res.length > 0){
            res.sort((a,b)=>new Date(b.postedon) - new Date(a.postedon)); //sorting based on creation date
            setFeed(res);
        }else{
            alert("No feed available")
        }
    }

    const getUserIdFromLikes = (req) => {
        const res = req.find(_id => _id == user.id)
        return res ? true : false;
    }

    const handleLike = async (item) => {
        item.likes.push(user.id);
        await updateFeed(item);
    }

    const handleRemoveLike = async (item) => {
        // console.log(item)
        await updateFeed(item);
    }

    const handleDisLike = async (item) => {
        // console.log(item)
        await updateFeed(item);
    }

    const handleRemoveDisLike = async (item) => {
        // console.log(item)
        await updateFeed(item);
    }

    const updateFeed = async (item) => {
        try{
            axios
            .put(`http://localhost:5000/feed/${item.id}`, item)
            .then((response) => {
                // console.log('Feed updated:', response.data);
                getFeed()
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
        }catch(err){
            console.log("error at catch block", err);
        }
    }

    const getAllUsers = async () => {
        const request = await fetch(`http://localhost:5000/users`,{
            method: 'GET',
            headers: {
                "Content-Type" : 'application/json'
            }
        });
        const res = await request.json();
        if(res.length > 0)
            setAllUsers(res)
    }

    const getUserDataByUserId = (userid) => {
        const res = allUsers.filter(user => user.id === userid);
        return res[0];
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
                                    {/* <img src={item.image} height={30} width={30}/>{item.postTitle}  */}
                                    <span style={{float:'left'}}>
                                        <img src={getUserDataByUserId(item.postedby).image} height={30} width={30} style={{borderRadius:'20px'}} /> 
                                        <small style={{fontSize:'medium'}}> {getUserDataByUserId(item.postedby).name}</small>
                                    </span>
                                    <small style={{fontSize:'medium'}}>- {item.postTitle}</small>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                { getUserIdFromLikes(item.likes) 
                                    ?   <IconButton onClick={()=>handleRemoveLike(item)} >
                                            <ThumbUpIcon style={{cursor:'pointer'}}/>
                                        </IconButton>
                                    :   <IconButton onClick={()=>handleLike(item)} >
                                            <ThumbUpOutlinedIcon style={{cursor:'pointer'}}/>
                                        </IconButton> }{item.likes.length}
                                {getUserIdFromLikes(item.dislikes) 
                                    ?   <IconButton onClick={()=> handleDisLike(item)} >
                                            <ThumbDownAltIcon style={{cursor:'pointer'}}/>
                                        </IconButton> 
                                    :   <IconButton onClick={()=> handleRemoveDisLike(item)} >
                                            <ThumbDownAltOutlinedIcon style={{cursor:'pointer'}}/>
                                        </IconButton> }{item.dislikes.length}
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