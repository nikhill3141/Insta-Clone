import axios from "axios";
import {  Loader2 } from "lucide-react";
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";


export default function SignUp() {
    const [input, setInput] = useState({
      username:"",
      email:"",
      password:""
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    

    const changeEventHandler = (e) => {
      setInput( {...input,[e.target.name]:e.target.value});
    }
    const signupHandler = async (e) => {
      e.preventDefault();
      setLoading(true)
      try {
        const res = await axios.post("https://insta-clone-made-by-nik.onrender.com/api/v1/user/register", input,
           {
            headers:{'content-type':'application/json'}, 
            wihtCredentials: true
          });
         
          if(res.data.success){
            toast(res.data.message)
            setInput({
              username:"",
              email:"",
              password:""
            })
            navigate('/login')
          }
        
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message)
      }finally{
        setLoading(false)
      }
      
    }
    
  return (
    <div className="flex items-center w-screen h-screen justify-center">
      
      <form onSubmit={signupHandler} className="shadow-lg flex flex-col gap-5 p-8 ">
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">LOGO</h1>
          <p className="text-center text-sm">Signup to see photos and videos from your friends </p>
        </div>
        <div>
          <span className=" font-medium">Username</span>
          <input name="username" value={input.username} onChange={changeEventHandler}  type="text" className="border-2 rounded flex outline-none p-2 my-1 w-full " />
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
          loading ? (
            <Button>
              <Loader2 className="h-4 w-4 "/> please wait!
            </Button>

          ) : (<Button type="submit" >Signup</Button>)
        }
        
        <span className='text-center'>Already have an account <Link to={'/login'} className='text-blue-500 '>Login</Link></span>
      </form>
      
    </div>
  )
}
