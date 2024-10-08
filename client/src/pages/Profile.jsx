import React from 'react'
import { useSelector ,useDispatch} from 'react-redux'
import {useRef,useState,useEffect} from 'react'
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
import { updateUserStart,updateUserSuccess,updateUserFailure,deleteUserSuccess,deleteUserStart,deleteUserFailure,signOutUserSuccess,signInStart,signInFailure} from '../redux/user/userSlice'
import { Link } from 'react-router-dom'

const Profile = () => {

  const fileRef = useRef(null);
  const {currentUser,loading,error} = useSelector((state)=>state.user);
  const [file,setFile] =useState(undefined);
  const [filePrecentage, setFilePercentage] = useState();
  const [fileUploadError,setFileUploadError] = useState(false);
  const [formData,setFormData] = useState({});
  const [updateSuccessfully,setUpdateSuccessfully] = useState(false);
  const [showListingsError,setShowListingError] = useState(false);
  const [userListings,setUserListings] = useState({});
  const dispatch = useDispatch();
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file])

  // console.log(formData);
  console.log(userListings);
  
  const handleFileUpload = (file)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime()+file.name;
    const storageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef,file);

    uploadTask.on('state_changed',(snapshot)=>{
        const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        // console.log('Upload is'+progress+'% done')
        setFilePercentage(Math.round(progress));
      },
    (error)=>{
      setFileUploadError(true);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then(
        (downloadURL)=>{
          setFormData({...formData,avatar:downloadURL})
        }
      )
    })
  }

  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id]:e.target.value});
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    dispatch(updateUserStart());
    try{
      const res = await fetch(`api/user/update/${currentUser._id}`,
        {
        method:'POST',
        headers: {
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);
      if(data.success===false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccessfully(true);
    }
    catch(err){
      dispatch(updateUserFailure(err.message));
    }
  }

  const handleDeleteUser= async()=>{
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      })

      const data = await res.json();
      
      if(data.success===false){
        dispatch(deleteUserFailure(data.message))
      }
      console.log(data);
      dispatch(deleteUserSuccess());
    }
    catch(err){
      dispatch(deleteUserFailure(err.message));
    }
  }

  const handleSignOut = async()=>{
    try{
      dispatch(signInStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if(data.success===false){
        signInFailure(data.message);
        return;
      }
      dispatch(deleteUserSuccess(data));
    }
    catch(err){
      dispatch(deleteUserFailure(err.message));
    }
  }

  const handleShowListing= async()=>{
    try{
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if(data.success===false){
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    }
    catch(err){
      setShowListingError(true);
    }
  }

  const handleDeleteListing = async(listingId)=>{
    try{
      const res = await fetch(`/api/listing/delete/${listingId}`,{
        method:"DELETE"
      });
      const data = await res.json();

      if(data.success===false){
        console.log(data.message);
        return;
      }
      setUserListings((prev)=>{
        prev.filter((listing)=>listing._id!==listingId);
      })
    }
    catch(err){
      console.log(err.message);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])} type='file' ref= {fileRef} hidden accept='image/*'/>
        <img onClick = {()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
        <p className='text-sm self-center'>
          {fileUploadError ?
          <span className='text-red-700'>Error Image upload</span>
          :
            filePrecentage > 0 && filePrecentage<100 ?
            <span className='text-slate-700'>{`uploading ${filePrecentage}`}</span>:
            filePrecentage===100?
            <span className='text-green-700'> 
              Image Uploaded successfully
            </span>
            :""
          }
        </p>
        <input type = "text" placeholder='username' id="username" className='border p-3 rounded-lg' defaultValue={currentUser.username} onChange= {handleChange} /> 
        <input type = "email" placeholder='email' id="email" className='border p-3 rounded-lg' defaultValue={currentUser.email} onChange= {handleChange}/> 
        <input type = "password" placeholder='password' id="password" className='border p-3 rounded-lg' onChange= {handleChange}/> 
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading?'loading...':'Update'}</button>
        <Link className = 'bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 ' to={"/create-listing"}>Create Listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
          <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>
            Delete account
          </span>
          <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
            Sign Out
          </span>
      </div>
      <p className='text-red-700 mt-5'>{error?error:''}</p>
      <p className='text-green-700 mt-5'>{updateSuccessfully?'updateSuccessfully':''}</p>
      <button onClick= {handleShowListing} className='text-green-700 w-full'>Show Listings</button>
      <p className='text-red-700 mt-5'>{showListingsError ?'Error showing listing':''}</p>
      {userListings && userListings.length>0 && 
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
          {userListings.map((listing)=>{
          return <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
            <Link to={`/listing/${listing._id}`}>
              <img src ={listing.imageUrls[0]} alt = 'listing cover' className = 'h-16 w-16 object-contain'/>
            </Link>
            <Link className='flex-1 text-slate-700 font-semibold hover:underline truncate' to={`/listing/${listing._id}`}>
              <p className=''>{listing.name}</p>
            </Link>
            <div className='flex flex-col items-center'>
              <button onClick = {()=>handleDeleteListing(listing._id)}className='text-red-700 uppercase'>Delete</button>
              <Link to={`/update-listing/${listing._id}`}>
              <button className='text-green-700 uppercase'>Edit</button>
              </Link>
              
            </div>
          </div>
        })}
        </div>
      }
    </div>
  )
}

export default Profile