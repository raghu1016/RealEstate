import { Link ,useNavigate} from "react-router-dom"
import {useState} from "react";
import OAuth from "../components/OAuth";


const SignUp = () => {

  const [formData,setFormData] =  useState({});
  const [loading,setLoading] = useState(null);
  const [error,setError] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.id] : e.target.value,
    })
  }

  const handleSubmit = async(e)=>{
    try{
      e.preventDefault();
      setLoading(true);
      const res = await fetch("/api/auth/signup",
        {                    
          method:'POST',
          headers:{
            'Content-Type' : 'application/json',
          },
          body:JSON.stringify(formData)
        }
      );
  
      const data = await res.json();
      setLoading(false);
      if(data.success===false){
        setError(data.message);
        return;
      }
      console.log(data);
      setError(null);
      navigate('/sign-in');
    }
    catch(err){
      setLoading(false);
      setError(data.message);

    }
    

  }

  return (
    <div className='p-3 max-w-lg mx-auto '>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleChange}></input>
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email'onChange={handleChange}></input>
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password'onChange={handleChange}></input>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-80'>{loading?"Loading":"Sign Up"}</button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>
          Have an account?
        </p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">
            Sign In
          </span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
      <>
      <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify'>
              <FaShare className='text-slate-500' onCLick={()=>{navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(()=>{
                setCopied(false);
              },2000);}}/>
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2' >Link copied!</p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.name} - ${' '}
              {listing.offer ? listing.discountPrice.toLocaleString('en-US'):listing.regularPrice.toLocaleString('en-US')}
              {listing.type==='rent' && ' /month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600 text-sm'>
              <FaMapMarketAlt className='text=green-700'/>
              {listing.address}
            </p>
            <div className='flex gap-4'>

            </div>
          </div>
      </>
    </div>
  )
}

export default SignUp