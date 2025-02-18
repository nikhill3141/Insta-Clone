import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { useDispatch } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'

function LogIn() {
  const [input,setInput] = useState({email:"",password:""})
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const changeEventHandler = (e) => {
    const value = {...input,[e.target.name]:e.target.value}
    setInput(value)
  }

  const logInHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:8000/api/v1/user/login',input,
        {
        headers:{'content-type':'application/json'}, 
        withCredentials: true
      });

      if(res.data.success){
        dispatch(setAuthUser(res.data.user))
        toast(res.data.message)
        setInput({email:"",password:""})
        navigate('/')
      }

    } catch (error) {
      console.log(error+'form the login');
      toast.error(error.response.data.message) 
    }finally{
      setLoading(false)
      
    }
   
  }

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      
    <form onSubmit={logInHandler} className="shadow-lg flex flex-col gap-5 p-8 ">
      <div className="my-4">
        <h1 className="text-center font-bold text-xl">LOGO</h1>
        <p className="text-center text-sm">Login to see photos and videos from your friends </p>
      </div>
      
      <div>
        <span className=" font-medium">Email</span>
        <input name="email" value={input.email} onChange={changeEventHandler}  type="email" className="border-2 rounded flex outline-none p-2 my-1 w-full " />
      </div>
      <div>
        <span className=" font-medium">Password</span>
        <input name="password" value={input.password} onChange={changeEventHandler}  type="password" className="border-2 rounded flex outline-none p-2 my-1 w-full " />
      </div>
      {
        loading ? (<Button>
          <Loader2 className=''/> Please wait!
        </Button>) : (<Button type="submit" >Login</Button>)
      }
      
      <span className='text-center'>If do not have an Account <Link to={'/signup'} className='text-blue-500 '>Signup</Link></span>
    </form>
    
  </div>

  )
}

export default LogIn