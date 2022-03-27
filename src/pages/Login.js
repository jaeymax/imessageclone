import React,{useState} from 'react'
import {signInWithEmailAndPassword} from 'firebase/auth';
import {db, auth} from '../firebase';
import {Link} from 'react-router-dom';
import {setDoc, doc,updateDoc,Timestamp} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { LoadingButton } from '@mui/lab';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();

        try{
            setLoading(true);
            const authUser = await signInWithEmailAndPassword(auth, email, password);
            await updateDoc(doc(db, 'users', authUser.user.uid),{
                 isOnline:true,
             });
            setEmail('');
            setPassword('');
            setLoading(false);
            navigate('/');
        }catch(error){
            console.log(error);
            setError(true);
            setErrorMessage(error.message.substring(9,error.message.length))
            setLoading(false);
        }
    }

  return (
    <section className='form__section'>
        <div className='form__wrapper' >
        <h6 className='form__header'>Login into your Account</h6>
        <form className='form'>
            <TextField required  label='email' name= 'email' variant = 'outlined' value={email} onChange={(e)=>setEmail(e.target.value)} type={'email'} />
            <TextField required label = 'password' helperText = {error? errorMessage:''} error = {error} name= 'password' variant = 'outlined' value={password} onChange={(e)=>setPassword(e.target.value)} type={'password'} />
            {loading?(<LoadingButton className = 'form__button' loading variant = 'contained'>Login</LoadingButton>):(<Button type = 'submit' variant = 'contained' className='form__button' onClick = {(e)=>handleSubmit(e)} >Login</Button>)}
            <p style = {{fontSize:'10px', fontWeight:'100'}} >Don't have an account? <span> <Link to = '/register' >click here to sign up</Link> </span> </p>
        </form>
        </div>
    </section>
  )
}

export default Login;