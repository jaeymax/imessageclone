import React,{useState} from 'react'
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {db, auth} from '../firebase';
import {setDoc, doc, serverTimestamp} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { TextField} from '@material-ui/core';
import { Button} from '@material-ui/core';
import LoadingButton from '@mui/lab/LoadingButton';
import {Link} from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(password != confirmPassword){
            setError(true);
            setErrorMessage('This field must match with password');
            return;
        }
        if(!name){
            setError(true);
            setErrorMessage('Please provide your name');
            return;
        }
        try{
            setLoading(true);
            await createUserWithEmailAndPassword(auth, email, password); 
            await updateProfile(auth.currentUser, {displayName:name});
            await setDoc(doc(db, 'users', auth.currentUser.uid),{
                 uid:auth.currentUser.uid,
                 displayName: auth.currentUser.displayName,
                 about:'Hey there i am using whatapp',
                 photoUrl:'',
                 photoPath:'',
                 email,
                 createdAt:serverTimestamp(),
                 isOnline:true,
             })
            setEmail('');
            setName('');
            setPassword('');
            setConfirmPassword('');
            setLoading(false);
            navigate('/');
        }catch(error){
            setError(true);
            console.log(error);
            setErrorMessage(error.message);
            setLoading(false);
        }
    }


  return (
    <section className='form__section'>
        <div className='form__wrapper' >
        <h6 className='form__header'>Create An Account</h6>
        <form className='form'>           
        <TextField fullWidth  required label = 'name' type = 'name' variant='outlined' name= 'name' value={name}  onChange={(e)=>setName(e.target.value)} type={'text'} />                      
        <TextField fullWidth required  label='email' name= 'email' variant = 'outlined' value={email} onChange={(e)=>setEmail(e.target.value)} type={'email'} />               
        <TextField fullWidth required  label = 'password' name= 'password' variant = 'outlined' value={password} onChange={(e)=>setPassword(e.target.value)} type={'password'} />     
        <TextField fullWidth required label = 'confirm password' helperText = {error && errorMessage} variant='outlined' error = {error} name= 'confirmPassword'  value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} type={'password'} />     
        {loading?(<LoadingButton className = 'form__button' loading variant = 'contained'>Register</LoadingButton>):(<Button type = 'submit' variant = 'contained' className='form__button' onClick = {(e) => handleSubmit(e)} >Register</Button>)}             
        <p style = {{fontSize:'10px', fontWeight:'100'}} >Already have an account? <span> <Link to = '/login' >click here to login</Link> </span> </p>
        </form>
        </div>
    </section>
  )
}

export default Register