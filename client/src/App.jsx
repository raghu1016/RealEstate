import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute.jsx'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignOut from './pages/SignOut'
import Profile from './pages/Profile'
import About from './pages/About'
import SignUp from './pages/SignUp'
import CreateListing from './pages/CreateListing.jsx'
import EditListing from './pages/EditListing.jsx'
import Header from './components/Header'
import Listing from './pages/Listing.jsx'
import Search from './pages/Search.jsx'



const App = () => {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path='/' element ={<Home />}></Route>
        <Route path='/sign-in' element ={<SignIn />}></Route>
        <Route path='/sign-up' element ={<SignUp />}></Route>
        <Route path='/listing/:listingId' element ={<Listing/>}/>
        <Route path='/about' element ={<About />}></Route>
        <Route path='/search' element ={<Search />}></Route>
        <Route element ={<PrivateRoute/>}>
          <Route path='/profile' element ={<Profile />}/>
          <Route path='/create-listing' element ={<CreateListing />}/>
          <Route path='/update-listing/:listingId' element ={<EditListing />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App