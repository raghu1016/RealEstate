import React from 'react'
import { useDispatch } from 'react-redux'
import { signOutSuccess } from '../redux/user/userSlice';

const Home = () => {
  const dispatch=useDispatch();
  return (
    <>
          <div>Home</div>
          <button onClick={()=>dispatch(signOutSuccess())}>Sign out</button>

    </>

  )
}

export default Home