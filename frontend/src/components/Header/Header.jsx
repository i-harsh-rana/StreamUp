import React from 'react'
import Logo from '../../assets/StreamUp.svg'

function Header() {
  return (
    <header className='sticky top-0 z-30 bg-gray-box opacity-100 w-full p-5 pl-6 border-l-8 border-l-hopbush-main border-b-2 border-b-gray-400/10'>

        <a href="/">
        <img src={Logo} alt="" className='w-[11rem]'/>
        </a>
       
    </header>
  )
}

export default Header