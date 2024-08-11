import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute.jsx'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignOut from './pages/SignOut'
import Profile from './pages/Profile'
import About from './pages/About'
import SignUp from './pages/SignUp'
import Header from './components/Header'



const App = () => {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path='/' element ={<Home />}></Route>
        <Route path='/sign-in' element ={<SignIn />}></Route>
        <Route path='/sign-up' element ={<SignUp />}></Route>
        <Route element ={<PrivateRoute/>}>
          <Route path='/profile' element ={<Profile />}/>
        </Route>
        <Route path='/about' element ={<About />}></Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App