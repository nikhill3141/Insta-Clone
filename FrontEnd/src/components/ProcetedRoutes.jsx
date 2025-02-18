import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function ProcetedRoutes({children}) {
  const {user} = useSelector(store=>store.auth)
  const navigate = useNavigate()

  useEffect(()=>{
    if(!user){
      navigate('/login')
    }else{
      navigate('/')
    }
  },[])
  return <>{children}</>
}

export default ProcetedRoutes;