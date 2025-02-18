
import { useEffect } from "react";
import ChatPage from "./components/ChatPage";
import EditProfile from "./components/EditProfile";
import Home from "./components/Home";
import LogIn from "./components/LogIn";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import SignUp from "./components/SignUp";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {io} from 'socket.io-client'
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";
import ProcetedRoutes from "./components/ProcetedRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProcetedRoutes><MainLayout /></ProcetedRoutes> ,
    children: [
      {
        path: "/",
        element: <ProcetedRoutes ><Home /></ProcetedRoutes>,
      },
      {
        path: "/profile/:id",
        element: <ProcetedRoutes><Profile /></ProcetedRoutes> ,
      },
      { 
        path: "/edit",
        element:<ProcetedRoutes><EditProfile /></ProcetedRoutes> 
      },
      {
        path:"/chat",
        element: <ProcetedRoutes><ChatPage/></ProcetedRoutes>
      },

    ],
  },
  {
    path: "/signup",
    element:<ProcetedRoutes><SignUp /></ProcetedRoutes> ,
  },
  {
    path: "/login",
    element: <ProcetedRoutes><LogIn /></ProcetedRoutes>,
  },
]);

function App() {
  const {user} = useSelector(store => store.auth)
  const dispatch = useDispatch()
  const {socket} = useSelector((store)=>store.socketio)
  useEffect(()=>{
    if(user){
      const socketio = io('http://localhost:8000',{
        query:{
          userId:user._id
        },
        transports:['websocket']
      })
      dispatch(setSocket(socketio))

      //listen all events
      socketio.on('getOnlineUsers',(onlineUsers)=>{
        dispatch(setOnlineUsers(onlineUsers))
      })
      socketio.on('notification', (notification)=>{
        dispatch(setLikeNotification(notification))
      })

      return ()=>{
        socketio.close()
        dispatch(setSocket(null))
      }
    }
    else if(socket){
      socket.close()
      dispatch(setSocket(null))

    }

  },[user,dispatch])

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
