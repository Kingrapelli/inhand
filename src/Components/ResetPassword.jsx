import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Message } from './Enums/ErrorMessages';
import sendEmail from './Utilities/email';
import { validateExistingUser } from './Utilities/TimeAgo';
import axios from 'axios';


const ResetPassword = () => {
    const [email,setEmail] = useState('');
    const [otp,setOTP] = useState('');
    const [actualotp, setActualOtp] = useState();
    const [isEmailValidated, setisEmailValidated] = useState(false);
    const [isOTPsent, setisOTPsent] = useState(false);
    const [newPassword, setNewPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [user, setUser] = useState();
    const navigate = useNavigate();

    useEffect(()=>{

    })

    const handleGetOTP = async () => {
        try{
            const userdata = {
                name : '',
                email : email,
                password : '',
                city : '',
                path : ''
            }
            const validatinguser = await validateExistingUser(userdata);
            if(validatinguser){
                setUser(validatinguser);
                const otp = Math.floor(Math.random() * 9999 + 1000);
                await sendEmail(email, `Otp to reset your password is : ${otp}`).then(res=>{
                    setActualOtp(otp);
                    setisOTPsent(true);
                }).catch(err=>{
                    console.log(err);
                });
            }else{
                alert("User not exists")
            }
        }catch(err){
            console.log(err);
        }
    }

    const handleValidateOTP = async () => {
        if(!otp || otp.length != 4)
            return
        if(otp == actualotp){
            alert("OTP validated");
            setisEmailValidated(true);
        }else{
            alert("Invalid OTP")
        }
    }

    const handleSubmit = async () => {
        if(newPassword != confirmPassword){
            alert("Passwords are not matching")
            return;
        }
        try{
            user.password = newPassword;
            const response = await axios.put(`http://localhost:5000/users/${user.id}`, user);
            if(response){
                alert("Password got updated");
                navigate('/login');
            }else{
                alert("Failed while updating password");
            }
        }catch(err){
            console.log(err);
        }
    }

    return (
        <>
            <div id='logindiv'>
                <img src='loginuser.png' alt='' height={150} width={150}></img>
                {
                    !isEmailValidated ? 
                    <>
                        <input 
                            type='email'
                            name='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Email'
                            required>
                        </input>
                        {isOTPsent && 
                            <>
                                <input 
                                    type='otp'
                                    name='otp'
                                    value={otp}
                                    onChange={(e) => setOTP(e.target.value)}
                                    placeholder='OTP'
                                    maxLength={4}
                                    minLength={4}
                                    required>
                                </input>
                                <button id='signin' type='button' onClick={handleValidateOTP}>Validate OTP</button>
                            </>
                        }
                        { !isOTPsent && <button id='signin' type='button' onClick={handleGetOTP}>Get OTP</button>}
                    </> :
                    <>
                        <input 
                            type='newpassword'
                            name='password'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder='New Password'
                            required>
                        </input>
                        <input 
                            type='confirmpassword'
                            name='password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder='Confirm Password'
                            required>
                        </input>
                        <button id='signin' type='button' onClick={handleSubmit}>Submit</button>
                    </>
                }
            </div>
        </>
    )
}

export default ResetPassword;