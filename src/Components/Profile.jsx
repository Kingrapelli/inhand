import axios from 'axios';
import {React, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../Services/auth';

const Profile = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(()=>{

    },[])

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            setMessage('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('profilePic', file);

        try {
            const response = await axios.post(`${API_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("response isss..", response);
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error uploading file.');
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} accept="image/*" />
                <button type="submit">Upload</button>
            </form>
        </>
    )
}

export default Profile;