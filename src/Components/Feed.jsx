import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Grid, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import axios from 'axios';
import TypeOfFeed from './Enums/TypeOfFeed';
import { NotificationType } from './Enums/NotificationType';
import { Message } from './Enums/ErrorMessages';
import { ActionType } from './Enums/ActionType';
import { testing } from '../Services/auth';
import KAI from './KAI';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Header from './Header';

const drawerWidth = 240;

function Feed(){
    const [allUsers, setAllUsers] = useState();
    const [feedtype , setFeedType] = useState(6001);
    const [feed, setFeed] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(()=>{
        getAllUsers();
        getFeed();
    },[]);

    const getFeed = async (e) => {
        if(e && e.target && e.target.value){
            setFeedType(e.target.value)
        }
        const req = await fetch(`http://localhost:5000/feed`,{
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        const res = await req.json('');
        if(res.length > 0){
            let _res = res.sort((a,b)=>new Date(b.postedon) - new Date(a.postedon)); //sorting based on creation date
            if(e && e.target && e.target.value && e.target.value != '6001'){
                _res = _res && _res.filter(item=> {return item.feedtype == e.target.value});
            }
            setFeed(_res);
        }else{
            setFeed(null);
        }
    }

    const getUserIdFromLikes = (req) => {
        const res = req.find(_id => _id == user.id)
        return res ? true : false;
    }

    const handleLike = async (item) => {
        item.likes.push(user.id);
        const index = item.dislikes.indexOf(user.id);
        if (index > -1) {
            item.dislikes.splice(index, 1);
        }
        await updateFeed(item);
        await sendNotification(item,user.id, ActionType.Like);
    }

    const handleRemoveLike = async (item) => {
        item.likes.splice(item.likes.indexOf(user.id), 1);
        await updateFeed(item);
    }

    const handleDisLike = async (item) => {
        item.dislikes.push(user.id);
        const index = item.likes.indexOf(user.id);
        if (index > -1) {
            item.likes.splice(index, 1);
        }
        await updateFeed(item);
        await sendNotification(item,user.id, ActionType.Dislike);
    }

    const handleRemoveDisLike = async (item) => {
        item.dislikes.splice(item.dislikes.indexOf(user.id), 1);
        await updateFeed(item);
    }

    const updateFeed = async (item) => {
        try{
            axios
            .put(`http://localhost:5000/feed/${item.id}`, item)
            .then((response) => {
                getFeed();
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
        const res = allUsers && allUsers.filter(user => user.id === userid);
        return res[0];
    }

    const sendNotification = async (item,userid, actiontype) => {
        let _body = {
            actiontype : actiontype,
            notificationtype : NotificationType.Feed,
            itemId : item.id,
            owner : item.postedby,
            actionby : userid,
            updatedon : new Date()
        }
        const req = await fetch('http://localhost:5000/notifications',{
            method:'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(_body)
        }).then(()=>{
            console.log("notification sent")
        }).catch(error=>{
            console.log("Error while sending notification")
        })
    }

    function getMasterDataById (id,type){
        let _type = (type == 'feedtype') ? TypeOfFeed :  [];
        for(let item of _type){
            if(item.value == id){
                return item.name;
            }
        }
    }

    return (
        <>
            {/* <Drawer
                variant="permanent"
                sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
                
            >
                <Box sx={{ overflow: 'auto', top: '70px' }}>
                    <List>
                        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer> */}
            <div className='container leftboardermenu' >
                <ul>
                    {TypeOfFeed && TypeOfFeed.map((item,index)=>{
                        return <li key={item.value} value={item.value} onClick={getFeed}>{item.name}</li>
                    })}
                </ul>
            </div>
            {feed &&
                <div className='container '>
                {/* <div className='container ' sx={{ flexGrow: 1, p: 3 }}> */}
                    <div className='feedmaindiv' style={{height: '100% !important'}}> 
                        
                        <div >
                        {/* className='feedbox' */}
                        <h5 style={{float:'left'}}>- Feed / {getMasterDataById(feedtype,'feedtype')}</h5>
                        <Grid container spacing={1} style={{overflowY:'auto', textAlign:'center', justifyContent:'center',margin: '10px'}}>
                            {feed && feed.map((item) => (
                                <Card sx={{ minWidth: '100px !important' ,maxWidth: '600px !important',width: '400px' , margin:'5px' }}>
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
                                                <img src={getUserDataByUserId(item.postedby).image || '/userprofiles/defaultpicture.png'} height={30} width={30} style={{borderRadius:'20px'}} />
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
                                            ?   <IconButton onClick={()=> handleRemoveDisLike(item)} >
                                                    <ThumbDownAltIcon style={{cursor:'pointer'}}/>
                                                </IconButton> 
                                            :   <IconButton onClick={()=> handleDisLike(item)} >
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
                </div>
            }
        </>
    )
}

export default Feed;