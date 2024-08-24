import React from 'react'
import { useDispatch } from 'react-redux'
import { signOutUserSuccess } from '../redux/user/userSlice';

const Home = () => {
  const dispatch=useDispatch();
  return (
    <>
          <div>Home</div>
          <button onClick={()=>dispatch(signOutUserSuccess())}>Sign out</button>

    </>

  )
}

export default Home