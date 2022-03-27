import React,{useEffect} from 'react'
import {ref, getDownloadURL, uploadBytes} from 'firebase/storage';
import {getDoc, doc, updateDoc} from 'firebase/firestore';
import {db, auth, storage} from '../firebase';
import {updateProfile } from 'firebase/auth';
import {ContactPhone} from '@mui/icons-material/'
import {Edit} from '@mui/icons-material/' 
import {Info} from '@mui/icons-material/'
import {Call} from '@mui/icons-material/'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import defaultImage from '../default.png'

const Profile = () => {
    const [img, setImg] = React.useState('');
    const [userr, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    console.log(img);


  useEffect(()=>{


     getDoc(doc(db, 'users', auth.currentUser.uid)).then(docSnap => {
       setUser(docSnap.data())
       setLoading(false);
     });
     

     if(img){
      const uploadImg = async () =>{
        const imgref = ref(storage, `avatar/${new Date().getTime()} - ${img.name}`);
        try{
          const snap = await uploadBytes(imgref, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
  
          await updateDoc(doc(db, 'users', auth.currentUser.uid),{
            photoUrl:url,
            photoPath:snap.ref.fullPath
          })
          await updateProfile(auth.currentUser, {photoUrl: url});
          setImg('');

        }catch(error){
          console.log(error)
        }

      }
      uploadImg();
     }
  },[img])  

  

  return (
    <section className='profile' >
        <div className='profile__image__container' >
          {loading?(<img className='profile__image' src= {defaultImage}  />):(<img className='profile__image' src= {userr.photoUrl?userr.photoUrl:defaultImage}  />)}
           
           
            <AddAPhotoIcon fontSize='large' className = 'add-photo-icon' />
           
           
            <input type={'file'} className='profile__image__button' accept='image/*' id = 'photo' onChange={(e)=>setImg(e.target.files[0])} />
        </div>
        <div className='profile__info' >

            <div className='profile__info__section' >
              <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start'}} className = 'profile__section__icon'  >
              <ContactPhone />
              </div>
              <div  className='profile__info__section__middle'>
                <h6 style={{color:'gray'}} >Name</h6>
                <p className='profile__field' style={{textTranform:'capitalize'}} >@{auth.currentUser.displayName}</p>
                <p style={{color:'gray', marginTop:'5px', fontSize:'13px'}} >This is not your username or pin. this name will be visible to your whatsApp contacts </p>
              </div>
              <Edit className = 'pencil' />
            </div>


            <div className='profile__info__section' >
              <div className = 'profile__section__icon' >
                <Info  />
              </div>
              <div className='profile__info__section__middle' >
                <h6 style = {{color:'gray'}} >About</h6>
                <p className='profile__field'style={{marginTop:'3px'}} >There is no knowledge that is not power</p>
              </div>
              <Edit className='pencil' />
            </div>


            <div className='profile__info__section' >
              <div className='profile__section__icon'  >
               <Call />
              </div>
              <div className='profile__info__section__middle' >
                <h6 style = {{color:'gray'}} >Phone</h6>
                <p className='profile__field' >+233240440330</p>
              </div>
            </div>
        </div>

    </section>
  )
}

export default Profile