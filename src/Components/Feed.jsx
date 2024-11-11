import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Grid, IconButton, Drawer, Box, List, ListItem, ListItemText } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import axios from 'axios';
import TypeOfFeed from './Enums/TypeOfFeed';
import { NotificationType } from './Enums/NotificationType';
import { Message } from './Enums/ErrorMessages';
import { ActionType } from './Enums/ActionType';
import { DBJSON_URL, testing } from '../Services/auth';
import sendEmail from './Utilities/email';
import MenuIcon from '@mui/icons-material/Menu';
const moment = require('moment');
const drawerWidth = 240;

const menuData = [
    {
        title: 'Dashboard',
        subItems: []
    },
    {
        title: 'Feeds',
        subItems: [... TypeOfFeed]
    },
];

const Feed = () => {
    const [allUsers, setAllUsers] = useState();
    const [feedtype , setFeedType] = useState(6001);
    const [feed, setFeed] = useState('');
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openIndex, setOpenIndex] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(()=>{
        getAllUsers();
        getFeed();
    },[]);

    const getFeed = async (value) => {
        if(value){
            setFeedType(value)
        }
        const req = await fetch(`${DBJSON_URL}/feed`,{
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        const res = await req.json('');
        if(res.length > 0){
            let _res = res.sort((a,b)=>new Date(b.postedon) - new Date(a.postedon)); //sorting based on creation date
            if(value && value != '6001'){
                _res = _res && _res.filter(item=> {return item.feedtype == value});
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
        await sendEmail(user, `${user.name} liked your post ${item.postTitle}`, 'feedactivity');
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
        await sendEmail(user, `${user.name} disliked your post ${item.postTitle}`, 'feedactivity');
    }

    const handleRemoveDisLike = async (item) => {
        item.dislikes.splice(item.dislikes.indexOf(user.id), 1);
        await updateFeed(item);
    }

    const updateFeed = async (item) => {
        try{
            axios
            .put(`${DBJSON_URL}/feed/${item.id}`, item)
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
        const request = await fetch(`${DBJSON_URL}/users`,{
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
        const req = await fetch(`${DBJSON_URL}/notifications`,{
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

    const drawer = (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            // onClick={toggleDrawer(false)}
            // onKeyDown={toggleDrawer(false)}
        >
            <List>
                {menuData.map((item, index) => (
                    <ListItem button key={index} >
                        <ListItemText primary={item.title} onClick={() => handleToggle(index)}/>
                        {item.subItems.length > 0 && (
                            <span 
                                className={`dropdown-icon ${openIndex === index ? 'open' : ''}`}
                                onClick={() => handleToggle(index)}
                            >
                                {openIndex === index ? '▲' : '▼'}
                            </span>
                        )}
                        {item.subItems.length > 0 && openIndex === index && (
                            <List component="div" disablePadding>
                                {item.subItems.map((subItem, subIndex) => (
                                    <ListItem button key={subIndex} sx={{ pl: 4 }}>
                                        <ListItemText primary={subItem.title} onClick={(()=> getFeed(subItem.value))}/>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const toggleDrawer = (open) => () => {
        setOpenDrawer(open);
    };

    return (
        < >
            <IconButton 
                style={{position:'absolute', left:'10px'}} 
                edge="start" color="inherit" aria-label="menu" 
                onClick={toggleDrawer(true)}>
                <MenuIcon />
            </IconButton>
            <div style={{ display: 'flex', overflowY:'auto' , width: '100% !important'}}>
                <div style={{ flexGrow: 1 }}>
                {user && feed &&
                    <div className='container ' style={{overflowX : 'hidden', overflowY : 'auto'}}>
                        <div className='' style={{height: '100% !important'}}> 
                            <h5 style={{float:'left'}}>- Feed / {getMasterDataById(feedtype,'feedtype')}</h5>
                            <Grid container spacing={1} style={{overflowY:'auto', textAlign:'center', justifyContent:'center',margin: '10px'}}>
                                {feed && feed.map((item) => (
                                    <Card sx={{ minWidth: '100px !important' ,maxWidth: '600px !important',width: '400px' , margin:'5px 15px 5px 15px' }}>
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
                                            <small style={{fontSize:'10px'}}>Posted on : {moment(item.postedon).format('MMMM Do, YYYY, h:mm:ss A')}</small>
                                        </CardActions>
                                    </Card>
                                ))}
                                </Grid>
                        </div>
                    </div>
                }
                </div>
            </div>
            <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer(false)}>
                {drawer}
            </Drawer>
        </>
    )
}

export default Feed;