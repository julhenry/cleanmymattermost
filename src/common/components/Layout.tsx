import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { MainContainer } from './MainContainer'
import { Footer } from './Footer';

export const Layout: React.FC = () => {
  return (
    <div style={{height: '70vh', marginTop: '15vh'}}>
        <Header/>
        <MainContainer>
            <Outlet/>
        </MainContainer>
        <Footer/>
    </div>
  )
}