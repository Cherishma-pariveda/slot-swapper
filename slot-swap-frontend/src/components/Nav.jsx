import React from 'react'
import { Link } from 'react-router-dom'

function Nav() {
  return (
    <>
    <div className='flex justify-between bg-black min-h-16 items-center text-[22px] text-white decoration-none font-bold'>
        <div className='ml-10'>
            <Link to="/"  >Home</Link>
        </div>
        <div className=' mr-10 flex gap-5 '>
            <Link to="/login" >Login</Link>
            <Link to="/signup">Sign up</Link>
        </div>
        
    </div>
   
    </>
  )
}

export default Nav