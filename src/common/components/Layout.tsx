import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { MainContainer } from './MainContainer'
import { Footer } from './Footer';
import { Sidenav } from './Sidenav';
import './Layout.css'

export const Layout: React.FC = () => {
  return (
    <div className='Layout'>
        <div className='Layout_header'>
            <Header/>
        </div>
        <div className='Layout_main-container'>
            <MainContainer>
                <Outlet/>
            </MainContainer>
        </div>
        <div className='Layout_sidenav'>
            <Sidenav/>
        </div>
        <div className='Layout_footer'>
            <Footer/>
        </div>
    </div>
  )
}