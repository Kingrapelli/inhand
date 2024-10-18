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
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [user, setUser] = useState();
    const navigate = useNavigate();
    const [isdisabled, setIsDisabled] = useState(false);

    useEffect(()=>{

    })

    const handleGetOTP = async () => {
        try{
            // setIsDisabled(true);
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
            // setIsDisabled(false);
        }catch(err){
            // setIsDisabled(false);
            console.log(err);
        }
    }

    const handleValidateOTP = async () => {
        // setIsDisabled(true);
        if(!otp || otp.length != 4)
            return
        if(otp == actualotp){
            alert("OTP validated");
            setisEmailValidated(true);
        }else{
            alert("Invalid OTP")
        }
        // setIsDisabled(false);
    }

    const handleSubmit = async () => {
        // setIsDisabled(true);
        if(newPassword != confirmPassword){
            alert("Passwords are not matching")
            return;
        }
        if(user.password == newPassword){
            alert("Your password is same with old password")
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
        // setIsDisabled(false);
    }

    return (
        <>
            <div id='logindiv'>
                <img src='loginuser.png' alt='' height={150} width={150}></img>
                {
                    !isEmailValidated ? 
                    <>
                        <form action="" onSubmit={(e) => { 
                            e.preventDefault(); 
                            if(isOTPsent)
                                handleValidateOTP();
                            else
                                handleGetOTP();
                            }}>

                            <input 
                                type='email'
                                name='email'
                                value={email}
                                onChange={(e) =>{ setEmail(e.target.value);}}
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
                                    <button id='signin' type='submit' disabled={isdisabled} >Validate OTP</button>
                                </>
                            }
                            { !isOTPsent && <button id='signin' type='submit' disabled={isdisabled}>Get OTP</button>}
                        </form>
                    </> :
                    <>
                        <form action="" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                            <input 
                                type='password'
                                name='newpassword'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder='New Password'
                                autoComplete="off"
                                required>
                            </input>
                            <input 
                                type='password'
                                name='confirmpassword'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder='Confirm Password'
                                autoComplete="off"
                                required>
                            </input>
                            <button id='signin' type='submit' disabled={isdisabled}>Submit</button>
                        </form>
                    </>
                }
            </div>
        </>
    )
}

export default ResetPassword;